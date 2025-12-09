import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Plus, Eye, Trash2, Edit2, Home, ChevronLeft } from "lucide-react";
import { fetchAPI } from "../utils/api";

interface Pedido {
  id_pedido?: number;
  id: string;
  dataHora: string;
  status: "aberto" | "aprovado" | "rejeitado" | "concluído";
  responsavel: string;
  tipo: string;
  observacoes?: string;
}

export default function ConsultarPedidosPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: "PED-2025-001",
      dataHora: "05/12/2025 14:30",
      status: "aberto",
      responsavel: "João Silva",
      tipo: "geral",
      observacoes: "Pedido de materiais para manutenção",
    },
    {
      id: "PED-2025-002",
      dataHora: "06/12/2025 09:15",
      status: "aprovado",
      responsavel: "Maria Santos",
      tipo: "urgente",
      observacoes: "Pedido de ferramentas especiais",
    },
    {
      id: "PED-2025-003",
      dataHora: "07/12/2025 16:45",
      status: "concluído",
      responsavel: "Pedro Costa",
      tipo: "geral",
      observacoes: "Pedido de material de escritório",
    },
  ]);

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

    if (cargo !== "administrador") {
      router.push("/login");
      return;
    }

    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) {
      try {
        const parsed = JSON.parse(usuarioData);
        setUsuario(parsed);
      } catch (e) {
        console.error("Erro ao parsear usuário:", e);
      }
    }

    setAutenticado(true);
    setLoading(false);
  }, [router.isReady]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  const handleViewPedido = (pedidoId: string) => {
    router.push(`/pedido?consultar=true&id=${pedidoId}`);
  };

  const handleEditPedido = (pedidoId: string) => {
    router.push(`/pedido?editar=true&id=${pedidoId}`);
  };

  const handleDeletePedido = async (pedidoId: string) => {
    if (!confirm(`Tem certeza que deseja deletar o pedido ${pedidoId}?`)) return;

    try {
      // TODO: Implementar chamada DELETE /api/pedidos/:id
      // const response = await fetchAPI(`/api/pedidos/${pedidoId}`, {
      //   method: "DELETE",
      // });

      // Por enquanto, remove do estado local
      setPedidos(pedidos.filter(p => p.id !== pedidoId));
      alert("Pedido deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      alert("Erro ao deletar pedido");
    }
  };

  const handleUpdateStatus = async (pedidoId: string) => {
    if (!editingStatus) return;

    try {
      // TODO: Implementar chamada PUT /api/pedidos/:id
      // const response = await fetchAPI(`/api/pedidos/${pedidoId}`, {
      //   method: "PUT",
      //   body: JSON.stringify({ status: editingStatus }),
      // });

      // Por enquanto, atualiza no estado local
      setPedidos(pedidos.map(p =>
        p.id === pedidoId ? { ...p, status: editingStatus as any } : p
      ));
      setEditingId(null);
      setEditingStatus("");
      alert("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return { bg: "#fef3c7", border: "#f59e0b", text: "#d97706" };
      case "aprovado":
        return { bg: "#ecfdf5", border: "#10b981", text: "#047857" };
      case "rejeitado":
        return { bg: "#fee2e2", border: "#ef4444", text: "#dc2626" };
      case "concluído":
        return { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" };
      default:
        return { bg: "#f0f9ff", border: "#3b82f6", text: "#1e40af" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberto":
        return "Aberto";
      case "aprovado":
        return "Aprovado";
      case "rejeitado":
        return "Rejeitado";
      case "concluído":
        return "Concluído";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", color: "#64748b", marginBottom: "1rem" }}>Carregando...</div>
          <div
            style={{
              width: "2rem",
              height: "2rem",
              border: "3px solid #e2e8f0",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          />
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
        button:hover { opacity: 0.9; transition: all 0.2s; }
        tr:hover { backgroundColor: "#f8fafc"; }
      `}</style>

      {/* Header */}
      <header
        style={{
          backgroundColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
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
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "bold", color: "#000" }}>Consultar Pedidos</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
              Lista de todos os pedidos criados no sistema
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => router.push("/pedidos")}
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
                e.currentTarget.style.backgroundColor = "rgba(96, 165, 250, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }}
            >
              <ChevronLeft size={18} />
              Voltar
            </button>
            <button
              onClick={() => router.push("/hub")}
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
                e.currentTarget.style.backgroundColor = "rgba(96, 165, 250, 0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }}
            >
              <Home size={18} />
              Hub
            </button>
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
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          {pedidos.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#94a3b8",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ margin: "0 auto 1rem", opacity: 0.5 }}
              >
                <path d="M9 12l2 2 4-4m7-0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Nenhum pedido encontrado</p>
              <p style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
                Crie um novo pedido para começar
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #cbd5e1" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                      ID
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                      Data/Hora
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                      Responsável
                    </th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                      Tipo
                    </th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>
                      Status
                    </th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => {
                    const statusColor = getStatusColor(pedido.status);
                    return (
                      <tr key={pedido.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                        <td style={{ padding: "1rem", color: "#1e293b", fontWeight: "600" }}>
                          {pedido.id}
                        </td>
                        <td style={{ padding: "1rem", color: "#1e293b" }}>
                          {pedido.dataHora}
                        </td>
                        <td style={{ padding: "1rem", color: "#1e293b" }}>
                          {pedido.responsavel}
                        </td>
                        <td style={{ padding: "1rem", color: "#1e293b" }}>
                          <span
                            style={{
                              textTransform: "capitalize",
                              backgroundColor: "#f1f5f9",
                              color: "#475569",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "0.375rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            {pedido.tipo}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          {editingId === pedido.id ? (
                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                              <select
                                value={editingStatus}
                                onChange={(e) => setEditingStatus(e.target.value)}
                                style={{
                                  padding: "0.5rem",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "0.375rem",
                                  backgroundColor: "white",
                                  color: "#1e293b",
                                  fontSize: "0.85rem",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="aberto">Aberto</option>
                                <option value="aprovado">Aprovado</option>
                                <option value="rejeitado">Rejeitado</option>
                                <option value="concluído">Concluído</option>
                              </select>
                              <button
                                onClick={() => handleUpdateStatus(pedido.id)}
                                style={{
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  border: "none",
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingStatus("");
                                }}
                                style={{
                                  backgroundColor: "#64748b",
                                  color: "white",
                                  border: "none",
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.75rem",
                                  fontWeight: "500",
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: statusColor.bg,
                                color: statusColor.text,
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                border: `1px solid ${statusColor.border}`,
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                textTransform: "capitalize",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setEditingId(pedido.id);
                                setEditingStatus(pedido.status);
                              }}
                              title="Clique para editar"
                            >
                              {getStatusLabel(pedido.status)}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "1rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                            <button
                              onClick={() => handleViewPedido(pedido.id)}
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#2563eb";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#3b82f6";
                              }}
                            >
                              <Eye size={16} />
                              Visualizar
                            </button>
                            <button
                              onClick={() => handleEditPedido(pedido.id)}
                              style={{
                                backgroundColor: "#8b5cf6",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#7c3aed";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#8b5cf6";
                              }}
                            >
                              <Edit2 size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeletePedido(pedido.id)}
                              style={{
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                                fontWeight: "500",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#dc2626";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#ef4444";
                              }}
                            >
                              <Trash2 size={16} />
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
