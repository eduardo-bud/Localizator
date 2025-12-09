# 🔑 CREDENCIAIS E ACESSO

**Informações de Acesso ao Sistema Localizator**

---

## 🔐 Credenciais Padrão

As credenciais abaixo são criadas automaticamente ao executar `setup-database.js`.

### Usuário Administrador

| Campo | Valor |
|-------|-------|
| **Usuário** | `admin` |
| **Senha** | `admin123` |
| **Cargo** | Administrador |
| **Acesso** | Total (todas as funcionalidades) |

**Permissões:**
- ✅ Criar, editar, deletar usuários
- ✅ Criar, editar, deletar materiais
- ✅ Importar materiais via Excel
- ✅ Ver histórico completo de pedidos
- ✅ Ver histórico completo de retiradas
- ✅ Gerar relatórios
- ✅ Gerenciar alertas

---

### Usuário Funcionário 1

| Campo | Valor |
|-------|-------|
| **Usuário** | `funcionario1` |
| **Senha** | `123456` |
| **Cargo** | Funcionário |
| **Acesso** | Limitado |

**Permissões:**
- ✅ Visualizar materiais
- ✅ Criar pedidos
- ✅ Confirmar pedidos próprios
- ✅ Fazer retirada de materiais
- ✅ Ver histórico de seus pedidos/retiradas
- ❌ Editar outros usuários
- ❌ Editar materiais
- ❌ Ver histórico de outros usuários

---

### Usuário Funcionário 2

| Campo | Valor |
|-------|-------|
| **Usuário** | `funcionario2` |
| **Senha** | `123456` |
| **Cargo** | Funcionário |
| **Acesso** | Idêntico a funcionario1 |

---

## 🌐 URLs de Acesso

### Frontend

```
Home/Login:    http://localhost:3000
Hub Principal: http://localhost:3000/hub
Materiais:     http://localhost:3000/materiais
Pedidos:       http://localhost:3000/pedidos
Retirada:      http://localhost:3000/retirada
```

### Backend (API)

```
Base URL:      http://localhost:3001
Health Check:  http://localhost:3001/health
Login:         http://localhost:3001/api/auth/login
Materiais:     http://localhost:3001/api/materials
Pedidos:       http://localhost:3001/api/pedidos
Retiradas:     http://localhost:3001/api/retiradas
```

---

## 🚀 Como Fazer Login

### Via Interface Web

1. Acessa `http://localhost:3000`
2. Preenche `Usuário: admin`
3. Preenche `Senha: admin123`
4. Clica em "Entrar"
5. ✅ Redireciona para Dashboard

### Via API (cURL)

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nome_usuario": "admin",
    "senha": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin",
    "cargo": "administrador"
  }
}
```

---

## 🛡️ Gerenciamento de Tokens

### Token de Acesso (AccessToken)

- **Duração:** 24 horas
- **Uso:** Autenticação de requisições
- **Storage:** localStorage (chave: `token`)
- **Header:** `Authorization: Bearer <token>`

### Token de Renovação (RefreshToken)

- **Duração:** 7 dias
- **Uso:** Renovar accessToken expirado
- **Storage:** localStorage (chave: `refreshToken`)
- **Endpoint:** POST `/api/auth/refresh`

### Renovar Token Expirado

```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## 👥 Criar Novo Usuário

### Via Interface (Admin)

1. Admin acessa "Cadastro de Usuários"
2. Clica em "Novo Usuário"
3. Preenche:
   - Nome de usuário
   - Senha
   - Cargo (administrador / funcionário)
4. Clica em "Salvar"

### Via API

```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "nome_usuario": "novo_user",
    "senha": "senha123",
    "cargo": "funcionário"
  }'
```

**Response:**
```json
{
  "message": "Usuário criado com sucesso",
  "usuario": {
    "id_usuario": 4,
    "nome_usuario": "novo_user",
    "cargo": "funcionário",
    "ativo": true
  }
}
```

---

## 🔄 Trocar Senha de Usuário

### Como Admin (Editando Outro Usuário)

1. Admin clica no usuário na tabela
2. Modal de edição abre
3. Preenche nova senha
4. Clica em "Salvar"

### Via API

```bash
curl -X PUT http://localhost:3001/api/usuarios/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "senha": "nova_senha123"
  }'
```

