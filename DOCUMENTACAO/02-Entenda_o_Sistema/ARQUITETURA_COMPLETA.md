# 🏗️ ARQUITETURA COMPLETA DO SISTEMA

**Documentação Técnica da Arquitetura do Localizator**

---

## 📊 Stack Tecnológico

### Frontend
```
Next.js 13.5.11          Framework React moderno
React 18.2               Biblioteca UI
TypeScript 5.9           Type safety
Estilos Inline          CSS em objetos JavaScript (sem Tailwind)
Lucide React            Ícones SVG
date-fns                Manipulação de datas
XLSX                    Leitura de arquivos Excel
Axios/Fetch             Requisições HTTP
```

### Backend
```
Node.js 16+             Runtime JavaScript
Express.js 4.x          Framework web
Sequelize 6.x           ORM para banco de dados
SQLite 3                Banco de dados relacional
bcrypt                  Hash de senhas
jsonwebtoken (JWT)      Autenticação
CORS                    Compartilhamento de recursos
Body-parser             Parser de JSON
Multer                  Upload de arquivos
```

### Banco de Dados
```
SQLite 3                Banco de dados relacional
7 Tabelas principais    Usuario, Material, Pedido, ItemPedido, Retirada, RetiradaMaterial, AlertaEstoque
Schema SQL              Definido em banco_integrador.sql
```

---

## 🗂️ Estrutura de Pastas

### Backend (`/backend`)

```
backend/
├── controllers/                    # Controladores (lógica de negócio)
│   ├── auth_controller.js         # Login, refresh token
│   ├── usuario_controller.js      # CRUD de usuários
│   ├── material_controller.js     # CRUD de materiais, importação
│   ├── retirada_controller.js     # Retirada de materiais
│   └── module_controller.js       # Listagem de módulos
│
├── models/                         # Modelos Sequelize
│   ├── index.js                   # Inicialização e relacionamentos
│   ├── Usuario.js                 # Modelo de usuário
│   ├── Material.js                # Modelo de material
│   ├── Pedido.js                  # Modelo de pedido
│   ├── ItemPedido.js              # Modelo de item de pedido
│   ├── Retirada.js                # Modelo de retirada
│   └── RetiradaMaterial.js        # Modelo de item retirada
│
├── middleware/                     # Middlewares
│   └── authMiddleware.js          # JWT, permissões, rate limiting
│
├── services/                       # Serviços auxiliares
│   └── alertService.js            # Alertas de estoque
│
├── repositories/                   # Repositórios de acesso (futuro)
│   └── (para futuras abstrações)
│
├── config/                         # Configurações
│   └── database.js                # Configuração de banco de dados
│
├── migrations/                     # Migrações de banco (futuro)
│   └── (para versionamento de schema)
│
├── server.js                       # Arquivo principal - rotas
├── setup-database.js              # Script de setup inicial
├── seed-materials.js              # Script de população de dados
├── seed-usuarios.js               # Script de criação de usuários
├── database.sqlite                # Arquivo de banco de dados
├── package.json                   # Dependências do projeto
├── package-lock.json              # Lock file
└── README.md                       # Documentação do backend
```

### Frontend (`/frontend`)

```
frontend/
├── pages/                          # Páginas Next.js (roteamento automático)
│   ├── index.tsx                  # Home / Redireciona para login
│   ├── login.tsx                  # Página de login
│   ├── hub.tsx                    # Dashboard/Menu principal
│   ├── materiais.tsx              # Listagem de materiais (pública)
│   ├── materiais-admin.tsx        # CRUD de materiais (admin)
│   ├── pedido.tsx                 # Criar/editar pedido
│   ├── pedidos.tsx                # Listar pedidos do usuário
│   ├── consultar-pedidos.tsx      # Histórico/relatório de pedidos
│   ├── retirada.tsx               # Listar materiais para retirada
│   ├── retirada/
│   │   └── confirmar.tsx          # Confirmar retirada específica
│   ├── cadastro-usuario.tsx       # CRUD de usuários (admin)
│   ├── _app.tsx                   # Componente raiz da aplicação
│   └── _document.tsx              # Documento HTML customizado (se existir)
│
├── components/                     # Componentes reutilizáveis
│   ├── Header.tsx                 # Cabeçalho comum
│   ├── Modal.tsx                  # Modal genérico
│   ├── Table.tsx                  # Tabela reutilizável
│   ├── Form.tsx                   # Form reutilizável
│   └── (outros componentes)
│
├── utils/                          # Funções auxiliares
│   ├── fetchAPI.js                # Wrapper de fetch com autenticação
│   ├── auth.js                    # Funções de autenticação
│   ├── validators.js              # Validações
│   └── formatters.js              # Formatação de dados
│
├── styles/                         # Estilos globais (CSS)
│   └── globals.css                # Estilos globais
│
├── pages/_app.tsx                 # App root com providers
├── public/                        # Arquivos estáticos (imagens, fonts)
├── next.config.js                 # Configuração do Next.js
├── tsconfig.json                  # Configuração de TypeScript
├── package.json                   # Dependências do frontend
└── README.md                       # Documentação do frontend
```

