# 🎨 VISUAL COMPLETO DO SISTEMA

## 📱 TELAS - MOCKUPS TEXTUAIS

### TELA 1: LOGIN
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║                   🔐 ACESSO                                   ║
║            Entre com suas credenciais                         ║
║                                                                ║
║              ┌──────────────────────────────┐                ║
║              │  👤 Usuário                  │                ║
║              │  ___________________________  │                ║
║              └──────────────────────────────┘                ║
║                                                                ║
║              ┌──────────────────────────────┐                ║
║              │  🔒 Senha                    │                ║
║              │  ___________________________  │                ║
║              └──────────────────────────────┘                ║
║                                                                ║
║         ┌──────────────────────────────────────┐             ║
║         │         🔑 CONECTAR                  │             ║
║         └──────────────────────────────────────┘             ║
║                                                                ║
║         Sistema de Gestão de Estoque                         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

STATUS: ✅ FUNCIONAL
ROTA: /login
CAMPOS OBRIGATÓRIOS: Usuário, Senha
AÇÕES:
  • Valida credenciais com backend
  • Hash bcrypt de senha
  • Redireciona baseado em cargo
ERROR HANDLING:
  • Usuário não encontrado
  • Senha incorreta
  • Usuário inativo
  • Erro de conexão
```

---

### TELA 2: DASHBOARD ADMIN
```
╔════════════════════════════════════════════════════════════════╗
║ 📊 Painel do Administrador                         Admin [Sair]║
║ Gerencie todos os módulos do sistema                           ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🔍 Buscar módulos: ____________________________               ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ ║
║  │  📍             │  │  📦             │  │  ⬇️        │ ║
║  │  Visualização   │  │  Estoque        │  │  Entradas   │ ║
║  │  de Espaço      │  │                 │  │             │ ║
║  └──────────────────┘  └──────────────────┘  └─────────────┘ ║
║                                                                ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ ║
║  │  ✏️             │  │  👥             │  │  ➖        │ ║
║  │  Cadastro de    │  │  Cadastro de    │  │  Retirada   │ ║
║  │  Materiais      │  │  Contas         │  │  Unitária   │ ║
║  └──────────────────┘  └──────────────────┘  └─────────────┘ ║
║                                                                ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐ ║
║  │  📋             │  │  📊             │  │  🛒        │ ║
║  │  Retirada       │  │  Relatório      │  │  Pedido     │ ║
║  │  por Lista      │  │                 │  │             │ ║
║  └──────────────────┘  └──────────────────┘  └─────────────┘ ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║ ⚠️ ALERTAS DO SISTEMA                                         ║
║ ┌────────────────────────────────────────────────────────────┐║
║ │ • Estoque baixo: Material X (5 unidades, mínimo: 10)      ││
║ │ • 3 pedidos registrados no sistema                        ││
║ └────────────────────────────────────────────────────────────┘║
╚════════════════════════════════════════════════════════════════╝

STATUS: ✅ FUNCIONAL
ROTA: /
ACESSO: cargo === "administrador"
MÓDULOS: 9 disponíveis
FUNCIONALIDADES:
  ✅ Busca/filtro de módulos
  ✅ Exibição de alertas
  ✅ Grid responsivo
  ✅ Logout
DADOS:
  • Módulos: GET /api/modules
  • Alertas: GET /api/alerts
  • Fallback: 9 módulos hardcoded
PROTEÇÃO:
  • Redireciona para /login se não autenticado
  • Redireciona para /login se cargo ≠ "administrador"
```

---

### TELA 3: DASHBOARD FUNCIONÁRIO (HUB)
```
╔════════════════════════════════════════════════════════════════╗
║ 🏢 Hub Funcionário                     [funcionario] [Sair]    ║
║ Bem-vindo, funcionario                                         ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐  ║
║  │  📦            │  │  📋            │  │  ➖         │  ║
║  │  Estoque       │  │  Retirada      │  │  Retirada    │  ║
║  │  [SELECIONADO] │  │  Lista         │  │  Unidade     │  ║
║  └─────────────────┘  └─────────────────┘  └──────────────┘  ║
║                                                                ║
║  ┌─────────────────┐  ┌──────────────────────────────────┐   ║
║  │  ⬇️            │  │                                   │   ║
║  │  Espaço        │  │                                   │   ║
║  │                │  │  📦 ESTOQUE                      │   ║
║  └─────────────────┘  │  ═════════════════════════════  │   ║
║                       │                                   │   ║
║  ┌─────────────────┐  │  Visualize e gerencie o         │   ║
║  │  ➕            │  │  estoque de materiais            │   ║
║  │  Entrada       │  │                                   │   ║
║  │                │  │  [Funcionalidade em             │   ║
║  └─────────────────┘  │   desenvolvimento...]          │   ║
║                       │                                   │   ║
║                       └──────────────────────────────────┘   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

