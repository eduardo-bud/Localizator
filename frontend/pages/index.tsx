import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Search, Package, Warehouse, ArrowDownToLine, FileEdit, Users, PackageMinus, ClipboardList, FileBarChart, ShoppingCart, Bell, AlertCircle } from 'lucide-react'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

interface ModuleCard {
  id: string
  title: string
  icon?: React.ReactNode
  description: string
}

interface Alert {
  id: number
  type: 'warning' | 'error' | 'info' | 'success'
  message: string
  timestamp?: string
  emitted_at?: string
}

const fallbackModules: ModuleCard[] = [
  { id: 'space', title: 'Visualização de Espaço', icon: <Warehouse className="size-8" />, description: 'Visualizar e gerenciar espaços' },
  { id: 'stock', title: 'Estoque', icon: <Package className="size-8" />, description: 'Gerenciar inventário e produtos' },
  { id: 'entries', title: 'Entradas', icon: <ArrowDownToLine className="size-8" />, description: 'Registrar entradas de materiais' },
  { id: 'materials', title: 'Cadastro / Edição de Materiais', icon: <FileEdit className="size-8" />, description: 'Gerenciar cadastro de materiais' },
  { id: 'accounts', title: 'Cadastro / Edição de Contas e Acessos', icon: <Users className="size-8" />, description: 'Gerenciar usuários e permissões' },
  { id: 'unit-withdrawal', title: 'Retirada Unitária', icon: <PackageMinus className="size-8" />, description: 'Retirada individual de itens' },
  { id: 'list-withdrawal', title: 'Retirada por Lista', icon: <ClipboardList className="size-8" />, description: 'Retirada múltipla de itens' },
  { id: 'report', title: 'Relatório', icon: <FileBarChart className="size-8" />, description: 'Visualizar relatórios e análises' },
  { id: 'order', title: 'Pedido', icon: <ShoppingCart className="size-8" />, description: 'Gerenciar pedidos e solicitações' }
]

