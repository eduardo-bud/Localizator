import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LogOut, Plus, Trash2, Edit2, Check, X, AlertCircle, Upload, Download, Home, Search } from "lucide-react";
import { fetchAPI } from "../utils/api";
// @ts-ignore
import * as XLSX from 'xlsx'

interface Material {
  id_material: number;
  codigo_material: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  estoque_minimo: number;
  estoque_atual: number;
  criado_em: string;
}

interface FormData {
  codigo_material: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  estoque_minimo: number | string;
  estoque_atual: number | string;
}

export default function MateriaisAdminPage() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [formData, setFormData] = useState<FormData>({
    codigo_material: "",
    nome: "",
    descricao: "",
    categoria: "",
    unidade_medida: "un",
    estoque_minimo: 0,
    estoque_atual: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas as Categorias");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
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
    fetchMateriais();
  }, [router]);

  const fetchMateriais = async () => {
    try {
      const response = await fetchAPI("/api/materials");
      if (response.ok) {
        const data = await response.json();
        setMateriais(data);
        
        const cats = [...new Set(data.map((m: Material) => m.categoria))];
        setCategories(["Todas as Categorias", ...(cats as string[])]);
      } else {
        setMessage({ type: "error", text: `Erro ao carregar materiais (${response.status})` });
      }
    } catch (error) {
      setMessage({ type: "error", text: `Erro ao carregar materiais: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage(null);

    try {
      if (!formData.nome || !formData.categoria) {
        setMessage({ type: "error", text: "Nome e categoria são obrigatórios" });
        setLoadingSubmit(false);
        return;
      }

      const payload = {
        ...formData,
        estoque_minimo: Number(formData.estoque_minimo),
        estoque_atual: Number(formData.estoque_atual),
      };

      const url = editingId ? `/api/materials/${editingId}` : "/api/materials";
      const method = editingId ? "PUT" : "POST";

      const response = await fetchAPI(url, {
        method,
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Erro ao parsear resposta JSON:", parseError);
        setMessage({ type: "error", text: `Erro na resposta do servidor: ${response.status}` });
        setLoadingSubmit(false);
        return;
      }

      if (response.ok) {
        setMessage({ type: "success", text: editingId ? "Material atualizado com sucesso!" : "Material criado com sucesso!" });
        setFormData({
          codigo_material: "",
          nome: "",
          descricao: "",
          categoria: "",
          unidade_medida: "un",
          estoque_minimo: 0,
          estoque_atual: 0,
        });
        setEditingId(null);
        setTimeout(() => fetchMateriais(), 500);
      } else {
        setMessage({ type: "error", text: data.error || `Erro ao salvar material (${response.status})` });
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setMessage({ type: "error", text: `Erro na requisição: ${error.message}` });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEdit = (material: Material) => {
    setFormData({
      codigo_material: material.codigo_material,
      nome: material.nome,
      descricao: material.descricao,
      categoria: material.categoria,
      unidade_medida: material.unidade_medida,
      estoque_minimo: material.estoque_minimo,
      estoque_atual: material.estoque_atual,
    });
    setEditingId(material.id_material);
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este material?")) return;

    try {
      const response = await fetchAPI(`/api/materials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Material deletado com sucesso!" });
        fetchMateriais();
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Erro ao deletar material" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro na requisição" });
    }
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Código", "Nome", "Descrição", "Categoria", "Unidade de Medida", "Estoque Mínimo", "Estoque Atual"],
      ["MAT-001", "Parafuso M8", "Parafuso de aço 8mm", "Ferragens", "un", "100", "500.5"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Materiais");
    XLSX.writeFile(wb, "template_materiais.xlsx");
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/materials/import/excel", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Materiais importados com sucesso!" });
        setTimeout(() => fetchMateriais(), 500);
      } else {
        setMessage({ type: "error", text: data.error || "Erro ao importar materiais" });
      }
    } catch (error) {
      setMessage({ type: "error", text: `Erro ao importar: ${error.message}` });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("cargo");
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading || !autenticado) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9" }}>
        <div style={{ fontSize: "1.125rem", color: "#64748b" }}>Carregando...</div>
      </div>
    );
  }

  const filteredMateriais = materiais.filter((m) => {
    const matchesSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "Todas as Categorias" || m.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "2rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={handleGoHome}
            style={{
              backgroundColor: "#000000",
              color: "white",
              border: "1px solid #333333",
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
              e.currentTarget.style.backgroundColor = "#1a1a1a";
              e.currentTarget.style.borderColor = "#555555";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.borderColor = "#333333";
            }}
          >
            <Home size={18} />
            Home
          </button>
          <div>
            <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "bold", color: "#000000" }}>
              Cadastro / Edição de Materiais
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
              Gerencie o catálogo de materiais do almoxarifado
            </p>
          </div>
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
            <span style={{ flex: 1 }}>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
                padding: "0.25rem",
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Formulário de Cadastro */}
        {!editingId ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "600", color: "#1e293b" }}>
              Novo Material
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {/* Código do Material */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Código do Material
                  </label>
                  <input
                    type="text"
                    value={formData.codigo_material}
                    onChange={(e) => setFormData({ ...formData, codigo_material: e.target.value })}
                    placeholder="Ex: MAT-001"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>

                {/* Nome */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do material"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>

                {/* Descrição */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do material"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      minHeight: "80px",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Categoria *
                  </label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Ex: Ferragens, Tubos, etc"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>

                {/* Unidade de Medida */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Unidade de Medida
                  </label>
                  <select
                    value={formData.unidade_medida}
                    onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  >
                    <option value="un">Un (Unidade)</option>
                    <option value="m">m (Metro)</option>
                    <option value="kg">kg (Quilograma)</option>
                    <option value="l">l (Litro)</option>
                    <option value="cx">cx (Caixa)</option>
                  </select>
                </div>

                {/* Estoque Mínimo */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: e.target.value })}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>

                {/* Estoque Atual */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estoque_atual}
                    onChange={(e) => setFormData({ ...formData, estoque_atual: e.target.value })}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "0.375rem",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingSubmit}
                style={{
                  backgroundColor: loadingSubmit ? "#cbd5e1" : "#667eea",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.375rem",
                  cursor: loadingSubmit ? "not-allowed" : "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loadingSubmit) e.currentTarget.style.backgroundColor = "#5568d3";
                }}
                onMouseLeave={(e) => {
                  if (!loadingSubmit) e.currentTarget.style.backgroundColor = "#667eea";
                }}
              >
                {loadingSubmit ? "Salvando..." : "Salvar Material"}
              </button>
            </form>
          </div>
        ) : null}

        {/* Lista de Materiais */}
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
            Materiais Cadastrados
          </h2>

          {/* Busca e Filtros */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "0.375rem", paddingLeft: "0.75rem", backgroundColor: "#f8fafc" }}>
              <Search size={18} style={{ color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem 0.75rem",
                  border: "none",
                  fontSize: "0.95rem",
                  backgroundColor: "transparent",
                  outline: "none",
                }}
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: "0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.375rem",
                fontSize: "0.95rem",
                backgroundColor: "#f8fafc",
                cursor: "pointer",
                minWidth: "200px",
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={handleDownloadTemplate}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
            >
              <Download size={18} />
              Download
            </button>

            <label
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
            >
              <Upload size={18} />
              Importar
              <input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} style={{ display: "none" }} />
            </label>
          </div>

          {/* Tabela de Materiais */}
          {filteredMateriais.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
              <AlertCircle size={32} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
              <p>Nenhum material encontrado</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Código</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Nome</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Categoria</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Un.</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Estoque</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Mínimo</th>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: "600", color: "#475569", fontSize: "0.875rem" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMateriais.map((material, idx) => (
                    <tr
                      key={material.id_material}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#ffffff" : "#f8fafc")}
                    >
                      <td style={{ padding: "1rem", color: "#667eea", fontWeight: "600", fontSize: "0.875rem" }}>{material.codigo_material || "-"}</td>
                      <td style={{ padding: "1rem", color: "#1e293b", fontWeight: "500" }}>{material.nome}</td>
                      <td style={{ padding: "1rem", color: "#64748b" }}>{material.categoria}</td>
                      <td style={{ padding: "1rem", color: "#64748b" }}>{material.unidade_medida}</td>
                      <td style={{ padding: "1rem", color: "#1e293b", fontWeight: "500" }}>{material.estoque_atual}</td>
                      <td style={{ padding: "1rem", color: "#64748b" }}>{material.estoque_minimo}</td>
                      <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(material)}
                          style={{
                            backgroundColor: "#667eea",
                            color: "white",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5568d3")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#667eea")}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMaterial(material.id_material)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editingId && (
            <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fed7d7", borderRadius: "0.375rem" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#b91c1c", fontWeight: "600" }}>Editando Material</h3>
              <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                      Código
                    </label>
                    <input
                      type="text"
                      value={formData.codigo_material}
                      onChange={(e) => setFormData({ ...formData, codigo_material: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.375rem",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.375rem",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                      Categoria *
                    </label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.375rem",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                      Estoque Atual
                    </label>
                    <input
                      type="number"
                      value={formData.estoque_atual}
                      onChange={(e) => setFormData({ ...formData, estoque_atual: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.375rem",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="submit"
                    disabled={loadingSubmit}
                    style={{
                      backgroundColor: loadingSubmit ? "#cbd5e1" : "#10b981",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.375rem",
                      cursor: loadingSubmit ? "not-allowed" : "pointer",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                    }}
                  >
                    {loadingSubmit ? "Atualizando..." : "Atualizar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        codigo_material: "",
                        nome: "",
                        descricao: "",
                        categoria: "",
                        unidade_medida: "un",
                        estoque_minimo: 0,
                        estoque_atual: 0,
                      });
                    }}
                    style={{
                      backgroundColor: "#6b7280",
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
