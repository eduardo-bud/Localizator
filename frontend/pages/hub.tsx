import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogOut, Package, ArrowDown, Grid, Plus, Minus } from 'lucide-react';

const hubModules = [
  { id: 'estoque', name: 'Estoque', icon: Package, color: 'bg-blue-100', textColor: 'text-blue-700' },
  { id: 'retirada-lista', name: 'Retirada Lista', icon: Grid, color: 'bg-green-100', textColor: 'text-green-700' },
  { id: 'retirada-unidade', name: 'Retirada Unidade', icon: Minus, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { id: 'espaco', name: 'Espaço', icon: ArrowDown, color: 'bg-purple-100', textColor: 'text-purple-700' },
  { id: 'entrada', name: 'Entrada', icon: Plus, color: 'bg-pink-100', textColor: 'text-pink-700' },
];

export default function HubPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação com JWT
    const token = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const cargo = localStorage.getItem('cargo');
    const usuarioData = localStorage.getItem('usuario');

    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
      localStorage.removeItem('cargo');
      localStorage.removeItem('tokenExpiry');
      router.push('/login');
      return;
    }

    if (!usuarioData || cargo !== 'funcionário') {
      router.push('/login');
      return;
    }

    try {
      setUsuario(JSON.parse(usuarioData));
      setAutenticado(true);
    } catch (e) {
      console.error('Hub - Erro ao parsear usuarioData:', e);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'retirada-unidade') {
      router.push('/retirada');
      return;
    }
    setSelectedModule(moduleId);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cargo');
    localStorage.removeItem('tokenExpiry');
    router.push('/login');
  };

  const renderModuleContent = () => {
    switch (selectedModule) {
      case 'estoque':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Estoque</h3>
            <p className="text-gray-600 mb-4">Visualize e gerencie o estoque de materiais</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Funcionalidade de consulta de estoque em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'retirada-lista':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Retirada Lista</h3>
            <p className="text-gray-600 mb-4">Retiradas em lote de materiais</p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Funcionalidade de retirada em lista em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'retirada-unidade':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Retirada Unidade</h3>
            <p className="text-gray-600 mb-4">Retirada individual de materiais</p>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Funcionalidade de retirada por unidade em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'espaco':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Espaço</h3>
            <p className="text-gray-600 mb-4">Gerenciamento de espaços de armazenagem</p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Funcionalidade de espaço em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'entrada':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Entrada</h3>
            <p className="text-gray-600 mb-4">Registre entradas de novos materiais</p>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">Funcionalidade de entrada em desenvolvimento...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !autenticado) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hub Funcionário</h1>
            <p className="text-gray-600 mt-1">Bem-vindo, {usuario?.nome_usuario}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {hubModules.map((module) => {
            const IconComponent = module.icon;
            const isSelected = selectedModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className={`p-6 rounded-lg text-center transition transform hover:scale-105 ${
                  isSelected
                    ? `${module.color} ring-2 ring-offset-2 ring-gray-400`
                    : `${module.color} hover:shadow-md`
                }`}
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-3 ${module.textColor}`} />
                <h3 className={`font-semibold text-sm ${module.textColor}`}>{module.name}</h3>
              </button>
            );
          })}
        </div>

        {/* Module Content */}
        {selectedModule && renderModuleContent()}
      </main>
    </div>
  );
}
