# 📞 API ENDPOINTS - REFERÊNCIA COMPLETA

**Documentação de Todos os Endpoints da API**

---

## 🎯 Sumário de Endpoints

| Método | Rota | Autenticação | Permissão | Descrição |
|--------|------|---|---|---|
| **AUTENTICAÇÃO** |||||
| POST | `/api/auth/login` | ❌ | - | Login com usuário/senha |
| POST | `/api/auth/refresh` | ❌ | - | Renovar token expirado |
| **USUÁRIOS** |||||
| GET | `/api/usuarios` | ✅ | Admin | Listar todos usuários |
| GET | `/api/usuarios/:id` | ✅ | Admin | Obter usuário específico |
| POST | `/api/usuarios` | ✅ | Admin | Criar novo usuário |
| PUT | `/api/usuarios/:id` | ✅ | Admin | Editar usuário |
| DELETE | `/api/usuarios/:id` | ✅ | Admin | Deletar usuário |
| **MATERIAIS** |||||
| GET | `/api/materials` | ❌ | - | Listar materiais (público) |
| GET | `/api/materials/:id` | ❌ | - | Obter material específico |
| POST | `/api/materials` | ✅ | Admin | Criar material |
| PUT | `/api/materials/:id` | ✅ | Admin | Editar material |
| DELETE | `/api/materials/:id` | ✅ | Admin | Deletar material |
| POST | `/api/materials/import/excel` | ✅ | Admin | Importar materiais (Excel) |
| **PEDIDOS** |||||
| GET | `/api/pedidos` | ✅ | Qualquer | Listar pedidos (filtrado por usuário) |
| GET | `/api/pedidos/:id` | ✅ | Qualquer | Obter pedido específico |
| POST | `/api/pedidos` | ✅ | Qualquer | Criar novo pedido |
| PUT | `/api/pedidos/:id` | ✅ | Qualquer | Editar pedido |
| DELETE | `/api/pedidos/:id` | ✅ | Qualquer | Deletar pedido |
| POST | `/api/pedidos/:id/itens` | ✅ | Qualquer | Adicionar item ao pedido |
| DELETE | `/api/pedidos/:id/itens/:itemId` | ✅ | Qualquer | Remover item do pedido |
| POST | `/api/pedidos/:id/confirmar` | ✅ | Qualquer | Confirmar pedido |
| **RETIRADAS** |||||
| POST | `/api/retirada` | ✅ | Qualquer | Retirar material (singular) |
| POST | `/api/retiradas` | ✅ | Qualquer | Retirar múltiplos (batch) |
| GET | `/api/retiradas` | ✅ | Admin | Listar histórico retiradas |
| GET | `/api/retiradas/:id` | ✅ | Qualquer | Obter retirada específica |
| **SISTEMA** |||||
| GET | `/api/modules` | ❌ | - | Listar módulos do sistema |
| GET | `/api/alerts` | ❌ | - | Listar alertas (baixo estoque) |
| GET | `/health` | ❌ | - | Health check do servidor |

---

## 🔐 AUTENTICAÇÃO

### POST `/api/auth/login`

Autentica usuário e retorna tokens JWT.

**Request:**
```json
{
  "nome_usuario": "admin",
  "senha": "admin123"
}
```

**Response (200 OK):**
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

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

**Erros Possíveis:**
- 400: Nome de usuário ou senha não fornecidos
- 401: Usuário não encontrado
- 401: Senha incorreta
- 403: Usuário inativo

---

### POST `/api/auth/refresh`

Renova um token JWT expirado.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

---

## 👥 USUÁRIOS

### GET `/api/usuarios`

