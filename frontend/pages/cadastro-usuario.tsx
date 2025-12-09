import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Plus, Trash2, Edit2, Check, X, AlertCircle, Eye, EyeOff, Home } from "lucide-react";
import { fetchAPI } from "../utils/api";

interface Usuario {
  id_usuario: number;
  nome_usuario: string;
  cargo: string;
  ativo: boolean;
  criado_em: string;
}

interface FormData {
  nome_usuario: string;
  senha: string;
  cargo: "administrador" | "funcionário";
}

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nome_usuario: "",
    senha: "",
    cargo: "funcionário",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCargo, setEditingCargo] = useState<string>("");
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

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
    fetchUsuarios();
  }, [router]);

  const fetchUsuarios = async () => {
    try {
      const response = await fetchAPI("/api/usuarios");
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Erro ao buscar usuários:', response.status, response.statusText);
        setMessage({ type: "error", text: `Erro ao carregar usuários (${response.status})` });
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setMessage({ type: "error", text: `Erro ao carregar usuários: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage(null);

    try {
      if (!formData.nome_usuario || !formData.senha) {
        setMessage({ type: "error", text: "Nome de usuário e senha são obrigatórios" });
        setLoadingSubmit(false);
        return;
      }

      const response = await fetchAPI("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Erro ao parsear resposta JSON:', parseError);
        console.error('Response status:', response.status);
        setMessage({ type: "error", text: `Erro na resposta do servidor: ${response.status}` });
        setLoadingSubmit(false);
        return;
      }

      if (response.ok) {
        setMessage({ type: "success", text: "Usuário criado com sucesso!" });
        setFormData({ nome_usuario: "", senha: "", cargo: "funcionário" });
        setTimeout(() => fetchUsuarios(), 500);
      } else {
        setMessage({ type: "error", text: data.error || `Erro ao criar usuário (${response.status})` });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMessage({ type: "error", text: `Erro na requisição: ${error.message}` });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const response = await fetchAPI(`/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Usuário deletado com sucesso!" });
        fetchUsuarios();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Erro ao deletar usuário" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro na requisição" });
    }
  };

  const handleUpdateCargo = async (id: number) => {
    if (!editingCargo) return;

    try {
      const response = await fetchAPI(`/api/usuarios/${id}`, {
        method: "PUT",
        body: JSON.stringify({ cargo: editingCargo }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Cargo atualizado com sucesso!" });
        setEditingId(null);
        setEditingCargo("");
        fetchUsuarios();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Erro ao atualizar cargo" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro na requisição" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    router.push("/login");
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
      `}</style>

      {/* Header Premium */}
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
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "bold", color: "#000" }}>
              Gerenciamento de Usuários
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
              Cadastro e administração de usuários do sistema
            </p>
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
        {/* Mensagem de Feedback */}
        {message && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: message.type === "success" ? "#ecfdf5" : "#fee2e2",
              color: message.type === "success" ? "#047857" : "#dc2626",
              border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`,
            }}
          >
            {message.type === "success" ? <Check size={20} /> : <X size={20} />}
            {message.text}
          </div>
        )}

        {/* Formulário de Cadastro */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "3rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
            Novo Usuário
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", marginBottom: "2rem" }}>
              {/* Nome de Usuário */}
              <div style={{ flex: "2 1 300px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  value={formData.nome_usuario}
                  onChange={(e) => setFormData({ ...formData, nome_usuario: e.target.value })}
                  placeholder="Digite o nome de usuário"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                    color: "#1e293b",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Senha */}
              <div style={{ flex: "1.6 1 280px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Digite a senha"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      paddingRight: "2.5rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.5rem",
                      backgroundColor: "white",
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      padding: "0.25rem",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Cargo */}
              <div style={{ flex: "1.2 1 200px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Cargo
                </label>
                <select
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value as any })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    backgroundColor: "white",
                    color: "#1e293b",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="funcionário">Funcionário</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                cursor: loadingSubmit ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: "500",
                opacity: loadingSubmit ? 0.7 : 1,
              }}
            >
              <Plus size={18} />
              {loadingSubmit ? "Criando..." : "Criar Usuário"}
            </button>
          </form>
        </div>

        {/* Lista de Usuários */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
            Usuários Cadastrados
          </h2>

          {/* Tabela */}
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
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>ID</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>
                    Nome de Usuário
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569" }}>Cargo</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>
                    Criado em
                  </th>
                  <th style={{ padding: "1rem", textAlign: "center", fontWeight: "600", color: "#475569" }}>
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usr) => (
                  <tr key={usr.id_usuario} style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#fafbfc" }}>
                    <td style={{ padding: "1rem", color: "#1e293b", fontWeight: "500" }}>{usr.id_usuario}</td>
                    <td style={{ padding: "1rem", color: "#1e293b" }}>{usr.nome_usuario}</td>
                    <td style={{ padding: "1rem", color: "#1e293b" }}>
                      {editingId === usr.id_usuario ? (
                        <select
                          value={editingCargo}
                          onChange={(e) => setEditingCargo(e.target.value)}
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
                          <option value="funcionário">Funcionário</option>
                          <option value="administrador">Administrador</option>
                        </select>
                      ) : (
                        <span
                          style={{
                            backgroundColor: usr.cargo === "administrador" ? "#dbeafe" : "#fef3c7",
                            color: usr.cargo === "administrador" ? "#1e40af" : "#92400e",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {usr.cargo}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          backgroundColor: usr.ativo ? "#ecfdf5" : "#fee2e2",
                          color: usr.ativo ? "#047857" : "#dc2626",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.375rem",
                          border: `1px solid ${usr.ativo ? "#10b981" : "#ef4444"}`,
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {usr.ativo ? "✓ Ativo" : "✕ Inativo"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                      {new Date(usr.criado_em).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                        {editingId === usr.id_usuario ? (
                          <>
                            <button
                              onClick={() => handleUpdateCargo(usr.id_usuario)}
                              style={{
                                backgroundColor: "#10b981",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                              }}
                            >
                              <Check size={16} />
                              Salvar
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditingCargo("");
                              }}
                              style={{
                                backgroundColor: "#64748b",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                              }}
                            >
                              <X size={16} />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(usr.id_usuario);
                                setEditingCargo(usr.cargo);
                              }}
                              style={{
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                              }}
                            >
                              <Edit2 size={16} />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr.id_usuario)}
                              disabled={usr.id_usuario === 1}
                              style={{
                                backgroundColor: usr.id_usuario === 1 ? "#cbd5e1" : "#ef4444",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "0.375rem",
                                cursor: usr.id_usuario === 1 ? "not-allowed" : "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                fontSize: "0.85rem",
                                opacity: usr.id_usuario === 1 ? 0.6 : 1,
                              }}
                            >
                              <Trash2 size={16} />
                              Deletar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#94a3b8",
              }}
            >
              <AlertCircle size={32} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
              <p>Nenhum usuário cadastrado.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