---

## 🚪 Logout

### Via Interface

1. Clica em perfil do usuário (canto superior)
2. Seleciona "Logout"
3. ✅ Token removido de localStorage
4. ✅ Redireciona para login

### Via JavaScript (Browser)

```javascript
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
window.location.href = '/login';
```

---

## 📊 Dados de Teste

### Materiais Padrão

Ao executar `setup-database.js`, os seguintes materiais são criados:

| Código | Nome | Categoria | Estoque Mín | Estoque Atual |
|--------|------|-----------|-------------|---------------|
| ALU-001 | Alumínio Perfil 40x40 | Alumínio | 100 | 500 |
| ALU-002 | Alumínio Perfil 20x20 | Alumínio | 50 | 300 |
| VID-001 | Vidro Temperado 8mm | Vidro | 50 | 200 |
| VID-002 | Vidro Float 6mm | Vidro | 30 | 150 |
| ACM-001 | ACM Branco 3mm | ACM | 30 | 100 |
| ACM-002 | ACM Cinza 3mm | ACM | 30 | 80 |
| AÇO-001 | Estrutura Aço 50x50 | Aço | 20 | 60 |
| AÇO-002 | Chapa Aço 2mm | Aço | 15 | 50 |

---

## 🔗 Fluxos de Acesso por Cargo

### Administrador

```
Login (admin/admin123)
  ↓
Hub Principal
  ├─ Materiais (admin)
  ├─ Usuários (admin)
  ├─ Pedidos (listar todos)
  ├─ Retiradas (histórico completo)
  ├─ Alertas
  └─ Relatórios
```

### Funcionário

```
Login (funcionario1/123456)
  ↓
Hub Principal
  ├─ Materiais (apenas visualizar)
  ├─ Criar Pedido
  │  ├─ Adicionar itens
  │  └─ Confirmar
  ├─ Meus Pedidos
  ├─ Retirada de Materiais
  └─ Meus Históricos
```

---

## ⚠️ Segurança de Credenciais

### IMPORTANTE

**NUNCA:**
- ❌ Commitar credenciais no GitHub
- ❌ Compartilhar senhas em mensagens
- ❌ Usar senhas idênticas em produção
- ❌ Deixar console aberto com tokens visíveis

**SEMPRE:**
- ✅ Mudar senhas padrão em produção
- ✅ Usar HTTPS em ambiente real
- ✅ Implementar 2FA se possível
- ✅ Registrar tentativas de login
- ✅ Rotacionar tokens periodicamente

---

## 🔐 Recuperação de Acesso

### Se Esquecer a Senha

**Ação:** Contate administrador do sistema para resetar

**Admin pode:**
1. Acessar "Cadastro de Usuários"
2. Encontrar usuário
3. Editar e alterar senha
4. Compartilhar nova senha temporária

---

## 🧪 Teste de Autenticação

### Comando para Testar Login

```bash
# Substitua as credenciais conforme necessário
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nome_usuario": "admin",
    "senha": "admin123"
  }' | jq '.'
```

### Esperado

```json
{
  "success": true,
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 86400,
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin",
    "cargo": "administrador"
  }
}
```

### Teste de Acesso Protegido

```bash
# Use o token retornado no teste anterior
curl -X GET http://localhost:3001/api/usuarios \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📱 Variáveis de Ambiente

### Backend (.env)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=sqlite:./database.sqlite
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_REFRESH_SECRET=sua_chave_refresh_segura_aqui
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🆘 Suporte

### Problemas Comuns

**"Usuário não encontrado"**
- Verifique nome de usuário (case-sensitive)
- Verifique se usuário foi criado

**"Senha incorreta"**
- Verifique se Caps Lock está desativado
- Tente fazer login via API para debug

**"Token expirado"**
- Sistema tenta renovar automaticamente
- Se falhar, faça login novamente

**"Acesso negado"**
- Verifique cargo do usuário
- Admin pode ser necessário para essa ação

---

## 📞 Contato

Para dúvidas sobre acesso ou credenciais:
1. Consulte administrador do sistema
2. Verifique documentação técnica
3. Abra issue no repositório

---

**Versão da documentação:** 1.1  
**Última atualização:** Dezembro 2025