### Banco de Dados (`/database`)

```
database/
├── database.sqlite                # Arquivo do banco SQLite
├── banco_integrador.sql           # Schema SQL com todas as tabelas
└── seed_data.sql                  # Dados iniciais de teste
```

---

## 📦 Fluxo de Dados

### Requisição HTTP Típica

```
1. FRONTEND (Browser)
   ├─ User Action (click, submit)
   ├─ utils/fetchAPI.js
   │  ├─ Adiciona header Authorization: Bearer <token>
   │  ├─ Envia POST/GET/PUT/DELETE para /api/...
   │  └─ Em caso de 401: tenta refresh token
   └─ Aguarda response

2. BACKEND (Node.js/Express)
   ├─ server.js recebe requisição
   ├─ Middleware:
   │  ├─ securityLog (registra requisição)
   │  ├─ rateLimit (limite de requisições)
   │  ├─ CORS (validação de origem)
   │  └─ verifyToken (validação JWT)
   ├─ Rota encontrada, chama controller
   ├─ Controller:
   │  ├─ Validação de dados
   │  ├─ Query ao banco via Sequelize
   │  ├─ Lógica de negócio
   │  └─ Resposta JSON
   └─ Response enviada

3. FRONTEND (Browser)
   ├─ utils/fetchAPI.js recebe response
   ├─ Se erro 401: refresh token e tenta novamente
   ├─ Se sucesso: passa para componente
   └─ Renderiza atualização na tela
```

---

## 🔐 Fluxo de Autenticação

### 1. Login

```
[Browser] login.tsx
    ↓ POST /api/auth/login
    ↓ { nome_usuario, senha }
[Server] server.js → auth_controller.js → login()
    ├─ Usuario.findOne({ where: { nome_usuario } })
    ├─ bcrypt.compare(senha, usuario.senha_hash)
    ├─ generateToken(usuario) → JWT com expiração 24h
    ├─ generateRefreshToken(usuario) → JWT com expiração 7d
    └─ Retorna { accessToken, refreshToken, expiresIn }
    ↓ Response 200 OK
[Browser] localStorage.setItem('token', accessToken)
    ↓ Redireciona para /hub
```

### 2. Requisição Autenticada

```
[Browser] fetchAPI('/api/materials')
    ├─ Adiciona header: Authorization: Bearer <accessToken>
    └─ Envia requisição
    ↓
[Server] middleware/authMiddleware.js → verifyToken
    ├─ Extrai token do header
    ├─ jwt.verify(token, SECRET)
    ├─ Decodifica usuario info
    └─ Adiciona req.user = { id_usuario, cargo }
    ↓ next() → vai para controller
[Server] Controller usa req.user para filtros
    ↓
[Browser] Recebe resposta com dados
```

### 3. Token Expirado

```
[Browser] fetchAPI('/api/materials')
    ├─ Token está expirado
    └─ Recebe Response 401
    ↓
[Browser] utils/fetchAPI.js detecta 401
    ├─ POST /api/auth/refresh com refreshToken
    ├─ Recebe novo accessToken
    ├─ localStorage.setItem('token', novoToken)
    └─ Retenta requisição original
    ↓
[Server] Requisição agora com token novo
    └─ Processa normalmente
```

---

## 🗄️ Banco de Dados - Modelo de Dados

### Tabela: Usuario

