import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Verificar se usuário já está logado - redirecionar
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const cargo = localStorage.getItem('cargo');
    
    if (token && cargo) {
      // Verificar se token não expirou
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const expiresAt = decoded.exp * 1000;
        
        if (expiresAt > Date.now()) {
          // Token válido, redirecionar
          if (cargo === 'administrador') {
            router.push('/');
          } else {
            router.push('/hub');
          }
        } else {
          // Token expirado, limpar localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('usuario');
          localStorage.removeItem('cargo');
        }
      } catch (e) {
        console.error('Erro ao decodificar token:', e);
        localStorage.removeItem('accessToken');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_usuario: usuario,
          senha: senha
        })
      });

      const data = await response.json();

      if (!data.success) {
        setErro(data.error || 'Erro ao fazer login');
        setCarregando(false);
        return;
      }

      // Salvar tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('cargo', data.usuario.cargo);
      localStorage.setItem('tokenExpiry', String(Date.now() + data.expiresIn * 1000));

      console.log('Login - Dados salvos:', {
        usuario: data.usuario,
        cargo: data.usuario.cargo,
        tokenExpiry: Date.now() + data.expiresIn * 1000
      });

      // Aguardar um pouco para garantir que o localStorage foi sincronizado
      setTimeout(() => {
        if (data.usuario.cargo === 'administrador') {
          router.push('/');
        } else {
          router.push('/hub');
        }
      }, 100);
    } catch (err) {
      setErro('Erro de conexão com o servidor');
      setCarregando(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #2563eb, #3b82f6, #4f46e5)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorativo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '384px',
          height: '384px',
          background: '#60a5fa',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(72px)',
          opacity: 0.2,
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '384px',
          height: '384px',
          background: '#818cf8',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(72px)',
          opacity: 0.2,
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '2s'
        }}></div>
      </div>

      {/* Container do login */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '520px',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '56px'
        }}>
          {/* Icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(to bottom right, #2563eb, #4f46e5)',
              padding: '28px',
              borderRadius: '50%',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <LogIn size={56} color="white" />
            </div>
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#111827',
            marginBottom: '12px'
          }}>
            Acesso
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#4b5563',
            marginBottom: '40px',
            fontSize: '18px'
          }}>
            Sistema de Gestão de Estoque
          </p>

          {/* Erro */}
          {erro && (
            <div style={{
              background: '#fef2f2',
              borderLeft: '4px solid #dc2626',
              color: '#991b1b',
              padding: '24px',
              marginBottom: '24px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ fontWeight: 500 }}>{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Usuário */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '12px'
              }}>
                👤 Usuário
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={carregando}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  background: '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.background = '#f9fafb';
                }}
              />
            </div>

            {/* Senha */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '12px'
              }}>
                🔒 Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                disabled={carregando}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  background: '#f9fafb',
                  color: '#111827',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.background = '#f9fafb';
                }}
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={carregando || !usuario || !senha}
              style={{
                width: '100%',
                background: carregando || !usuario || !senha 
                  ? '#9ca3af' 
                  : 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: 'white',
                fontWeight: 'bold',
                padding: '16px 20px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: carregando || !usuario || !senha ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!carregando && usuario && senha) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {carregando ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Conectando...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Conectar</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          color: 'white',
          fontSize: '14px'
        }}>
          <p>© 2025 Sistema de Gestão de Estoque Rissi</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
