import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Plus, Trash2, Download, Save, Send, X, Check, AlertCircle, Home, Upload } from "lucide-react";
import MaterialModal from "../components/MaterialModal";
// @ts-ignore
import * as XLSX from 'xlsx';

interface OrderItem {
  id_material: number;
  nome: string;
  quantidade: number;
  unidade_medida: string;
}

interface Material {
  id_material: number;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  estoque_atual: number;
}

export default function PedidoPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNovoMode, setIsNovoMode] = useState(true);
  const [itens, setItens] = useState<OrderItem[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [orderData, setOrderData] = useState({
    id: "PED-" + new Date().getFullYear() + "-" + String(Math.random() * 10000 | 0).padStart(5, '0'),
    dataHora: new Date().toLocaleString("pt-BR"),
    tipo: "geral",
    responsavel: "",
    status: "aberto",
    observacoes: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    // Verificar autenticação com JWT
    const token = localStorage.getItem("accessToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const cargo = localStorage.getItem("cargo");

    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");
      localStorage.removeItem("cargo");
      localStorage.removeItem("tokenExpiry");
      router.push("/login");
      return;
    }
    
    // Verificar query params
    if (router.query.novo === "true") {
      setIsNovoMode(true);
      setItens([]);
    } else if (router.query.consultar === "true") {
      setIsNovoMode(false);
    }
    
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      try {
        const parsed = JSON.parse(usuarioData);
        setUsuario(parsed);
        setOrderData(prev => ({ ...prev, responsavel: parsed.nome_usuario || "Admin" }));
      } catch (e) {
        console.error("Erro ao parsear usuário:", e);
      }
    }
    
    setAutenticado(true);
    setLoading(false);
  }, [router.isReady]);

  // Importação de Excel com cadastro automático de novos materiais
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const reader = new FileReader();

      reader.onload = async (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const token = localStorage.getItem('accessToken');
        const novosMateriais: OrderItem[] = [];
        const materiaisParaCadastrar: any[] = [];
        const errosLocal: string[] = [];

        // Processa cada linha do Excel
        for (const row of jsonData as any[]) {
          if (!row.nome || !row.quantidade) {
            errosLocal.push(`Linha incompleta: faltam campos obrigatórios`);
            continue;
          }

          try {
            // Buscar material existente
            const materiaisResponse = await fetch('http://localhost:3001/api/materials', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const materiais: Material[] = await materiaisResponse.json();
            
            let material = materiais.find(m => 
              m.nome.toLowerCase() === row.nome.toLowerCase()
            );

            if (!material) {
              // Material não existe - preparar para cadastro
              materiaisParaCadastrar.push({
                nome: row.nome.trim(),
                descricao: row.descricao || `Importado via pedido ${orderData.id}`,
                categoria: row.categoria || 'Importado',
                unidade_medida: row.unidade_medida || 'UN',
                estoque_minimo: 0,
                estoque_atual: parseFloat(row.quantidade) || 0
              });
            } else {
              // Material existe - adicionar ao pedido
              novosMateriais.push({
                id_material: material.id_material,
                nome: material.nome,
                quantidade: parseFloat(row.quantidade) || 1,
                unidade_medida: material.unidade_medida
              });
            }
          } catch (err) {
            errosLocal.push(`Erro ao processar: ${row.nome}`);
          }
        }

        // Cadastrar novos materiais se houver
        if (materiaisParaCadastrar.length > 0) {
          try {
            const response = await fetch('http://localhost:3001/api/materials/import/excel', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ materiais: materiaisParaCadastrar })
            });

            if (response.ok) {
              const result = await response.json();
              
              // Recarregar materiais para obter IDs dos cadastrados
              const materiaisReloadResponse = await fetch('http://localhost:3001/api/materials', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const materiaisAtualizados: Material[] = await materiaisReloadResponse.json();
              
              // Adicionar os materiais cadastrados ao pedido
              for (const m of materiaisParaCadastrar) {
                const materialCriado = materiaisAtualizados.find(
                  mat => mat.nome.toLowerCase() === m.nome.toLowerCase()
                );
                if (materialCriado) {
                  novosMateriais.push({
                    id_material: materialCriado.id_material,
                    nome: materialCriado.nome,
                    quantidade: parseFloat(m.estoque_atual) || 1,
                    unidade_medida: materialCriado.unidade_medida
                  });
                }
              }

              setSuccess(`${result.importados} novos materiais foram cadastrados automaticamente!`);
            }
          } catch (err) {
            setError(`Erro ao cadastrar materiais: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
          }
        }

        // Adicionar itens ao pedido
              setItens([...itens, ...novosMateriais]);
        
        if (novosMateriais.length > 0) {
          setSuccess(`${novosMateriais.length} materiais adicionados ao pedido!`);
        }

        if (errosLocal.length > 0) {
          setError(`Alguns erros ocorreram: ${errosLocal.join(', ')}`);
        }

        setTimeout(() => {
          setSuccess('');
          setError('');
        }, 5000);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar arquivo');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        nome: 'Parafuso M8',
        quantidade: 100,
        unidade_medida: 'CX',
        descricao: 'Parafuso aço inoxidável',
        categoria: 'Fixadores'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedido');
    XLSX.writeFile(workbook, 'template_pedido.xlsx');

    setSuccess('Template baixado com sucesso!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleAddItem = (material: Material, quantidade: number) => {
    const itemExistente = itens.find(i => i.id_material === material.id_material);
    
    if (itemExistente) {
      setItens(itens.map(i => 
        i.id_material === material.id_material 
          ? { ...i, quantidade: i.quantidade + quantidade }
          : i
      ));
    } else {
      setItens([...itens, {
        id_material: material.id_material,
        nome: material.nome,
        quantidade: quantidade,
        unidade_medida: material.unidade_medida
      }]);
    }
    
    setSuccess("Material adicionado ao pedido!");
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteItem = (id_material: number) => {
    setItens(itens.filter(i => i.id_material !== id_material));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "1rem" }}>Carregando...</div>
          <div style={{ width: "2rem", height: "2rem", border: "3px solid #e2e8f0", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover { opacity: 0.9; transform: translateY(-2px); transition: all 0.2s; }
      `}</style>

      {/* Header Premium */}
      <header style={{
        backgroundColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        color: "white",
        padding: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => router.push("/hub")}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#000",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "500",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(96, 165, 250, 0.9)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "#000";
            }}
          >
            <Home size={18} />
            Home
          </button>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "bold", color: "#000" }}>Geração de Pedido</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Sistema de controle de solicitações de materiais</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: "500",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }}
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Informações do Pedido */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}>
          <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
            Informações do Pedido
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {/* ID do Pedido */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                ID do Pedido
              </label>
              <input
                type="text"
                value={orderData.id}
                readOnly
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  fontSize: "0.95rem",
                  cursor: "not-allowed"
                }}
              />
            </div>

            {/* Data/Hora */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                Data e Hora
              </label>
              <input
                type="text"
                value={orderData.dataHora}
                readOnly
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  backgroundColor: "#f8fafc",
                  color: "#1e293b",
                  fontSize: "0.95rem",
                  cursor: "not-allowed"
                }}
              />
            </div>

            {/* Tipo */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                Tipo de Pedido
              </label>
              <select
                value={orderData.tipo}
                onChange={(e) => setOrderData({ ...orderData, tipo: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  color: "#1e293b",
                  fontSize: "0.95rem",
                  cursor: "pointer"
                }}
              >
                <option value="geral">Geral</option>
                <option value="projeto">Para Projeto</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>

            {/* Responsável */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                Responsável
              </label>
              <input
                type="text"
                value={orderData.responsavel}
                onChange={(e) => setOrderData({ ...orderData, responsavel: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  color: "#1e293b",
                  fontSize: "0.95rem"
                }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                Status
              </label>
              <select
                value={orderData.status}
                onChange={(e) => setOrderData({ ...orderData, status: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  color: "#1e293b",
                  fontSize: "0.95rem",
                  cursor: "pointer"
                }}
              >
                <option value="aberto">Aberto</option>
                <option value="aguardando">Aguardando Aprovação</option>
                <option value="processando">Processando</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
              Observações
            </label>
            <textarea
              value={orderData.observacoes}
              onChange={(e) => setOrderData({ ...orderData, observacoes: e.target.value })}
              placeholder="Digite observações ou instruções especiais..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                backgroundColor: "white",
                color: "#1e293b",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                minHeight: "100px",
                resize: "vertical"
              }}
            />
          </div>

          {/* Alertas */}
          {error && (
            <div style={{ marginTop: "1.5rem", backgroundColor: "#fee2e2", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "1rem", color: "#991b1b", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <div>{error}</div>
            </div>
          )}
          {success && (
            <div style={{ marginTop: "1.5rem", backgroundColor: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "0.5rem", padding: "1rem", color: "#166534", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <Check size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
              <div>{success}</div>
            </div>
          )}
        </div>

        {/* Tabela de Itens */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
              Itens do Pedido ({itens.length})
            </h2>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: "500"
                }}
              >
                <Plus size={18} />
                Adicionar Item
              </button>
              
              <label style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: "500"
              }}>
                <Upload size={18} />
                Importar Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  style={{ display: "none" }}
                  disabled={loading}
                />
              </label>

              <button
                onClick={handleDownloadTemplate}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: "500"
                }}
              >
                <Download size={18} />
                Template
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>Material</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>Quantidade</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>Unidade</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.id_material} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#fafbfc" }}>
                    <td style={{ padding: "1rem", color: "#1e293b", fontWeight: "500" }}>{item.nome}</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#1e293b", fontWeight: "500" }}>{item.quantidade}</td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#64748b" }}>{item.unidade_medida}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button
                        onClick={() => handleDeleteItem(item.id_material)}
                        style={{
                          backgroundColor: "transparent",
                          color: "#ef4444",
                          border: "1px solid #fecaca",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.85rem"
                        }}
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {itens.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              color: "#94a3b8"
            }}>
              <AlertCircle size={32} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
              <p>Nenhum item adicionado. Clique em "Adicionar Item" ou importe um arquivo Excel.</p>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => {
              setOrderData({ id: "PED-2025-001234", dataHora: new Date().toLocaleString("pt-BR"), tipo: "geral", responsavel: usuario?.nome_usuario || "Admin", status: "aberto", observacoes: "" });
              setItens([]);
            }}
            style={{
              backgroundColor: "#f1f5f9",
              color: "#475569",
              border: "1px solid #cbd5e1",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "500"
            }}
          >
            <X size={18} />
            Cancelar
          </button>

          <button
            onClick={() => alert("Pedido salvo com sucesso!")}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "500"
            }}
          >
            <Save size={18} />
            Salvar Pedido
          </button>

          <button
            onClick={() => alert("Pedido enviado para aprovação!")}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "500"
            }}
          >
            <Send size={18} />
            Enviar para Aprovação
          </button>
        </div>
      </main>

      {/* Material Modal */}
      <MaterialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleAddItem}
      />
    </div>
  );
}