Lista todos os usuários do sistema. **Requer autenticação + Admin**.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
[
  {
    "id_usuario": 1,
    "nome_usuario": "admin",
    "cargo": "administrador",
    "ativo": true,
    "criado_em": "2024-01-01T10:00:00Z"
  },
  {
    "id_usuario": 2,
    "nome_usuario": "funcionario1",
    "cargo": "funcionário",
    "ativo": true,
    "criado_em": "2024-01-02T10:00:00Z"
  }
]
```

---

### GET `/api/usuarios/:id`

Obtem dados de um usuário específico. **Requer autenticação + Admin**.

**Response (200 OK):**
```json
{
  "id_usuario": 1,
  "nome_usuario": "admin",
  "cargo": "administrador",
  "ativo": true,
  "criado_em": "2024-01-01T10:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Usuário não encontrado"
}
```

---

### POST `/api/usuarios`

Cria um novo usuário. **Requer autenticação + Admin**.

**Request:**
```json
{
  "nome_usuario": "novo_usuario",
  "senha": "senha123",
  "cargo": "funcionário"
}
```

**Response (201 Created):**
```json
{
  "message": "Usuário criado com sucesso",
  "usuario": {
    "id_usuario": 3,
    "nome_usuario": "novo_usuario",
    "cargo": "funcionário",
    "ativo": true
  }
}
```

**Erros Possíveis:**
- 400: Campos obrigatórios faltando
- 400: Usuário já existe
- 400: Cargo inválido

---

### PUT `/api/usuarios/:id`

Edita dados de um usuário. **Requer autenticação + Admin**.

**Request:**
```json
{
  "cargo": "administrador",
  "ativo": true,
  "senha": "nova_senha123"
}
```

**Response (200 OK):**
```json
{
  "message": "Usuário atualizado com sucesso",
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin",
    "cargo": "administrador",
    "ativo": true
  }
}
```

---

### DELETE `/api/usuarios/:id`

Deleta um usuário. **Requer autenticação + Admin**.

**Response (200 OK):**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

---

## 📦 MATERIAIS

### GET `/api/materials`

Lista todos os materiais. **Sem autenticação necessária**.

**Query Parameters:**
- `search` - Busca por nome (case-insensitive)
- `categoria` - Filtro por categoria
- `order` - Campo para ordenação (default: 'nome')
- `sort` - ASC ou DESC (default: 'ASC')

**Exemplo:**
```
GET /api/materials?search=aluminio&categoria=perfil&order=estoque_atual&sort=DESC
```

**Response (200 OK):**
```json
[
  {
    "id_material": 1,
    "codigo_material": "ALU-001",
    "nome": "Alumínio Perfil 40x40",
    "descricao": "Perfil de alumínio quadrado",
    "categoria": "Alumínio",
    "unidade_medida": "metro",
    "estoque_minimo": 100,
    "estoque_atual": 500,
    "criado_em": "2024-01-01T10:00:00Z",
    "atualizado_em": "2024-01-15T14:30:00Z"
  }
]
```

---

### GET `/api/materials/:id`

Obtem um material específico. **Sem autenticação necessária**.

**Response (200 OK):**
```json
{
  "id_material": 1,
  "codigo_material": "ALU-001",
  "nome": "Alumínio Perfil 40x40",
  "descricao": "Perfil de alumínio quadrado",
  "categoria": "Alumínio",
  "unidade_medida": "metro",
  "estoque_minimo": 100,
  "estoque_atual": 500,
  "criado_em": "2024-01-01T10:00:00Z",
  "atualizado_em": "2024-01-15T14:30:00Z"
}
```

---

### POST `/api/materials`

Cria um novo material. **Requer autenticação + Admin**.

**Request:**
```json
{
  "codigo_material": "VID-001",
  "nome": "Vidro Temperado 8mm",
  "descricao": "Vidro temperado para fachadas",
  "categoria": "Vidro",
  "unidade_medida": "m²",
  "estoque_minimo": 50,
  "estoque_atual": 200
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id_material": 5,
  "message": "Material criado com sucesso"
}
```

---

### PUT `/api/materials/:id`

Edita um material. **Requer autenticação + Admin**.

**Request:**
```json
{
  "estoque_atual": 600,
  "estoque_minimo": 150
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material atualizado com sucesso"
}
```

---

### DELETE `/api/materials/:id`

Deleta um material. **Requer autenticação + Admin**.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Material deletado com sucesso"
}
```