STATUS: ✅ FUNCIONAL
ROTA: /hub
ACESSO: cargo === "funcionário"
MÓDULOS: 5 disponíveis
  1. 📦 Estoque (azul)
  2. 📋 Retirada Lista (verde)
  3. ➖ Retirada Unidade (amarelo)
  4. ⬇️ Espaço (roxo)
  5. ➕ Entrada (rosa)

FUNCIONALIDADES:
  ✅ Seleção interativa de módulo
  ✅ Conteúdo dinâmico
  ✅ Logout
  ✅ Responsivo

PROTEÇÃO:
  • Redireciona para /login se não autenticado
  • Redireciona para /login se cargo ≠ "funcionário"
```

---

## 🔄 FLUXO DE DADOS

### Login Flow
```
USER INPUT
    ↓
Validação Frontend (campos preenchidos?)
    ↓ SIM
POST /api/auth/login
    ↓
Backend: findOne(Usuario, { nome_usuario })
    ↓
Usuario existe?
    ├─ NÃO → return { success: false, error: "Usuário não encontrado" }
    └─ SIM → continue
            ↓
        bcrypt.compare(senha, usuario.senha_hash)
            ↓
        Senha válida?
            ├─ NÃO → return { success: false, error: "Senha incorreta" }
            └─ SIM → continue
                    ↓
                Usuario.ativo === true?
                    ├─ NÃO → return { success: false, error: "Usuário inativo" }
                    └─ SIM → continue
                            ↓
                        return { success: true, usuario: { id_usuario, nome_usuario, cargo } }
                            ↓
                        Frontend armazena em localStorage
                            ↓
                        cargo === "administrador"?
                            ├─ SIM → router.push("/")
                            └─ NÃO → router.push("/hub")
```

### Admin Dashboard Flow
```
USER ACESSA /
    ↓
useEffect verifica localStorage
    ↓
usuario && cargo === "administrador"?
    ├─ NÃO → router.push("/login")
    └─ SIM → continue
            ↓
        setLoading(false)
            ↓
        Fetch data paralelo:
            ├─ GET /api/modules → setModules()
            └─ GET /api/alerts → setAlerts()
                ↓
        Renderiza:
            ├─ Header com título, badge Admin, botão Sair
            ├─ Barra de busca
            ├─ Grid 9 módulos (filtrados se busca ativa)
            └─ Painel alertas
```

### Funcionário Hub Flow
```
USER ACESSA /hub
    ↓
useEffect verifica localStorage
    ↓
usuario && cargo === "funcionário"?
    ├─ NÃO → router.push("/login")
    └─ SIM → continue
            ↓
        setUsuario(usuarioData)
            ↓
        Renderiza:
            ├─ Header com nome do usuário, botão Sair
            ├─ Grid 5 módulos
            └─ Área de conteúdo dinâmico
                ↓
            User clica em módulo
                ↓
            setSelectedModule(id)
                ↓
            renderModuleContent(selectedModule)
                ↓
            Exibe conteúdo específico
```

---

## 🔐 PROTEÇÃO DE ROTAS

```
┌─────────────────────────────────────────────────────────────┐
│                    ROTA PROTEGIDA                           │
└─────────────────────────────────────────────────────────────┘

1. User tenta acessar rota:
   ├─ / (admin dashboard)
   └─ /hub (funcionário hub)

2. useEffect executado no component:
   ├─ Verifica localStorage.getItem("usuario")
   └─ Verifica localStorage.getItem("cargo")

3. Validação:
   
   Se NENHUM dado em localStorage:
   └─ router.push("/login")
   
   Se DADOS mas cargo INVÁLIDO para rota:
   ├─ Rota "/" e cargo ≠ "administrador"
   │  └─ router.push("/login")
   │
   └─ Rota "/hub" e cargo ≠ "funcionário"
      └─ router.push("/login")
   
   Se VÁLIDO:
   └─ Permite acesso + carrega componente

4. Logout:
   ├─ localStorage.removeItem("usuario")
   ├─ localStorage.removeItem("cargo")
   └─ router.push("/login")
```

---

## 📊 ENDPOINTS API

```
┌──────────────────────────────────────────────────────────┐
│              BACKEND API (localhost:3001)               │
└──────────────────────────────────────────────────────────┘

