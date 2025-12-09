import { useState, useEffect } from "react";
import { X, Search, Plus } from "lucide-react";
import { fetchAPI } from "../utils/api";

interface Material {
  id_material: number;
  nome: string;
  descricao: string;
  categoria: string;
  unidade_medida: string;
  estoque_atual: number;
}

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (material: Material, quantidade: number) => void;
}

export default function MaterialModal({ isOpen, onClose, onSelect }: MaterialModalProps) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [filteredMateriais, setFilteredMateriais] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewMaterialForm, setShowNewMaterialForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    unidade_medida: "un",
    estoque_minimo: 0,
    estoque_atual: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchMateriais();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMateriais(materiais);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredMateriais(
        materiais.filter(
          (m) =>
            m.nome.toLowerCase().includes(lower) ||
            m.descricao.toLowerCase().includes(lower) ||
            m.categoria.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, materiais]);

  const fetchMateriais = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAPI("/api/materials");
      if (response.ok) {
        const data = await response.json();
        setMateriais(data);
      } else {
        setError("Erro ao carregar materiais");
      }
    } catch (err) {
      setError("Erro na requisição");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    if (!newMaterial.nome || !newMaterial.categoria || !newMaterial.unidade_medida) {
      setError("Preenchha nome, categoria e unidade de medida");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchAPI("/api/materials", {
        method: "POST",
        body: JSON.stringify(newMaterial),
      });

      if (response.ok) {
        const createdMaterial = await response.json();
        setMateriais([...materiais, createdMaterial]);
        setSelectedMaterial(createdMaterial);
        setShowNewMaterialForm(false);
        setNewMaterial({
          nome: "",
          descricao: "",
          categoria: "",
          unidade_medida: "un",
          estoque_minimo: 0,
          estoque_atual: 0,
        });
        setError(null);
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar material");
      }
    } catch (err) {
      setError("Erro na requisição");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (!selectedMaterial || quantidade < 1) {
      setError("Selecione um material e informe uma quantidade válida");
      return;
    }
    onSelect(selectedMaterial, quantidade);
    setSelectedMaterial(null);
    setQuantidade(1);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#1e293b" }}>
            Selecionar Material
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              padding: 0,
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Abas: Selecionar / Criar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <button
            onClick={() => {
              setShowNewMaterialForm(false);
              setError(null);
            }}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              borderBottom: !showNewMaterialForm ? "2px solid #3b82f6" : "transparent",
              color: !showNewMaterialForm ? "#3b82f6" : "#64748b",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            Selecionar Existente
          </button>
          <button
            onClick={() => {
              setShowNewMaterialForm(true);
              setError(null);
            }}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              borderBottom: showNewMaterialForm ? "2px solid #3b82f6" : "transparent",
              color: showNewMaterialForm ? "#3b82f6" : "#64748b",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            Criar Novo
          </button>
        </div>

        {/* Formulário de Novo Material */}
        {showNewMaterialForm ? (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Nome *
                </label>
                <input
                  type="text"
                  placeholder="Nome do material"
                  value={newMaterial.nome}
                  onChange={(e) => setNewMaterial({ ...newMaterial, nome: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
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
                  placeholder="Ex: Parafusos"
                  value={newMaterial.categoria}
                  onChange={(e) => setNewMaterial({ ...newMaterial, categoria: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                Descrição
              </label>
              <input
                type="text"
                placeholder="Descrição do material"
                value={newMaterial.descricao}
                onChange={(e) => setNewMaterial({ ...newMaterial, descricao: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  marginBottom: "1rem",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Unidade de Medida *
                </label>
                <select
                  value={newMaterial.unidade_medida}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unidade_medida: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="un">Unidade (un)</option>
                  <option value="m">Metro (m)</option>
                  <option value="kg">Quilograma (kg)</option>
                  <option value="l">Litro (l)</option>
                  <option value="m2">Metro Quadrado (m²)</option>
                  <option value="m3">Metro Cúbico (m³)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
                  Estoque Atual
                </label>
                <input
                  type="number"
                  min="0"
                  value={newMaterial.estoque_atual}
                  onChange={(e) => setNewMaterial({ ...newMaterial, estoque_atual: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleCreateMaterial}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "1rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "500",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Criando..." : "Criar Material"}
            </button>
          </div>
        ) : (
          <>
            {/* Barra de Pesquisa */}
            <div style={{ marginBottom: "1.5rem", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Pesquisar por nome, descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                  border: "1px solid #cbd5e1",
                  borderRadius: "0.5rem",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  border: "1px solid #ef4444",
                }}
              >
                {error}
              </div>
            )}

            {/* Lista de Materiais */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                Carregando materiais...
              </div>
            ) : filteredMateriais.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                Nenhum material encontrado
              </div>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "1.5rem" }}>
                {filteredMateriais.map((material) => (
                  <div
                    key={material.id_material}
                    onClick={() => setSelectedMaterial(material)}
                    style={{
                      padding: "1rem",
                      marginBottom: "0.5rem",
                      border: selectedMaterial?.id_material === material.id_material ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      backgroundColor: selectedMaterial?.id_material === material.id_material ? "#eff6ff" : "white",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMaterial?.id_material !== material.id_material) {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMaterial?.id_material !== material.id_material) {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <strong style={{ color: "#1e293b" }}>{material.nome}</strong>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        {material.estoque_atual} {material.unidade_medida}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "#64748b" }}>
                      {material.descricao}
                    </p>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.75rem",
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.25rem",
                      }}
                    >
                      {material.categoria}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Quantidade */}
        {selectedMaterial && !showNewMaterialForm && (
          <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#64748b", marginBottom: "0.5rem" }}>
              Quantidade
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #cbd5e1",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Botões de Ação */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#e2e8f0",
              color: "#1e293b",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#cbd5e1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#e2e8f0";
            }}
          >
            Cancelar
          </button>
          {!showNewMaterialForm && (
            <button
              onClick={handleSelect}
              disabled={!selectedMaterial}
              style={{
                backgroundColor: selectedMaterial ? "#3b82f6" : "#cbd5e1",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: selectedMaterial ? "pointer" : "not-allowed",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedMaterial) {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMaterial) {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }
              }}
            >
              <Plus size={18} />
              Adicionar Material
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
