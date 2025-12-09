// Função auxiliar para fazer requisições com JWT
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const tokenExpiry = localStorage.getItem('tokenExpiry');

  // Verificar se token expirou
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    // Tentar renovar token
    if (refreshToken) {
      try {
        const response = await fetch('http://localhost:3001/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('tokenExpiry', String(Date.now() + data.expiresIn * 1000));
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${data.accessToken}`
          };
        } else {
          // Refresh falhou, fazer logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
          localStorage.removeItem('cargo');
          localStorage.removeItem('tokenExpiry');
          window.location.href = '/login';
          throw new Error('Token expirado');
        }
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        window.location.href = '/login';
        throw error;
      }
    }
  }

  // Adicionar token ao header
  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let response;
  try {
    response = await fetch(`http://localhost:3001${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  } catch (networkError) {
    console.error('Erro de rede na requisição para', endpoint, ':', networkError);
    throw new Error(`Erro de conexão: ${networkError.message}`);
  }

  // Se retornar 401, fazer logout
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cargo');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  // Logar resposta para debug
  if (!response.ok) {
    console.error(`Erro ${response.status} em ${endpoint}:`, response.statusText);
  }

  return response;
}

// Verificar se usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('accessToken');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!token || !tokenExpiry) return false;
  
  return Date.now() < parseInt(tokenExpiry);
}

// Verificar cargo do usuário
export function getUserCargo(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cargo');
}

// Fazer logout
export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('usuario');
  localStorage.removeItem('cargo');
  localStorage.removeItem('tokenExpiry');
  window.location.href = '/login';
}