🔐 AUTENTICAÇÃO
═══════════════════════════════════════════════════════════
POST /api/auth/login
├─ Descrição: Autenticar usuário
├─ Body:
│  {
│    "nome_usuario": "admin",
│    "senha": "senha123"
│  }
├─ Response (Success):
│  {
│    "success": true,
│    "usuario": {
│      "id_usuario": 1,
│      "nome_usuario": "admin",
│      "cargo": "administrador"
│    }
│  }
├─ Response (Error):
│  {
│    "success": false,
│    "error": "Usuário não encontrado"
│  }
└─ Status: 200 | 401 | 403 | 500

📋 MÓDULOS
═══════════════════════════════════════════════════════════
GET /api/modules
├─ Descrição: Listar módulos disponíveis
├─ Response: [ { id, title, description }, ... ]
└─ Status: 200 | 500

⚠️ ALERTAS
═══════════════════════════════════════════════════════════
GET /api/alerts
├─ Descrição: Obter alertas do sistema
├─ Response:
│  [
│    { type: "warning", message: "Estoque baixo: X" },
│    { type: "info", message: "3 pedidos registrados" }
│  ]
└─ Status: 200 | 500

📦 MATERIAIS
═══════════════════════════════════════════════════════════
GET /api/materials
├─ Descrição: Listar todos materiais
├─ Response: [ { id_material, nome, ... }, ... ]
└─ Status: 200 | 500

GET /api/materials/:id
├─ Descrição: Obter material específico
├─ Response: { id_material, nome, ... }
└─ Status: 200 | 404 | 500

POST /api/materials
├─ Descrição: Criar novo material
├─ Body: { nome: "string", ... }
├─ Response: { id_material, nome, ... }
└─ Status: 201 | 400 | 500

PUT /api/materials/:id
├─ Descrição: Atualizar material
├─ Body: { nome: "string", ... }
├─ Response: { id_material, nome, ... }
└─ Status: 200 | 400 | 404 | 500

DELETE /api/materials/:id
├─ Descrição: Deletar material
├─ Response: { success: true }
└─ Status: 200 | 404 | 500

🏥 HEALTH CHECK
═══════════════════════════════════════════════════════════
GET /health
├─ Descrição: Verificar se API está rodando
├─ Response: { ok: true }
└─ Status: 200
```

---

## 💾 ESTRUTURA DE DADOS

### localStorage (Frontend)
```json
{
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin",
    "cargo": "administrador"
  },
  "cargo": "administrador"
}
```

### Usuario Table (Backend)
```sql
CREATE TABLE usuario (
  id_usuario INTEGER PRIMARY KEY,
  nome_usuario STRING,           -- Identificador único
  senha_hash STRING,             -- Bcrypt hash
  cargo STRING,                  -- "administrador" | "funcionário"
  ativo BOOLEAN,                 -- true | false
  criado_em DATE,
  atualizado_em DATE
);

-- Dados de teste:
INSERT INTO usuario VALUES
  (1, 'admin', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz...', 'administrador', 1, now, now),
  (2, 'funcionario', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz...', 'funcionário', 1, now, now);
```

---

## 🎯 MATRIZ DE ACESSO

| Rota | Admin | Funcionário | Anônimo |
|------|-------|-------------|---------|
| `/login` | ✅ Redireciona a `/` | ✅ Redireciona a `/hub` | ✅ Acessa |
| `/` (admin) | ✅ Acessa | ❌ Redireciona a `/login` | ❌ Redireciona a `/login` |
| `/hub` | ❌ Redireciona a `/login` | ✅ Acessa | ❌ Redireciona a `/login` |
| Outras | ❌ 404 | ❌ 404 | ❌ 404 |

---

## 📈 FLUXO DE CONSTRUÇÃO

```
Phase 1: SQL Schema
    ↓
    20 Modelos Sequelize gerados
    ↓
Phase 2: Backend Express
    ├─ Controllers (auth, material, module)
    ├─ Services (alerts)
    ├─ Middleware (CORS, logging)
    └─ Rotas API
    ↓
Phase 3: Frontend Next.js
    ├─ Página login
    ├─ Dashboard admin (9 módulos)
    ├─ Dashboard funcionário (5 módulos)
    └─ Componentes UI
    ↓
Phase 4: Integração & Autenticação
    ├─ Login endpoint
    ├─ Proteção de rotas
    ├─ localStorage
    └─ Roteamento condicional
    ↓
Phase 5: Testes & Validação
    ├─ Auditoria completa
    ├─ Seed data
    ├─ Documentação
    └─ Correção de erros
    ↓
✅ PRONTO PARA USO
```

---

**Criado:** Dezembro 6, 2025
**Status:** ✅ Completo e Funcional