---

### POST `/api/materials/import/excel`

Importa múltiplos materiais de arquivo Excel. **Requer autenticação + Admin**.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <accessToken>
```

**Body:**
```
file: <arquivo.xlsx>
```

**Response (200 OK):**
```json
{
  "sucesso": [
    {
      "nome": "Alumínio Perfil",
      "codigo": "ALU-002",
      "id_material": 6
    }
  ],
  "erros": [
    {
      "linha": 2,
      "nome": "Material Inválido",
      "motivo": "Nome obrigatório"
    }
  ],
  "resumo": {
    "total": 10,
    "sucesso": 9,
    "erros": 1
  }
}
```

---

## 📝 PEDIDOS

### GET `/api/pedidos`

Lista pedidos. **Requer autenticação**.
- Usuário normal: vê apenas seus pedidos
- Admin: vê todos

**Query Parameters:**
- `status` - Filtro por status (novo/confirmado/cancelado)
- `dataInicio` - Data inicial (YYYY-MM-DD)
- `dataFim` - Data final (YYYY-MM-DD)

**Response (200 OK):**
```json
[
  {
    "id_pedido": 1,
    "numero_pedido": "PED-001",
    "fk_usuario_id_usuario": 1,
    "data_pedido": "2024-01-15T10:00:00Z",
    "status": "confirmado",
    "observacao": "Cliente solicita agilidade",
    "itens": [
      {
        "id_item_pedido": 1,
        "id_material": 1,
        "quantidade": 100,
        "valor_unitario": 50.00,
        "material": {
          "id_material": 1,
          "nome": "Alumínio Perfil 40x40"
        }
      }
    ]
  }
]
```

---

### GET `/api/pedidos/:id`

Obtem um pedido específico com seus itens. **Requer autenticação**.

**Response (200 OK):**
```json
{
  "id_pedido": 1,
  "numero_pedido": "PED-001",
  "fk_usuario_id_usuario": 1,
  "data_pedido": "2024-01-15T10:00:00Z",
  "status": "confirmado",
  "observacao": "...",
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin"
  },
  "itens": [
    {
      "id_item_pedido": 1,
      "id_material": 1,
      "quantidade": 100,
      "valor_unitario": 50.00,
      "observacao": "...",
      "material": {
        "id_material": 1,
        "nome": "Alumínio Perfil 40x40",
        "estoque_atual": 500
      }
    }
  ]
}
```

---

### POST `/api/pedidos`

Cria um novo pedido. **Requer autenticação**.

**Request:**
```json
{
  "observacao": "Urgente"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id_pedido": 2,
  "numero_pedido": "PED-002",
  "message": "Pedido criado com sucesso"
}
```

---

### PUT `/api/pedidos/:id`

Edita um pedido. **Requer autenticação**.

**Request:**
```json
{
  "observacao": "Prazo alterado"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido atualizado"
}
```

---

### POST `/api/pedidos/:id/itens`

Adiciona um item ao pedido. **Requer autenticação**.

**Request:**
```json
{
  "id_material": 3,
  "quantidade": 150,
  "valor_unitario": 45.00,
  "observacao": "Entrega diferenciada"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id_item_pedido": 5,
  "message": "Item adicionado com sucesso"
}
```

---

### DELETE `/api/pedidos/:id/itens/:itemId`

Remove um item do pedido. **Requer autenticação**.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removido com sucesso"
}
```

---

### POST `/api/pedidos/:id/confirmar`

Confirma um pedido (reduz estoque). **Requer autenticação**.