export default function App() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [modules, setModules] = useState<ModuleCard[]>(fallbackModules)
  const [loading, setLoading] = useState(true)
  const [autenticado, setAutenticado] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (hasInitialized) return

    // Verificar autenticação com JWT
    const token = localStorage.getItem('accessToken')
    const tokenExpiry = localStorage.getItem('tokenExpiry')
    const cargo = localStorage.getItem('cargo')

    // Se não tem token ou expirou, redirecionar para login
    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('usuario')
      localStorage.removeItem('cargo')
      localStorage.removeItem('tokenExpiry')
      router.push('/login')
      setLoading(false)
      return
    }

    // Se não é admin, redirecionar para hub
    if (cargo !== 'administrador') {
      router.push('/hub')
      setLoading(false)
      return
    }

    setAutenticado(true)
    setLoading(false)
    setHasInitialized(true)

    // Fetch data after auth check
    async function fetchData() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const headers = { 'Authorization': `Bearer ${token}` }
        
        const [mRes, aRes] = await Promise.all<any>([
          fetch(`${apiBase}/api/modules`, { headers }).catch(e => {
            console.error('Failed to fetch modules:', e)
            return { ok: false }
          }),
          fetch(`${apiBase}/api/alerts`, { headers }).catch(e => {
            console.error('Failed to fetch alerts:', e)
            return { ok: false }
          }),
        ])

        if (mRes.ok) {
          try {
            const m = await mRes.json()
            // Map to ModuleCard shape
            const mapped = (Array.isArray(m) ? m : []).map((it: any) => ({ id: it.id, title: it.title, description: it.description }))
            setModules(mapped.length ? mapped : fallbackModules)
          } catch (parseErr) {
            console.error('Error parsing modules JSON:', parseErr)
            setModules(fallbackModules)
          }
        } else {
          setModules(fallbackModules)
        }

        if (aRes.ok) {
          try {
            const a = await aRes.json()
            // Map alert structure to frontend Alert
            const mappedAlerts = (Array.isArray(a) ? a : []).map((it: any, idx: number) => ({
              id: idx + 1,
              type: it.type || 'info',
              message: it.message || JSON.stringify(it),
              emitted_at: it.emitted_at || it.issued_at || new Date().toLocaleString('pt-BR')
            }))
            setAlerts(mappedAlerts.length ? mappedAlerts : [])
          } catch (parseErr) {
            console.error('Error parsing alerts JSON:', parseErr)
            setAlerts([])
          }
        } else {
          setAlerts([])
        }
      } catch (e) {
        console.error('Erro ao buscar dados da API', e)
        setModules(fallbackModules)
        setAlerts([])
      }
    }
    fetchData()
  }, [router, hasInitialized])

  const filteredModules = (modules && modules.length) ? modules.filter(
    (module) => (module.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (module.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  ) : fallbackModules.filter(
    (module) => (module.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (module.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  const handleModuleClick = (moduleId: string) => {
    console.log(`Navegando para: ${moduleId}`)
    if (moduleId === 'order') {
      router.push('/pedidos')
    } else if (moduleId === 'accounts') {
      router.push('/cadastro-usuario')
    } else if (moduleId === 'materials') {
      router.push('/materiais-admin')
    } else if (moduleId === 'unit-withdrawal') {
      router.push('/retirada')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('cargo')
    router.push('/login')
  }

  if (loading || !autenticado) {
    return <div className="min-h-screen flex items-center justify-center text-slate-700">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-slate-900">Painel do Administrador</h1>
              <p className="text-slate-600 mt-1">
                Gerencie todos os módulos do sistema
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-slate-700 px-4 py-2">
                Admin
              </Badge>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sair
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Buscar funções, opções ou módulos do sistema..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-slate-900 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content - Module Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredModules.map((module) => (
            <Card
              key={module.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300 bg-white"
              onClick={() => handleModuleClick(module.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">
                      {module.title}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {module.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center p-4 bg-slate-100 rounded-full mb-4">
              <Search className="size-8 text-slate-400" />
            </div>
            <h3 className="text-slate-900 mb-2">
              Nenhum módulo encontrado
            </h3>
            <p className="text-slate-600">
              Tente buscar com outros termos
            </p>
          </div>
        )}

        {/* Alert Panel - Below Module Grid */}
        <div className="mt-12 max-w-2xl">
          <Card className="bg-white border-slate-200 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="size-5 text-slate-700" />
                <h4 className="text-slate-900">Alertas do Sistema</h4>
                {alerts.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {alerts.length}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {alerts.length === 0 ? (
                  <p className="text-slate-600 text-center py-4">
                    Nenhum alerta no momento
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 transition-all ${
                        alert.type === 'warning'
                          ? 'bg-amber-50 border-l-amber-500 border border-amber-200'
                          : alert.type === 'error'
                          ? 'bg-red-50 border-l-red-500 border border-red-200'
                          : alert.type === 'success'
                          ? 'bg-green-50 border-l-green-500 border border-green-200'
                          : 'bg-blue-50 border-l-blue-500 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className={`size-5 mt-0.5 flex-shrink-0 ${
                            alert.type === 'warning'
                              ? 'text-amber-600'
                              : alert.type === 'error'
                              ? 'text-red-600'
                              : alert.type === 'success'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium ${
                              alert.type === 'warning'
                                ? 'text-amber-900'
                                : alert.type === 'error'
                                ? 'text-red-900'
                                : alert.type === 'success'
                                ? 'text-green-900'
                                : 'text-blue-900'
                            }`}
                          >
                            {alert.message}
                          </p>
                          <p
                            className={`text-xs mt-2 font-mono ${
                              alert.type === 'warning'
                                ? 'text-amber-700'
                                : alert.type === 'error'
                                ? 'text-red-700'
                                : alert.type === 'success'
                                ? 'text-green-700'
                                : 'text-blue-700'
                            }`}
                          >
                            ⏰ Emitido em: {alert.emitted_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
