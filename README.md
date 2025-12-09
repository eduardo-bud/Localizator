# 📚 Localizator - Sistema de Gerenciamento de Almoxarifado

> Sistema web especializado para controle de materiais em almoxarifado, desenvolvido para a empresa **Rissi Fachadas e Esquadrias**.

## 🚀 Instalação Rápida

### ⭐ IMPORTANTE: Primeiro Setup

Se você está usando este projeto em um novo aparelho (Windows ou Linux), execute OBRIGATORIAMENTE:

```bash
# 1. Ir para a pasta backend
cd backend

# 2. Instalar dependências
npm install

# 3. **CRIAR O BANCO DE DADOS** (NECESSÁRIO!)
node setup-database.js

# 4. Iniciar o servidor
npm start
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Credenciais Padrão

Após executar `setup-database.js`, use:

| Usuário | Senha | Tipo |
|---------|-------|------|
| `admin` | `admin123` | Administrador |
| `funcionario1` | `123456` | Funcionário |
| `funcionario2` | `123456` | Funcionário |

## 📋 O que o Script `setup-database.js` faz

✅ Cria as tabelas do banco de dados automaticamente  
✅ Cria os usuários padrão com senhas hasheadas  
✅ Popula dados iniciais de teste (8 materiais)  
✅ Sincroniza o banco com os modelos Sequelize  

**Nunca execute o backend sem rodar este script primeiro!**

## 🗄️ Banco de Dados

O banco SQLite é criado em:
```
backend/database/database.sqlite
```

Para resetar do zero, delete esta pasta e execute novamente:
```bash
node setup-database.js
```

## 📁 Estrutura

```
projeto/
├── backend/
│   ├── models/              # Modelos (Material, Usuario)
│   ├── controllers/         # Lógica de negócio
│   ├── middleware/          # Autenticação JWT
│   ├── services/            # Serviços
│   ├── setup-database.js    # ⭐ EXECUTE ISTO PRIMEIRO
│   ├── server.js            # Servidor Express
│   └── package.json
│
├── frontend/
│   ├── pages/               # Páginas Next.js
│   ├── components/          # Componentes React
│   └── package.json
│
└── DOCUMENTACAO/            # Documentação completa
```

## 🔧 Comandos Úteis

### Backend

```bash
cd backend

npm start                  # Inicia servidor (porta 3001)
node setup-database.js     # Setup do banco (SEMPRE execute primeiro!)
npm install                # Instala dependências
```

### Frontend

```bash
cd frontend

npm run dev               # Desenvolvimento (porta 3000)
npm run build             # Compilar para produção
npm start                 # Rodar versão produção
npm install               # Instalar dependências
```

## 🐛 Solução de Problemas

### Erro: "Porta 3000 ou 3001 já está em uso"

**Windows (PowerShell):**
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Linux/Mac:**
```bash
pkill -f node
```

### Erro ao conectar ao banco ou "Cannot find module"

```bash
# Vá para backend
cd backend

# Reinstale tudo
npm install

# Recrie o banco
node setup-database.js

# Inicie novamente
npm start
```

### Banco corrompido

```bash
# Delete a pasta de banco
rm -r backend/database/

# Recrie tudo
cd backend
node setup-database.js
```

## 🌍 Acessar a Aplicação

Após iniciar ambos servidores:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Login padrão**: admin / admin123

## 📱 Funcionalidades

✅ **Autenticação JWT** - Login seguro com tokens  
✅ **Gerenciamento de Usuários** - Admin e Funcionários  
✅ **Cadastro de Materiais** - Código, nome, categoria, estoque  
✅ **Busca e Filtros** - Por nome, categoria, código  
✅ **Import/Export Excel** - Importar e baixar materiais  
✅ **Controle de Estoque** - Estoque atual e mínimo (com decimais)  
✅ **Interface Responsiva** - Funciona em desktop e mobile  

## 📖 Documentação Completa

Veja a documentação detalhada em:
```
DOCUMENTACAO/01-Comece_Aqui/COMECE_AQUI.md
```

---

**Desenvolvido para:** Rissi Fachadas e Esquadrias  
**Status:** Em desenvolvimento ativo ✨