**Request:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pedido confirmado com sucesso",
  "id_pedido": 1
}
```

**Erros Possíveis:**
- 400: Pedido está vazio
- 400: Estoque insuficiente para algum material
- 400: Pedido já confirmado

---

## 🏭 RETIRADAS

### POST `/api/retirada` (Singular)

Retira um único material do estoque. **Requer autenticação**.

**Request:**
```json
{
  "id_material": 5,
  "quantidade": 50,
  "motivo": "Para produção",
  "observacao": "Linha de produção C"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id_retirada": 10,
  "message": "Retirada realizada com sucesso!"
}
```

**Erros Possíveis:**
- 400: Quantidade deve ser maior que 0
- 404: Material não encontrado
- 400: Estoque insuficiente
- 500: Erro ao processar retirada

---

### POST `/api/retiradas` (Plural/Batch)

Retira múltiplos materiais. **Requer autenticação**.

**Request:**
```json
{
  "materiais": [
    {
      "id_material": 1,
      "quantidade": 100
    },
    {
      "id_material": 3,
      "quantidade": 50
    }
  ],
  "motivo": "Para obra",
  "observacao": "Projeto integração"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "id_retirada": 11,
  "message": "Retirada realizada com sucesso!"
}
```

---

### GET `/api/retiradas`

Lista histórico de retiradas. **Requer autenticação + Admin**.

**Query Parameters:**
- `dataInicio` - Data inicial
- `dataFim` - Data final
- `usuario` - ID do usuário
- `material` - ID do material

**Response (200 OK):**
```json
[
  {
    "id_retirada": 10,
    "data_retirada": "2024-01-20T14:30:00Z",
    "motivo": "Para produção",
    "observacao": "Linha C",
    "usuario": {
      "id_usuario": 1,
      "nome_usuario": "admin"
    },
    "retiradas": [
      {
        "id_material": 5,
        "quantidade": 50,
        "material": {
          "id_material": 5,
          "nome": "Vidro Temperado"
        }
      }
    ]
  }
]
```

---

### GET `/api/retiradas/:id`

Obtem detalhes de uma retirada específica. **Requer autenticação**.

**Response (200 OK):**
```json
{
  "id_retirada": 10,
  "data_retirada": "2024-01-20T14:30:00Z",
  "motivo": "Para produção",
  "observacao": "Linha C",
  "usuario": {
    "id_usuario": 1,
    "nome_usuario": "admin"
  },
  "retiradas": [
    {
      "id_material": 5,
      "quantidade": 50,
      "material": {
        "id_material": 5,
        "nome": "Vidro Temperado",
        "estoque_atual": 150
      }
    }
  ]
}
```

---

## ⚠️ ALERTAS E MONITORAMENTO

### GET `/api/alerts`

Lista alertas de baixo estoque. **Sem autenticação necessária**.

**Response (200 OK):**
```json
[
  {
    "id_material": 1,
    "nome": "Alumínio Perfil 40x40",
    "estoque_atual": 30,
    "estoque_minimo": 100,
    "nivel": "crítico",
    "urgencia": "alta"
  },
  {
    "id_material": 5,
    "nome": "Vidro Temperado",
    "estoque_atual": 75,
    "estoque_minimo": 100,
    "nivel": "baixo",
    "urgencia": "média"
  }
]
```

---

## 🏥 SISTEMA

### GET `/api/modules`

Lista módulos disponíveis do sistema. **Sem autenticação necessária**.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Autenticação",
    "status": "ativo"
  },
  {
    "id": 2,
    "nome": "Materiais",
    "status": "ativo"
  },
  {
    "id": 3,
    "nome": "Pedidos",
    "status": "ativo"
  },
  {
    "id": 4,
    "nome": "Retiradas",
    "status": "ativo"
  }
]
```

---

### GET `/health`

Health check do servidor. **Sem autenticação necessária**.

**Response (200 OK):**
```json
{
  "ok": true
}
```

---

## ⚙️ Padrões de Resposta

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### Erro

```json
{
  "success": false,
  "error": "Descrição do erro",
  "details": "Detalhes adicionais (opcional)"
}
```

---

## 🔐 Headers Padrão

### Request
```
Content-Type: application/json
Authorization: Bearer <accessToken>
```

### Response
```
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

---

## 📊 Códigos HTTP

| Código | Significado |
|--------|---|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Erro na requisição |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

**Versão da documentação:** 1.1  
**Última atualização:** Dezembro 2025
