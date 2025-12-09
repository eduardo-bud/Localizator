import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Trash2, Edit2, Plus, Upload, Download } from 'lucide-react'
// @ts-ignore
import * as XLSX from 'xlsx'

interface Material {
  id_material: number
  nome: string
  descricao: string
  categoria: string
  unidade_medida: string
  estoque_minimo: number
  estoque_atual: number
  criado_em: string
}

export default function GestaoMateriaisPage() {
  const router = useRouter()
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    unidade_medida: 'UN',
    estoque_minimo: 0,
    estoque_atual: 0,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('todos')

  // Carregar materiais
  useEffect(() => {
    carregarMateriais()
  }, [])

  const carregarMateriais = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/materials', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error('Erro ao carregar materiais')

      const data = await response.json()
      setMateriais(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      categoria: '',
      unidade_medida: 'UN',
      estoque_minimo: 0,
      estoque_atual: 0,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const url = editingId
        ? `http://localhost:3001/api/materials/${editingId}`
        : 'http://localhost:3001/api/materials'

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Erro ao salvar material')
      }

      setSuccess(editingId ? 'Material atualizado com sucesso!' : 'Material criado com sucesso!')
      setTimeout(() => setSuccess(''), 3000)

      carregarMateriais()
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (material: Material) => {
    setFormData({
      nome: material.nome,
      descricao: material.descricao,
      categoria: material.categoria,
      unidade_medida: material.unidade_medida,
      estoque_minimo: material.estoque_minimo,
      estoque_atual: material.estoque_atual,
    })
    setEditingId(material.id_material)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este material?')) return

    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')

      const response = await fetch(`http://localhost:3001/api/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) throw new Error('Erro ao deletar material')

      setSuccess('Material deletado com sucesso!')
      setTimeout(() => setSuccess(''), 3000)
      carregarMateriais()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    } finally {
      setLoading(false)
    }
  }

  // Importar Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const reader = new FileReader()

      reader.onload = async (event) => {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        // Validar e processar dados
        const materiaisParaImportar = jsonData.map((row: any) => ({
          nome: row.nome?.toString().trim() || '',
          descricao: row.descricao?.toString().trim() || '',
          categoria: row.categoria?.toString().trim() || '',
          unidade_medida: row.unidade_medida?.toString().trim() || 'UN',
          estoque_minimo: parseFloat(row.estoque_minimo) || 0,
          estoque_atual: parseFloat(row.estoque_atual) || 0,
        })).filter(m => m.nome) // Filtrar vazios

        if (materiaisParaImportar.length === 0) {
          throw new Error('Nenhum material válido encontrado no arquivo')
        }

        // Enviar para backend
        const token = localStorage.getItem('accessToken')
        const response = await fetch('http://localhost:3001/api/materials/import/excel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ materiais: materiaisParaImportar }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Erro ao importar')
        }

        const result = await response.json()
        setSuccess(`${result.importados} materiais importados com sucesso!`)
        setTimeout(() => setSuccess(''), 3000)

        carregarMateriais()
      }

      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar arquivo')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  // Exportar Excel
  const handleExportExcel = () => {
    const dataToExport = materiais.map(m => ({
      nome: m.nome,
      descricao: m.descricao,
      categoria: m.categoria,
      unidade_medida: m.unidade_medida,
      estoque_minimo: m.estoque_minimo,
      estoque_atual: m.estoque_atual,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Materiais')
    XLSX.writeFile(workbook, 'materiais.xlsx')

    setSuccess('Arquivo exportado com sucesso!')
    setTimeout(() => setSuccess(''), 3000)
  }

  // Gerar template
  const handleDownloadTemplate = () => {
    const template = [
      {
        nome: 'Exemplo - Parafuso M8',
        descricao: 'Parafuso de aço inoxidável',
        categoria: 'Fixadores',
        unidade_medida: 'CX',
        estoque_minimo: 100,
        estoque_atual: 500,
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
    XLSX.writeFile(workbook, 'template_materiais.xlsx')

    setSuccess('Template baixado com sucesso!')
    setTimeout(() => setSuccess(''), 3000)
  }

  // Filtrar materiais
  const filteredMateriais = materiais.filter(m => {
    const matchSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = filterCategory === 'todos' || m.categoria === filterCategory
    return matchSearch && matchCategory
  })

  const categorias = [...new Set(materiais.map(m => m.categoria).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Materiais</h1>
              <p className="text-gray-600 mt-1">Total: {materiais.length} materiais</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mensagens */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Ações */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus size={20} className="mr-2" />
              {showForm ? 'Cancelar' : 'Novo Material'}
            </button>
            <div className="flex gap-2">
              <label className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">
                <Upload size={20} className="mr-2" />
                Importar Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                  disabled={loading}
                />
              </label>
              <button
                onClick={handleExportExcel}
                disabled={materiais.length === 0 || loading}
                className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300"
              >
                <Download size={20} className="mr-2" />
                Exportar Excel
              </button>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Download size={20} className="mr-2" />
                Template
              </button>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Editar Material' : 'Novo Material'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Parafuso M8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Fixadores"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição detalhada do material"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade de Medida
                  </label>
                  <select
                    value={formData.unidade_medida}
                    onChange={(e) => setFormData({ ...formData, unidade_medida: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>UN</option>
                    <option>CX</option>
                    <option>KG</option>
                    <option>M</option>
                    <option>M2</option>
                    <option>M3</option>
                    <option>L</option>
                    <option>ML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.estoque_atual}
                    onChange={(e) => setFormData({ ...formData, estoque_atual: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas as categorias</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat || 'Sem categoria'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && !materiais.length ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : filteredMateriais.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {materiais.length === 0 ? 'Nenhum material cadastrado' : 'Nenhum material encontrado'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unidade</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Est. Mín</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Est. Atual</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMateriais.map((material) => (
                    <tr key={material.id_material} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{material.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{material.categoria || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{material.descricao || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{material.unidade_medida}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600">{material.estoque_minimo}</td>
                      <td className="px-6 py-4 text-sm text-center font-medium">{material.estoque_atual}</td>
                      <td className="px-6 py-4 text-sm text-center">
                        {material.estoque_atual < material.estoque_minimo ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                            BAIXO
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(material)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id_material)}
                            className="text-red-600 hover:text-red-900"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