```sql
CREATE TABLE Usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_usuario VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) NOT NULL,              -- 'administrador' ou 'funcionário'
  ativo BOOLEAN DEFAULT 1,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Dados Padrão:**
- admin / admin123 (cargo: administrador)
- funcionario1 / 123456 (cargo: funcionário)
- funcionario2 / 123456 (cargo: funcionário)

### Tabela: Material

```sql
CREATE TABLE Material (
  id_material INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_material VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  unidade_medida VARCHAR(20) DEFAULT 'UN',
  estoque_minimo DECIMAL(10,2) DEFAULT 0,
  estoque_atual DECIMAL(10,2) DEFAULT 0,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Índices:**
- PK: id_material
- Índice em: codigo_material (busca rápida), categoria (filtro)

### Tabela: Pedido

```sql
CREATE TABLE Pedido (
  id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_pedido VARCHAR(255) UNIQUE NOT NULL,
  fk_usuario_id_usuario INTEGER NOT NULL,
  data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'novo',        -- 'novo', 'confirmado', 'cancelado'
  observacao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES Usuario(id_usuario)
);
```

### Tabela: ItemPedido

```sql
CREATE TABLE ItemPedido (
  id_item_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_pedido_id_pedido INTEGER NOT NULL,
  fk_material_id_material INTEGER NOT NULL,
  quantidade DECIMAL(10,2) NOT NULL,
  valor_unitario DECIMAL(15,2),
  observacao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_pedido_id_pedido) REFERENCES Pedido(id_pedido),
  FOREIGN KEY (fk_material_id_material) REFERENCES Material(id_material)
);
```

### Tabela: Retirada

```sql
CREATE TABLE Retirada (
  id_retirada INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_usuario_id_usuario INTEGER NOT NULL,
  data_retirada DATETIME DEFAULT CURRENT_TIMESTAMP,
  motivo VARCHAR(255),
  observacao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES Usuario(id_usuario)
);
```

### Tabela: RetiradaMaterial

```sql
CREATE TABLE RetiradaMaterial (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_retiradas_id_retirada INTEGER NOT NULL,
  fk_material_id_material INTEGER NOT NULL,
  id_material INTEGER,
  quantidade DECIMAL(10,2) NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_retiradas_id_retirada) REFERENCES Retirada(id_retirada),
  FOREIGN KEY (fk_material_id_material) REFERENCES Material(id_material)
);
```

---

## 🔌 Padrão de API REST

### Convenções de Rota

```
GET    /api/recursos           → Listar todos
GET    /api/recursos/:id       → Obter um específico
POST   /api/recursos           → Criar novo
PUT    /api/recursos/:id       → Atualizar
DELETE /api/recursos/:id       → Deletar

POST   /api/recursos/import/excel → Importação em lote
POST   /api/recursos/:id/confirmar → Ação específica
```

### Formato de Response

**Sucesso (2xx)**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

**Erro (4xx/5xx)**
```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": "..."
}
```

ou

```json
{
  "message": "Erro específico"
}
```

### Headers Padrão

**Request**
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

**Response**
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
```

---

## 🛡️ Segurança

### Middlewares de Segurança

**1. securityLog** - Registra todas as requisições
```javascript
Middleware que loga: timestamp, method, path, user_id
```

**2. rateLimit** - Limita requisições
```javascript
100 requisições por 15 minutos (global)
100 requisições por 1 minuto (login)
```

**3. CORS** - Controla origem
```javascript
Origem permitida: http://localhost:3000 (desenvolvimento)
```

**4. verifyToken** - Valida JWT
```javascript
├─ Extrai token do header Authorization
├─ Valida assinatura
├─ Valida expiração
└─ Adiciona req.user se válido
```

**5. requireAdmin** - Verifica permissão
```javascript
├─ Requer token válido
├─ Valida: req.user.cargo === 'administrador'
└─ Bloqueia se não for admin
```

### Proteção de Dados

- ✅ Senhas: Hash bcrypt (10 rounds)
- ✅ Tokens: JWT com expiração
- ✅ SQL Injection: Prevenção via Sequelize ORM
- ✅ CSRF: Headers customizados
- ✅ XSS: Sanitização de input (validação)

---

## 📊 Padrão de Código Backend

### Estrutura de Controller

```javascript
// controllers/exemplo_controller.js

const { Model } = require('../models');

async function listExemplos(req, res) {
  try {
    // Validação de entrada
    const { filtro } = req.query;
    
    // Query ao banco
    const items = await Model.findAll({
      where: { /* ... */ },
      order: [['campo', 'ASC']]
    });
    
    // Resposta
    res.json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Descrição do erro' });
  }
}

async function createExemplo(req, res) {
  try {
    // Validação obrigatória
    if (!req.body.campo) {
      return res.status(400).json({ error: 'Campo obrigatório' });
    }
    
    // Validação de tipos
    if (isNaN(req.body.numero)) {
      return res.status(400).json({ error: 'Número inválido' });
    }
    
    // Criação no banco
    const item = await Model.create(req.body);
    
    // Resposta
    res.status(201).json({
      success: true,
      message: 'Criado com sucesso',
      id: item.id
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar' });
  }
}

exports.listExemplos = listExemplos;
exports.createExemplo = createExemplo;
// ... outros exports
```

### Estrutura de Modelo

```javascript
// models/Exemplo.js

module.exports = (sequelize, DataTypes) => {
  const Exemplo = sequelize.define('Exemplo', {
    id_exemplo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    atualizado_em: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'Exemplo',
    timestamps: false
  });

  return Exemplo;
};
```

---

## 🎨 Padrão de Código Frontend

### Estrutura de Página

```typescript
// pages/exemplo.tsx

import React, { useState, useEffect } from 'react';
import fetchAPI from '../utils/fetchAPI';
import Header from '../components/Header';

interface Item {
  id: number;
  nome: string;
  // ... outros campos
}

export default function ExemploPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const data = await fetchAPI('/api/exemplos');
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <>
      <Header title="Exemplos" />
      <div style={{ padding: '20px' }}>
        {items.map(item => (
          <div key={item.id}>
            {item.nome}
          </div>
        ))}
      </div>
    </>
  );
}
```

### Estrutura de Componente

```typescript
// components/ExemploCard.tsx

interface Props {
  title: string;
  description?: string;
  onAction?: () => void;
}

export default function ExemploCard({ title, description, onAction }: Props) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#1e293b', margin: '0 0 8px' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: '#64748b', margin: '0' }}>
          {description}
        </p>
      )}
      {onAction && (
        <button 
          onClick={onAction}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Ação
        </button>
      )}
    </div>
  );
}
```

---

## 🚀 Fluxo de Inicialização

### Backend

```
1. npm start
   ↓
