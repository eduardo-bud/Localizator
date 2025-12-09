import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Home, Package, Search, Check } from "lucide-react";
import { fetchAPI } from "../utils/api";

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

export default function RetiradaPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [filteredMateriais, setFilteredMateriais] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas as Categorias");
  const [categories, setCategories] = useState<string[]>([]);

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
    fetchMateriais();
  }, []);

  // Buscar materiais
  const fetchMateriais = async () => {
    try {
      setLoading(true);
      const response = await fetchAPI("/api/materials", { method: "GET" });
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setMateriais(data);
        const uniqueCategories = [...new Set(data.map((m: Material) => m.categoria))];
        setCategories(["Todas as Categorias", ...(uniqueCategories as string[])]);
      }
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar materiais
  useEffect(() => {
    let filtered = materiais;

    if (filterCategory !== "Todas as Categorias") {
      filtered = filtered.filter((m) => m.categoria === filterCategory);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (m) =>
          m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.codigo_material.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMateriais(filtered);
  }, [materiais, searchTerm, filterCategory]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("tokenExpiry");
    router.push("/login");
  };

  const handleSelecionarMaterial = (material: Material) => {
    router.push({
      pathname: "/retirada/confirmar",
      query: { materialId: material.id_material }
    });
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
        button:hover { opacity: 0.9; transition: all 0.2s; }
      `}</style>

      {/* Header Premium */}
      <header style={{ backgroundColor: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "white", padding: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Package size={28} style={{ color: "#60a5fa" }} />
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#1e293b" }}>Retirada de Materiais</h1>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ color: "#1e293b", fontSize: "0.95rem" }}>Olá, <strong>{usuario?.nome_usuario || "Usuário"}</strong></span>
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
        {/* Controles de Busca e Filtro */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Busca */}
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" placeholder="Buscar por nome ou código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "0.5rem", backgroundColor: "white", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box" }} />
          </div>

          {/* Filtro de Categoria */}
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "0.5rem", backgroundColor: "white", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", cursor: "pointer" }}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Resultado da busca */}
        <div style={{ marginBottom: "1.5rem", color: "#64748b", fontSize: "0.9rem", fontWeight: "500" }}>
          Mostrando <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{filteredMateriais.length}</span> de <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{materiais.length}</span> materiais
        </div>

        {/* Lista de Materiais */}
        <div style={{ backgroundColor: "white", borderRadius: "0.75rem", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          {filteredMateriais.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <Package size={48} style={{ color: "#cbd5e1", margin: "0 auto 1rem" }} />
              <p style={{ color: "#94a3b8", fontSize: "1.1rem", margin: 0 }}>Nenhum material encontrado</p>
            </div>
          ) : (
            filteredMateriais.map((material, index) => {
              const isLowStock = material.estoque_atual <= material.estoque_minimo;
              const isOutOfStock = material.estoque_atual === 0;

              return (
                <div key={material.id_material}>
                  <button onClick={() => handleSelecionarMaterial(material)} disabled={isOutOfStock} style={{ width: "100%", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "white", border: "none", cursor: isOutOfStock ? "not-allowed" : "pointer", opacity: isOutOfStock ? "0.6" : "1", transition: "all 0.2s", borderBottom: index < filteredMateriais.length - 1 ? "1px solid #e2e8f0" : "none" }} onMouseEnter={(e) => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = "#f8fafc"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}>
                    {/* Ícone e Informações */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: 1, textAlign: "left" }}>
                      <div style={{ width: "56px", height: "56px", backgroundColor: "#3b82f6", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: "bold", flexShrink: 0 }}>
                        {material.nome.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: "bold", color: "#1e293b" }}>{material.nome}</h3>
                        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#64748b" }}>Código: <span style={{ fontFamily: "monospace", fontWeight: "bold" }}>{material.codigo_material}</span></p>
                        {material.descricao && <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#94a3b8" }}>{material.descricao}</p>}
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center", fontSize: "0.85rem" }}>
                          <span style={{ backgroundColor: "#f1f5f9", color: "#3b82f6", padding: "0.25rem 0.75rem", borderRadius: "0.5rem", fontWeight: "500" }}>{material.categoria}</span>
                          <span style={{ color: "#64748b" }}>Unidade: <strong>{material.unidade_medida}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Estoque */}
                    <div style={{ textAlign: "right", minWidth: "140px", marginLeft: "2rem" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: isOutOfStock ? "#dc2626" : isLowStock ? "#f97316" : "#059669", marginBottom: "0.25rem" }}>{material.estoque_atual}</div>
                      <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", color: "#94a3b8" }}>{material.unidade_medida}</p>
                      {isOutOfStock && <div style={{ display: "inline-block", padding: "0.25rem 0.75rem", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "bold" }}>Sem Estoque</div>}
                      {isLowStock && !isOutOfStock && <div style={{ display: "inline-block", padding: "0.25rem 0.75rem", backgroundColor: "#fed7aa", color: "#b45309", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "bold" }}>Estoque Baixo</div>}
                      {!isLowStock && !isOutOfStock && <div style={{ display: "inline-block", padding: "0.25rem 0.75rem", backgroundColor: "#dcfce7", color: "#059669", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "bold" }}>Disponível</div>}
                      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>Mín: {material.estoque_minimo}</p>
                    </div>

                    {/* Seta */}
                    <div style={{ marginLeft: "1rem", color: "#cbd5e1" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
