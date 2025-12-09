import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Plus, ArrowRight, Home } from "lucide-react";

interface Pedido {
  id_pedido?: number;
  id: string;
  dataHora: string;
  status: string;
  responsavel: string;
}

export default function PedidosPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  useEffect(() => {
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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  const handleNovopedido = () => {
    router.push("/pedido?novo=true");
  };

  const handleConsultarPedidos = async () => {
    setLoadingPedidos(true);
    // Aqui você pode buscar pedidos do backend se houver um endpoint
    // Por enquanto, apenas navegamos para a página de consulta de pedidos
    setLoadingPedidos(false);
    router.push("/consultar-pedidos");
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
        button:hover { opacity: 0.9; transform: translateY(-2px); transition: all 0.2s; }
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
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "bold", color: "#000" }}>Gerenciamento de Pedidos</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>Selecione uma ação para continuar</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => router.push("/")}
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginTop: "3rem",
          }}
        >
          {/* Card: Novo Pedido */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <Plus size={40} color="#3b82f6" />
              </div>
              <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "600", color: "#1e293b" }}>
                Criar Novo Pedido
              </h2>
              <p style={{ margin: "0 0 2rem 0", color: "#64748b", fontSize: "0.95rem" }}>
                Inicie um novo pedido de materiais. Você poderá adicionar itens, materiais e enviar para aprovação.
              </p>
              <button
                onClick={handleNovopedido}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }}
              >
                <Plus size={20} />
                Novo Pedido
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Card: Consultar Pedidos */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#ecfdf5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M7 4v4H3m14-4v4h4"></path>
                </svg>
              </div>
              <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "600", color: "#1e293b" }}>
                Consultar Pedidos
              </h2>
              <p style={{ margin: "0 0 2rem 0", color: "#64748b", fontSize: "0.95rem" }}>
                Visualize e gerencie pedidos já criados. Acompanhe o status, edite ou aprove solicitações.
              </p>
              <button
                onClick={handleConsultarPedidos}
                disabled={loadingPedidos}
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.5rem",
                  cursor: loadingPedidos ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.3s",
                  opacity: loadingPedidos ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loadingPedidos) {
                    e.currentTarget.style.backgroundColor = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loadingPedidos) {
                    e.currentTarget.style.backgroundColor = "#10b981";
                  }
                }}
              >
                {loadingPedidos ? "Carregando..." : "Consultar Pedidos"}
                {!loadingPedidos && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div
          style={{
            backgroundColor: "#f0f9ff",
            borderRadius: "0.75rem",
            padding: "2rem",
            marginTop: "3rem",
            border: "1px solid #bfdbfe",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: "600", color: "#1e40af" }}>
            ℹ️ Informações
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1e40af" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Novo Pedido:</strong> Inicie uma solicitação nova com itens e materiais específicos
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Consultar Pedidos:</strong> Veja todos os pedidos criados, seus status e histórico
            </li>
            <li>
              <strong>Materiais:</strong> Você pode adicionar materiais existentes ou criar novos durante o processo
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