2. server.js executa
   ↓
3. Sequelize.authenticate() - conecta ao banco
   ↓
4. seedDatabaseOnStartup() - verifica se banco está pronto
   ↓
5. app.listen(3001) - servidor rodando
   ↓
6. Pronto para requisições
```

### Frontend

```
1. npm run dev
   ↓
2. Next.js compila TypeScript
   ↓
3. Hot reload ativado
   ↓
4. Disponível em http://localhost:3000
   ↓
5. _app.tsx carrega (context providers, global styles)
   ↓
6. index.tsx renderiza ou redireciona para /login
```

---

## 📈 Padrão de Comunicação Frontend-Backend

### Requisição GET com Filtros

```typescript
// Frontend
const response = await fetchAPI(
  '/api/materiais?search=aluminio&categoria=perfil&order=nome&sort=ASC'
);

// Backend
app.get('/api/materiais', (req, res) => {
  const { search, categoria, order, sort } = req.query;
  // Processa filtros
});
```

### Requisição POST com Body

```typescript
// Frontend
const response = await fetchAPI('/api/pedidos', 'POST', {
  numero_pedido: 'PED-001',
  observacao: 'Urgente'
});

// Backend
app.post('/api/pedidos', (req, res) => {
  const { numero_pedido, observacao } = req.body;
  // Processa dados
});
```

### Requisição com Upload de Arquivo

```typescript
// Frontend
const formData = new FormData();
formData.append('file', inputFile);
const response = await fetch('/api/materiais/import/excel', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

// Backend (Multer)
app.post('/api/materiais/import/excel', 
  verifyToken, 
  requireAdmin,
  multer.single('file'),
  (req, res) => {
    // req.file contém arquivo
  }
);
```

---

## 🔄 Ciclo de Vida de Uma Feature

```
1. REQUISIÇÃO (Frontend)
   └─ User action → fetch HTTP

2. ROTEAMENTO (Backend)
   └─ server.js encontra rota

3. VALIDAÇÃO (Backend)
   ├─ Validação de permissão (JWT)
   ├─ Validação de entrada (dados)
   └─ Validação de lógica (regras de negócio)

4. PROCESSAMENTO (Backend)
   ├─ Query ao banco (Sequelize)
   ├─ Transformação de dados
   ├─ Cálculos e lógica
   └─ Atualização/Criação no banco

5. RESPOSTA (Backend)
   └─ JSON com status HTTP

6. RENDERIZAÇÃO (Frontend)
   ├─ Atualizar state
   ├─ Re-render componente
   └─ Exibir feedback (sucesso/erro)
```

---

## 📡 Integração: Cliente e Servidor

```
┌─ CLIENTE (Next.js/React)
│  ├─ pages/           (páginas)
│  ├─ components/      (componentes reutilizáveis)
│  ├─ utils/           (funções auxiliares)
│  └─ fetchAPI.js      (HTTP com autenticação)
│
├─ BARREIRA: HTTP + JWT
│
└─ SERVIDOR (Node.js/Express)
   ├─ server.js        (roteamento)
   ├─ controllers/     (lógica de negócio)
   ├─ models/          (ORM Sequelize)
   ├─ middleware/      (autenticação, validação)
   └─ database.sqlite  (dados persistidos)
```

---

**Versão da arquitetura:** 1.1  
**Última atualização:** Dezembro 2025
