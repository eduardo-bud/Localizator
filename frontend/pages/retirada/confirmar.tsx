import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Home, ArrowLeft, Package, X, Check } from "lucide-react";
import { fetchAPI } from "../../utils/api";

interface Material {
  id_material: number;
  codigo_material: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  estoque_minimo: number;
  estoque_atual: number;
}

interface Message {
  type: "success" | "error";
  text: string;
}

export default function ConfirmarRetiradaPage() {
  const router = useRouter();
  const { materialId } = router.query;
  
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<Material | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [message, setMessage] = useState<Message | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("usuario");
      localStorage.removeItem("cargo");
      localStorage.removeItem("tokenExpiry");
      router.push("/login");
      return;
    }

    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    }
    setAutenticado(true);
  }, []);

  // Buscar material
  useEffect(() => {
    if (!materialId) return;

    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const response = await fetchAPI(`/api/materials/${materialId}`, { method: "GET" });
        const data = await response.json();
        setMaterial(data);
      } catch (error) {
        console.error("Erro ao buscar material:", error);
        setMessage({ type: "error", text: "Erro ao carregar material. Tente novamente." });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  const handleConfirmarRetirada = async () => {
    if (!quantidade || parseInt(quantidade) <= 0) {
      setMessage({ type: "error", text: "Digite uma quantidade válida." });
      return;
    }

    if (material && parseInt(quantidade) > material.estoque_atual) {
      setMessage({ type: "error", text: "Quantidade maior que o estoque disponível." });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetchAPI(`/api/retirada`, {
        method: "POST",
        body: JSON.stringify({
          id_material: material?.id_material,
          quantidade: parseInt(quantidade),
          motivo: motivo || "",
          observacao: observacao || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Retirada realizada com sucesso!" });
        setTimeout(() => {
          router.push("/retirada");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Erro ao processar retirada." });
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage({ type: "error", text: "Erro ao processar retirada. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
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

  if (!material) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <header style={{ backgroundColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "white", padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "500", transition: "all 0.3s", padding: 0 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
              <ArrowLeft size={24} />
              Voltar
            </button>
          </div>
        </header>
        <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
          <div style={{ backgroundColor: "white", borderRadius: "0.75rem", padding: "3rem", textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <Package size={48} style={{ color: "#cbd5e1", margin: "0 auto 1rem" }} />
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", margin: 0 }}>Material não encontrado</p>
          </div>
        </main>
      </div>
    );
  }

  if (!autenticado || loading || !material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  const isLowStock = material.estoque_atual <= material.estoque_minimo;
  const isOutOfStock = material.estoque_atual === 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        button:hover { opacity: 0.9; transition: all 0.2s; }
        input, textarea, select { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <header style={{ backgroundColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "white", padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "transparent", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "500", transition: "all 0.3s", padding: 0 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            <ArrowLeft size={24} />
            Voltar
          </button>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>Confirmar Retirada</h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => router.push("/hub")} style={{ backgroundColor: "#1e293b", color: "white", border: "1px solid #1e293b", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: "500", transition: "all 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0f172a"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1e293b"; }}>
              <Home size={18} />
              Home
            </button>
            <button onClick={handleLogout} style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: "500", transition: "all 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.9)"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"; }}>
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Mensagens */}
        {message && (
          <div style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            backgroundColor: message.type === "success" ? "#ecfdf5" : "#fee2e2",
            color: message.type === "success" ? "#047857" : "#dc2626",
            border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`
          }}>
            {message.type === "success" ? <Check size={20} /> : <X size={20} />}
            {message.text}
          </div>
        )}

        {/* Formulário de Retirada */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem"
        }}>
          {/* Informações do Material */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "3rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0"
          }}>
            <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "bold", color: "#1e293b" }}>Informações do Material</h2>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#3b82f6",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                fontWeight: "bold"
              }}>
                {material.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b" }}>{material.nome}</h3>
                <p style={{ margin: "0", fontSize: "0.95rem", color: "#64748b" }}>Código: <span style={{ fontFamily: "monospace", fontWeight: "bold", color: "#3b82f6" }}>{material.codigo_material}</span></p>
              </div>
            </div>

            {material.descricao && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Descrição</p>
                <p style={{ margin: "0", fontSize: "0.95rem", color: "#1e293b" }}>{material.descricao}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Categoria</p>
                <p style={{ margin: "0", fontSize: "0.95rem", color: "#1e293b", fontWeight: "500" }}>{material.categoria}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Unidade</p>
                <p style={{ margin: "0", fontSize: "0.95rem", color: "#1e293b", fontWeight: "500" }}>{material.unidade_medida}</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "1.5rem 0" }} />

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Estoque Atual</p>
              <div style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem"
              }}>
                <span style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: isOutOfStock ? "#dc2626" : isLowStock ? "#f97316" : "#059669"
                }}>
                  {material.estoque_atual}
                </span>
                <span style={{ fontSize: "1rem", color: "#64748b", fontWeight: "500" }}>{material.unidade_medida}</span>
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                {isOutOfStock && (
                  <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>
                    Sem Estoque
                  </span>
                )}
                {isLowStock && !isOutOfStock && (
                  <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#fed7aa",
                    color: "#b45309",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>
                    Estoque Baixo
                  </span>
                )}
                {!isLowStock && !isOutOfStock && (
                  <span style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dcfce7",
                    color: "#059669",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>
                    Disponível
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>Estoque Mínimo</p>
              <p style={{ margin: "0", fontSize: "1.1rem", color: "#1e293b", fontWeight: "bold" }}>{material.estoque_minimo} {material.unidade_medida}</p>
            </div>
          </div>

          {/* Formulário de Confirmação */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "3rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0"
          }}>
            <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "bold", color: "#1e293b" }}>Realizar Retirada</h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>
                Quantidade <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Digite a quantidade"
                min="1"
                max={material.estoque_atual}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  color: "#1e293b",
                  boxSizing: "border-box"
                }}
              />
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: "#64748b" }}>Máximo disponível: {material.estoque_atual} {material.unidade_medida}</p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>
                Motivo
              </label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Manutenção, Uso, Descarte"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#1e293b" }}>
                Observações
              </label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Adicione detalhes adicionais sobre a retirada"
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => router.back()}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = "#e2e8f0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.backgroundColor = "#f1f5f9";
                  }
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarRetirada}
                disabled={submitting || !quantidade}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: submitting || !quantidade ? "not-allowed" : "pointer",
                  opacity: submitting || !quantidade ? 0.6 : 1,
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  if (!submitting && quantidade) {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && quantidade) {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                  }
                }}
              >
                {submitting ? "Processando..." : "Confirmar Retirada"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
