# 🗺️ MAPA DE FUNCIONALIDADES - FLUXO DE CÓDIGO

**Documentação de Fluxo por Funcionalidade**  
Mostra exatamente qual arquivo é responsável por cada ação

---

## 📍 NAVEGAÇÃO RÁPIDA

1. [🔐 Autenticação e Login](#autenticação-e-login)
2. [👥 Gerenciamento de Usuários](#gerenciamento-de-usuários)
3. [📦 Materiais - CRUD](#materiais---crud)
4. [📊 Importação de Materiais (Excel)](#importação-de-materiais-excel)
5. [📝 Pedidos](#pedidos)
6. [🏭 Retirada de Materiais](#retirada-de-materiais)
7. [📋 Relatórios e Consultas](#relatórios-e-consultas)
8. [⚠️ Alertas de Estoque](#alertas-de-estoque)

---

## 🔐 Autenticação e Login

### Fluxo Completo: Usuário faz Login

```
┌─ FRONTEND: pages/login.tsx
│  ├─ Usuário preenche form (usuario, senha)
│  ├─ Evento onSubmit → fetchAPI para POST /api/auth/login
│  └─ Salva tokens em localStorage
│
├─ BACKEND: POST /api/auth/login
│  ├─ server.js: app.post('/api/auth/login', ...)
│  ├─ Chamada: controllers/auth_controller.js → login()
│  │  ├─ Recebe: { nome_usuario, senha }
│  │  ├─ Query: models/Usuario.findOne({ where: { nome_usuario } })
│  │  ├─ Validação: bcrypt.compare(senha, usuario.senha_hash)
│  │  ├─ Se válido:
│  │  │  ├─ middleware/authMiddleware.js → generateToken()
│  │  │  ├─ Cria JWT com usuário info
│  │  │  └─ Retorna: { accessToken, refreshToken, expiresIn }
│  │  └─ Se inválido: Retorna erro 401
│  └─ Response: JSON com tokens
│
├─ FRONTEND: pages/login.tsx
│  ├─ Recebe tokens na resposta
│  ├─ localStorage.setItem('token', accessToken)
│  ├─ localStorage.setItem('refreshToken', refreshToken)
│  └─ Redireciona para /hub
│
└─ FRONTEND: pages/hub.tsx
   └─ Página carrega com usuário autenticado
```

### Arquivos Envolvidos
- **Frontend:** `pages/login.tsx` (componente de login)
- **Backend:** `server.js` (rota POST /api/auth/login)
- **Backend:** `controllers/auth_controller.js` → `login()` (lógica)
- **Backend:** `models/Usuario.js` (modelo de usuário)
- **Backend:** `middleware/authMiddleware.js` → `generateToken()` (geração JWT)

### Fluxo: Token Expirado → Refresh Token

```
┌─ FRONTEND: utils/fetchAPI.js
│  ├─ Requisição retorna 401 (token expirado)
│  └─ Chama POST /api/auth/refresh com refreshToken
│
├─ BACKEND: POST /api/auth/refresh
│  ├─ server.js: app.post('/api/auth/refresh', ...)
│  ├─ Chamada: controllers/auth_controller.js → refreshToken()
│  │  ├─ Verifica refreshToken validade
│  │  ├─ Se válido:
│  │  │  ├─ Gera novo accessToken
│  │  │  └─ Retorna novo token
│  │  └─ Se inválido: Retorna erro 403
│  └─ Response: { accessToken, expiresIn }
│
└─ FRONTEND: utils/fetchAPI.js
   ├─ localStorage.setItem('token', novoToken)
   └─ Retenta requisição original com novo token
```

---

## 👥 Gerenciamento de Usuários

### Fluxo: Admin Lista Usuários

```
┌─ FRONTEND: pages/cadastro-usuario.tsx
│  ├─ Botão ou carregamento inicial
│  └─ Chama GET /api/usuarios
│
├─ BACKEND: GET /api/usuarios
│  ├─ server.js: app.get('/api/usuarios', verifyToken, requireAdmin, ...)
│  ├─ Middleware: verifyToken valida JWT
│  ├─ Middleware: requireAdmin verifica se é admin
│  ├─ Chamada: controllers/usuario_controller.js → listUsers()
│  │  ├─ models/Usuario.findAll({ attributes: [...] })
│  │  └─ Retorna array de usuários
│  └─ Response: [{ id_usuario, nome_usuario, cargo, ativo, ... }]
│
└─ FRONTEND: pages/cadastro-usuario.tsx
   ├─ Recebe array de usuários
   ├─ Popula tabela
   └─ Exibe lista
```

### Fluxo: Admin Cria Novo Usuário

```
┌─ FRONTEND: pages/cadastro-usuario.tsx
│  ├─ Form com campos: nome_usuario, senha, cargo
│  └─ Botão "Criar Usuário" → POST /api/usuarios
│
├─ BACKEND: POST /api/usuarios
│  ├─ server.js: app.post('/api/usuarios', verifyToken, requireAdmin, ...)
│  ├─ Validação de token e permissão
│  ├─ Chamada: controllers/usuario_controller.js → createUser()
│  │  ├─ Validação: nome_usuario, senha, cargo obrigatórios
│  │  ├─ Check: Usuario.findOne({ where: { nome_usuario } })
│  │  │  └─ Se existe: Retorna erro 400
│  │  ├─ Hash senha: bcrypt.hash(senha, 10)
│  │  ├─ Create: models/Usuario.create({
│  │  │  ├─ nome_usuario,
│  │  │  ├─ senha_hash,
│  │  │  ├─ cargo (administrador/funcionário),
│  │  │  ├─ ativo: true,
│  │  │  └─ timestamps
│  │  │})
│  │  └─ Retorna: { message, usuario }
│  └─ Response: 201 Created
│
└─ FRONTEND: pages/cadastro-usuario.tsx
   ├─ Exibe mensagem de sucesso
   └─ Recarrega lista de usuários
```

### Fluxo: Admin Edita Usuário

```
┌─ FRONTEND: pages/cadastro-usuario.tsx
│  ├─ Click em linha do usuário
│  └─ Modal/Form aparece com dados atuais
│
├─ BACKEND: PUT /api/usuarios/:id
│  ├─ server.js: app.put('/api/usuarios/:id', verifyToken, requireAdmin, ...)
│  ├─ Chamada: controllers/usuario_controller.js → updateUser()
│  │  ├─ Find usuário: Usuario.findOne({ where: { id_usuario } })
│  │  ├─ Se senha foi alterada:
│  │  │  └─ Hash nova senha: bcrypt.hash(novaSenha, 10)
│  │  ├─ Update: usuario.update({ ... })
│  │  └─ Retorna usuário atualizado
│  └─ Response: { message, usuario }
│
└─ FRONTEND: pages/cadastro-usuario.tsx
   ├─ Fecha modal
   └─ Atualiza linha na tabela
```

### Fluxo: Admin Deleta Usuário

```
┌─ FRONTEND: pages/cadastro-usuario.tsx
│  ├─ Botão delete na linha
│  ├─ Confirmação: "Tem certeza?"
│  └─ Se sim: DELETE /api/usuarios/:id
│
├─ BACKEND: DELETE /api/usuarios/:id
│  ├─ server.js: app.delete('/api/usuarios/:id', verifyToken, requireAdmin, ...)
│  ├─ Chamada: controllers/usuario_controller.js → deleteUser()
│  │  ├─ Find usuário: Usuario.findOne({ where: { id_usuario } })
│  │  ├─ Verificação: Não pode deletar a si mesmo
│  │  ├─ Delete: usuario.destroy()
│  │  └─ Retorna: { message }
│  └─ Response: 200 OK
│
└─ FRONTEND: pages/cadastro-usuario.tsx
   ├─ Remove linha da tabela
   └─ Exibe mensagem
```

### Arquivos Envolvidos
- **Frontend:** `pages/cadastro-usuario.tsx`
- **Backend:** `server.js` (rotas CRUD usuarios)
- **Backend:** `controllers/usuario_controller.js` (listUsers, getUser, createUser, updateUser, deleteUser)
- **Backend:** `models/Usuario.js`
- **Backend:** `middleware/authMiddleware.js` (verifyToken, requireAdmin)

---

## 📦 Materiais - CRUD

### Fluxo: Lista de Materiais

```
┌─ FRONTEND: pages/materiais.tsx (ou materiais-admin.tsx)
│  ├─ Carregamento inicial
│  ├─ Usa useEffect para GET /api/materials
│  ├─ Suporta filtros: ?search=termo&categoria=cat&order=nome&sort=ASC
│  └─ Popula tabela
│
├─ BACKEND: GET /api/materials
│  ├─ server.js: app.get('/api/materials', materialController.listMaterials)
│  ├─ Nota: GET é público, não requer auth
│  ├─ Chamada: controllers/material_controller.js → listMaterials()
│  │  ├─ Parâmetros de query: search, categoria, order, sort
│  │  ├─ Build WHERE clause com Op.iLike (case-insensitive)
│  │  ├─ Query: Material.findAll({ where, order, attributes: [...] })
│  │  │  └─ Retorna apenas campos relevantes
│  │  └─ Retorna array de materiais
│  └─ Response: [{ id_material, codigo_material, nome, ... }]
│
└─ FRONTEND: pages/materiais.tsx
   ├─ Recebe array
   ├─ Renderiza tabela
   └─ Permite busca/filtro no client
```

### Fluxo: Obter Um Material

```
┌─ BACKEND: GET /api/materials/:id
│  ├─ server.js: app.get('/api/materials/:id', materialController.getMaterial)
│  ├─ Chamada: controllers/material_controller.js → getMaterial()
│  │  ├─ Material.findByPk(id)
│  │  └─ Retorna material ou erro 404
│  └─ Response: { id_material, nome, ... } ou 404
│
└─ FRONTEND: Usado em pages/retirada/confirmar.tsx
   └─ Carrega info do material selecionado
```

### Fluxo: Admin Cria Material

```
┌─ FRONTEND: pages/materiais-admin.tsx
│  ├─ Botão "Adicionar Material"
│  ├─ Modal/Form com campos:
│  │  ├─ codigo_material
│  │  ├─ nome (obrigatório)
│  │  ├─ descricao
│  │  ├─ categoria
│  │  ├─ unidade_medida
│  │  ├─ estoque_minimo
│  │  └─ estoque_atual
│  └─ Submit → POST /api/materials
│
├─ BACKEND: POST /api/materials
│  ├─ server.js: app.post('/api/materials', verifyToken, requireAdmin, ...)
│  ├─ Validação: Token + Admin
│  ├─ Chamada: controllers/material_controller.js → createMaterial()
│  │  ├─ Validação: nome obrigatório
│  │  ├─ Validação: estoques são números
│  │  ├─ Create: Material.create({
│  │  │  ├─ codigo_material: trim
│  │  │  ├─ nome: trim
│  │  │  ├─ descricao: trim
│  │  │  ├─ categoria: trim
│  │  │  ├─ unidade_medida (default: 'UN')
│  │  │  ├─ estoque_minimo: parseFloat
│  │  │  ├─ estoque_atual: parseFloat
│  │  │  ├─ criado_em: new Date()
│  │  │  └─ atualizado_em: new Date()
│  │  │})
│  │  └─ Retorna material criado
│  └─ Response: 201 Created { id_material, ... }
│
└─ FRONTEND: pages/materiais-admin.tsx
   ├─ Fecha modal
   ├─ Adiciona novo material à tabela
   └─ Exibe sucesso
```

### Fluxo: Admin Edita Material

```
┌─ FRONTEND: pages/materiais-admin.tsx
│  ├─ Click em linha ou botão editar
│  ├─ GET /api/materials/:id (carrega dados atuais)
│  ├─ Modal/Form aparece com valores
│  └─ Alterações → PUT /api/materials/:id
│
├─ BACKEND: PUT /api/materials/:id
│  ├─ server.js: app.put('/api/materials/:id', verifyToken, requireAdmin, ...)
│  ├─ Chamada: controllers/material_controller.js → updateMaterial()
│  │  ├─ Material.findByPk(id)
│  │  ├─ Validações de campos
│  │  ├─ material.update({ ... })
│  │  │  └─ atualizado_em: new Date()
│  │  └─ Retorna material atualizado
│  └─ Response: 200 OK { id_material, ... }
│
└─ FRONTEND: pages/materiais-admin.tsx
   ├─ Fecha modal
   ├─ Atualiza linha na tabela
   └─ Exibe sucesso
```

### Fluxo: Admin Deleta Material

```
┌─ FRONTEND: pages/materiais-admin.tsx
│  ├─ Botão delete na linha
│  ├─ Confirmação: "Tem certeza?"
│  └─ Se sim: DELETE /api/materials/:id
│
├─ BACKEND: DELETE /api/materials/:id
│  ├─ server.js: app.delete('/api/materials/:id', verifyToken, requireAdmin, ...)
│  ├─ Chamada: controllers/material_controller.js → deleteMaterial()
│  │  ├─ Material.findByPk(id)
│  │  ├─ Verificação: Material não está em uso?
│  │  ├─ material.destroy()
│  │  └─ Retorna: { message }
│  └─ Response: 200 OK
│
└─ FRONTEND: pages/materiais-admin.tsx
   ├─ Remove linha
   └─ Exibe sucesso
```

### Arquivos Envolvidos
- **Frontend:** `pages/materiais.tsx` (lista pública) e `pages/materiais-admin.tsx` (CRUD admin)
- **Backend:** `server.js` (rotas CRUD materiais)
- **Backend:** `controllers/material_controller.js` (listMaterials, getMaterial, createMaterial, updateMaterial, deleteMaterial)
- **Backend:** `models/Material.js`
- **Backend:** `middleware/authMiddleware.js` (verifyToken, requireAdmin)

---

## 📊 Importação de Materiais (Excel)

### Fluxo: Importar Excel com Materiais

```
┌─ FRONTEND: pages/materiais-admin.tsx ou pages/pedido.tsx
│  ├─ Botão "Importar Excel"
│  ├─ Input file type=xlsx
│  ├─ Lê arquivo com biblioteca XLSX
│  ├─ Prepara dados em array
│  └─ POST /api/materials/import/excel (multipart/form-data)
│
├─ BACKEND: POST /api/materials/import/excel
│  ├─ server.js: app.post('/api/materials/import/excel', verifyToken, requireAdmin, ...)
│  ├─ Validação: Token + Admin
│  ├─ Chamada: controllers/material_controller.js → importExcel()
│  │  ├─ Recebe arquivo multipart
│  │  ├─ Parse com biblioteca xlsx/multer
│  │  ├─ Validação de colunas obrigatórias:
│  │  │  ├─ Nome
│  │  │  ├─ Codigo
│  │  │  ├─ Categoria
│  │  │  ├─ Estoque Atual
│  │  │  └─ Estoque Mínimo
│  │  ├─ Para cada linha:
│  │  │  ├─ Validação de tipos de dados
│  │  │  ├─ Trim de strings
│  │  │  ├─ ParseFloat de números
│  │  │  ├─ Check duplicatas: codigo_material
│  │  │  ├─ Se válido: Material.create({ ... })
│  │  │  └─ Se inválido: Adiciona erro à lista
│  │  ├─ Compilação de resultados
│  │  └─ Retorna: { sucesso: [...], erros: [...], resumo: { ... } }
│  └─ Response: 200 OK ou 400 Bad Request
│
└─ FRONTEND: pages/materiais-admin.tsx ou pages/pedido.tsx
   ├─ Recebe resposta
   ├─ Mostra resumo: X inseridos, Y erros
   ├─ Se em pedidos: auto-adiciona à lista de itens
   └─ Exibe erros por linha (se houver)
```

### Template Excel
```
Colunas esperadas:
- Nome (obrigatório)
- Codigo (único)
- Descricao
- Categoria
- Unidade (default: UN)
- Estoque_Minimo (número)
- Estoque_Atual (número)
```

### Arquivos Envolvidos
- **Frontend:** `pages/materiais-admin.tsx` (import materiais) e `pages/pedido.tsx` (import itens pedido)
- **Frontend:** Biblioteca `xlsx` para parsing
- **Backend:** `server.js` (rota POST import)
- **Backend:** `controllers/material_controller.js` → `importExcel()` (lógica)
- **Backend:** `models/Material.js`
- **Backend:** Middleware `multer` (para multipart)

---

## 📝 Pedidos

### Fluxo: Usuário Cria Novo Pedido

```
┌─ FRONTEND: pages/pedido.tsx
│  ├─ Página de criar novo pedido
│  ├─ Botão "Novo Pedido"
│  └─ POST /api/pedidos (corpo vazio ou básico)
│
├─ BACKEND: POST /api/pedidos
│  ├─ server.js: app.post('/api/pedidos', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → createPedido()
│  │  ├─ usuario_id = req.user.id_usuario (do token)
│  │  ├─ Gera numero_pedido (auto-increment ou sequencial)
│  │  ├─ Create: Pedido.create({
│  │  │  ├─ numero_pedido
│  │  │  ├─ fk_usuario_id_usuario
│  │  │  ├─ data_pedido: new Date()
│  │  │  ├─ status: 'novo'
│  │  │  └─ observacao: ''
│  │  │})
│  │  └─ Retorna pedido criado
│  └─ Response: 201 Created { id_pedido, numero_pedido, ... }
│
└─ FRONTEND: pages/pedido.tsx
   ├─ Recebe id_pedido
   ├─ Armazena em state
   └─ Pronto para adicionar itens
```

### Fluxo: Adicionar Material ao Pedido

```
┌─ FRONTEND: pages/pedido.tsx
│  ├─ Busca material: GET /api/materials?search=termo
│  ├─ Seleciona material da lista dropdown
│  ├─ Preenche: quantidade, valor_unitario (opcional)
│  └─ Botão "Adicionar Item" → POST /api/pedidos/:id/itens
│
├─ BACKEND: POST /api/pedidos/:id/itens
│  ├─ server.js: app.post('/api/pedidos/:id/itens', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → addItemPedido()
│  │  ├─ Validação: pedido pertence ao usuário (ou admin)
│  │  ├─ Validação: material existe
│  │  ├─ Validação: quantidade > 0
│  │  ├─ Create: ItemPedido.create({
│  │  │  ├─ fk_pedido_id_pedido: id
│  │  │  ├─ fk_material_id_material
│  │  │  ├─ quantidade
│  │  │  ├─ valor_unitario (opcional)
│  │  │  └─ observacao (opcional)
│  │  │})
│  │  └─ Retorna item criado
│  └─ Response: 201 Created { id_item_pedido, ... }
│
└─ FRONTEND: pages/pedido.tsx
   ├─ Adiciona item à tabela de itens
   ├─ Limpa campos de input
   └─ Atualiza total do pedido
```

### Fluxo: Remover Item do Pedido

```
┌─ FRONTEND: pages/pedido.tsx
│  ├─ Botão delete na linha do item
│  ├─ Confirmação: "Remover item?"
│  └─ Se sim: DELETE /api/pedidos/:pedidoId/itens/:itemId
│
├─ BACKEND: DELETE /api/pedidos/:id/itens/:itemId
│  ├─ server.js: app.delete('...', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → removeItemPedido()
│  │  ├─ Validação: item pertence ao pedido
│  │  ├─ ItemPedido.destroy({ where: { id_item_pedido } })
│  │  └─ Retorna: { message }
│  └─ Response: 200 OK
│
└─ FRONTEND: pages/pedido.tsx
   ├─ Remove linha da tabela
   └─ Atualiza total
```

### Fluxo: Confirmar Pedido

```
┌─ FRONTEND: pages/pedido.tsx
│  ├─ Verifica se há itens
│  ├─ Botão "Confirmar Pedido"
│  └─ POST /api/pedidos/:id/confirmar
│
├─ BACKEND: POST /api/pedidos/:id/confirmar
│  ├─ server.js: app.post('/api/pedidos/:id/confirmar', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → confirmPedido()
│  │  ├─ Validação: pedido está em status 'novo'
│  │  ├─ Busca todos os itens: ItemPedido.findAll()
│  │  ├─ Para cada item:
│  │  │  ├─ Validação: estoque suficiente
│  │  │  ├─ Validação: material ainda existe
│  │  │  └─ Prepara decremento de estoque
│  │  ├─ Se tudo ok:
│  │  │  ├─ Update: Pedido.update({ status: 'confirmado' })
│  │  │  ├─ Para cada item:
│  │  │  │  ├─ Material.update({ estoque_atual: estoque - quantidade })
│  │  │  │  └─ ItemPedido.update({ status: 'confirmado' })
│  │  │  └─ Retorna: { message, id_pedido }
│  │  └─ Se erro: Rollback (transação), retorna erro
│  └─ Response: 200 OK ou 400 Bad Request
│
└─ FRONTEND: pages/pedido.tsx
   ├─ Se sucesso: Redireciona para /pedidos (listagem)
   └─ Exibe mensagem de sucesso
```

### Fluxo: Listar Pedidos do Usuário

```
┌─ FRONTEND: pages/pedidos.tsx
│  ├─ Carregamento inicial
│  ├─ GET /api/pedidos (lista do usuário logado)
│  ├─ Suporta filtros: ?status=novo&data_inicio=...&data_fim=...
│  └─ Popula tabela
│
├─ BACKEND: GET /api/pedidos
│  ├─ server.js: app.get('/api/pedidos', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → listPedidos()
│  │  ├─ Se usuário normal: filtro por fk_usuario_id_usuario
│  │  ├─ Se admin: retorna todos
│  │  ├─ Aplica filtros: status, data_inicio, data_fim
│  │  ├─ Pedido.findAll({
│  │  │  ├─ where: { ... },
│  │  │  ├─ order: [['data_pedido', 'DESC']],
│  │  │  └─ include: [{ model: ItemPedido, as: 'itens' }]
│  │  │})
│  │  └─ Retorna pedidos com itens
│  └─ Response: [{ id_pedido, numero_pedido, status, data_pedido, itens: [...] }]
│
└─ FRONTEND: pages/pedidos.tsx
   ├─ Renderiza tabela de pedidos
   └─ Click em linha → abre detalhes
```

### Fluxo: Ver Detalhes de Pedido

```
┌─ FRONTEND: pages/pedidos.tsx ou pages/consultar-pedidos.tsx
│  ├─ Click em linha do pedido
│  └─ GET /api/pedidos/:id
│
├─ BACKEND: GET /api/pedidos/:id
│  ├─ server.js: app.get('/api/pedidos/:id', verifyToken, ...)
│  ├─ Chamada: controllers/pedido_controller.js → getPedido()
│  │  ├─ Validação: usuário é dono ou admin
│  │  ├─ Pedido.findByPk(id, {
│  │  │  ├─ include: [
│  │  │  │  ├─ { model: ItemPedido, as: 'itens', include: [{ model: Material }] },
│  │  │  │  └─ { model: Usuario, as: 'usuario', attributes: [...] }
│  │  │  │]
│  │  │})
│  │  └─ Retorna pedido completo com itens e materiais
│  └─ Response: { id_pedido, itens: [{ id_item_pedido, material: {...}, ... }], ... }
│
└─ FRONTEND: Modal ou página
   ├─ Exibe detalhes do pedido
   ├─ Tabela com todos os itens
   └─ Exibe total e valores
```

### Arquivos Envolvidos
- **Frontend:** `pages/pedido.tsx` (criar/editar), `pages/pedidos.tsx` (listar), `pages/consultar-pedidos.tsx` (histórico)
- **Backend:** `server.js` (rotas pedidos)
- **Backend:** `controllers/pedido_controller.js` (createPedido, addItemPedido, removeItemPedido, confirmPedido, listPedidos, getPedido)
- **Backend:** `models/Pedido.js`, `models/ItemPedido.js`
- **Backend:** `middleware/authMiddleware.js` (verifyToken)

---

## 🏭 Retirada de Materiais

### Fluxo: Listar Materiais Disponíveis para Retirada

```
┌─ FRONTEND: pages/retirada.tsx
│  ├─ Carregamento inicial
│  ├─ GET /api/materials (sem filtro de admin)
│  ├─ Suporta: ?search=termo&categoria=cat
│  └─ Renderiza lista com cards/tabela
│
├─ BACKEND: GET /api/materials
│  ├─ server.js: app.get('/api/materials', materialController.listMaterials)
│  ├─ Chamada: controllers/material_controller.js → listMaterials()
│  │  ├─ Material.findAll({ where: {...}, order: [...] })
│  │  └─ Retorna materiais
│  └─ Response: [{ id_material, nome, categoria, estoque_atual, estoque_minimo, ... }]
│
└─ FRONTEND: pages/retirada.tsx
   ├─ Renderiza lista
   ├─ Exibe ícones de status do estoque (verde/orange/vermelho)
   ├─ Click em material → redireciona para /retirada/confirmar?id=X
   └─ Suporta busca e filtro no client
```

### Fluxo: Confirmar Retirada de Material

```
┌─ FRONTEND: pages/retirada/confirmar.tsx
│  ├─ Carregamento: GET /api/materials/:id
│  ├─ Exibe detalhes do material:
│  │  ├─ Nome, código, categoria, unidade
│  │  ├─ Estoque atual, estoque mínimo
│  │  └─ Indicador visual de disponibilidade
│  ├─ Form com campos:
│  │  ├─ Quantidade (obrigatório, número)
│  │  ├─ Motivo (opcional, string)
│  │  └─ Observação (opcional, string)
│  ├─ Botões: Cancelar, Confirmar
│  └─ Submit → POST /api/retirada
│
├─ BACKEND: POST /api/retirada
│  ├─ server.js: app.post('/api/retirada', verifyToken, ...)
│  ├─ Chamada: controllers/retirada_controller.js → createRetiradaSingle()
│  │  ├─ Recebe: { id_material, quantidade, motivo, observacao }
│  │  ├─ usuario_id = req.user.id_usuario (do token)
│  │  ├─ Validação: id_material obrigatório
│  │  ├─ Validação: quantidade > 0 e é número
│  │  ├─ Fetch: Material.findByPk(id_material)
│  │  │  └─ Se não existe: Retorna 404
│  │  ├─ Validação: estoque_atual >= quantidade
│  │  │  └─ Se insuficiente: Retorna 400
│  │  ├─ Create: Retirada.create({
│  │  │  ├─ fk_usuario_id_usuario: usuario_id,
│  │  │  ├─ data_retirada: new Date(),
│  │  │  ├─ motivo: motivo || '',
│  │  │  └─ observacao: observacao || ''
│  │  │})
│  │  ├─ Create: RetiradaMaterial.create({
│  │  │  ├─ id_retirada: retirada.id_retirada,
│  │  │  ├─ id_material: id_material,
│  │  │  └─ quantidade: quantidade
│  │  │})
│  │  ├─ Update: Material.update({
│  │  │  ├─ estoque_atual: estoque_atual - quantidade,
│  │  │  └─ atualizado_em: new Date()
│  │  │})
│  │  └─ Retorna: { success: true, id_retirada, message: 'Retirada realizada...' }
│  └─ Response: 201 Created ou 400/404/500
│
└─ FRONTEND: pages/retirada/confirmar.tsx
   ├─ Se sucesso:
   │  ├─ Exibe mensagem de sucesso (verde)
   │  ├─ Aguarda 2-3 segundos
   │  └─ Redireciona para /retirada
   └─ Se erro:
      ├─ Exibe mensagem de erro (vermelho)
      └─ Mostra detalhes do erro
```

### Fluxo: Listar Histórico de Retiradas (Admin)

```
┌─ FRONTEND: pages/retirada.tsx (ou página de relatório)
│  ├─ Botão "Histórico" ou seção de histórico
│  └─ GET /api/retiradas (com filtros opcionais)
│
├─ BACKEND: GET /api/retiradas
│  ├─ server.js: app.get('/api/retiradas', verifyToken, requireAdmin, ...)
│  ├─ Validação: Token + Admin
│  ├─ Query params: ?dataInicio=...&dataFim=...&usuario=...&material=...
│  ├─ Chamada: controllers/retirada_controller.js → listRetiradas()
│  │  ├─ Build WHERE com filtros
│  │  ├─ Retirada.findAll({
│  │  │  ├─ where: { ... },
│  │  │  ├─ include: [
│  │  │  │  ├─ { model: RetiradaMaterial, as: 'retiradas', include: [{ model: Material }] },
│  │  │  │  └─ { model: Usuario, as: 'usuario', attributes: [...] }
│  │  │  │],
│  │  │  ├─ order: [['data_retirada', 'DESC']],
│  │  │  └─ limit: 500
│  │  │})
│  │  ├─ Se filtro por material: filtra resultado
│  │  └─ Retorna retiradas com detalhes
│  └─ Response: [{ id_retirada, usuario: {...}, retiradas: [...], data_retirada, ... }]
│
└─ FRONTEND: Página de relatório
   ├─ Renderiza tabela
   ├─ Exibe: data, usuário, material, quantidade
   └─ Suporta exportar (se implementado)
```

### Fluxo: Obter Detalhes de Uma Retirada

```
┌─ BACKEND: GET /api/retiradas/:id
│  ├─ server.js: app.get('/api/retiradas/:id', verifyToken, ...)
│  ├─ Chamada: controllers/retirada_controller.js → getRetirada()
│  │  ├─ Validação: usuário é dono ou admin
│  │  ├─ Retirada.findByPk(id, {
│  │  │  ├─ include: [
│  │  │  │  ├─ { model: RetiradaMaterial, as: 'retiradas', include: [{ model: Material }] },
│  │  │  │  └─ { model: Usuario, as: 'usuario' }
│  │  │  │]
│  │  │})
│  │  └─ Retorna retirada com detalhes completos
│  └─ Response: { id_retirada, usuario: {...}, retiradas: [...], ... }
│
└─ FRONTEND: Modal ou página de detalhes
   └─ Exibe informações completas
```

### Estrutura de Dados

**Retirada (Cabeçalho)**
```javascript
{
  id_retirada: Number,
  fk_usuario_id_usuario: Number,
  data_retirada: Date,
  motivo: String,
  observacao: String,
  criado_em: Date,
  atualizado_em: Date
}
```

**RetiradaMaterial (Itens)**
```javascript
{
  id: Number,
  id_retirada: Number,
  id_material: Number,
  quantidade: Number,
  criado_em: Date,
  atualizado_em: Date
}
```

### Arquivos Envolvidos
- **Frontend:** `pages/retirada.tsx` (lista), `pages/retirada/confirmar.tsx` (confirmação)
- **Backend:** `server.js` (rotas retirada)
- **Backend:** `controllers/retirada_controller.js` (createRetirada, createRetiradaSingle, listRetiradas, getRetirada)
- **Backend:** `models/Retirada.js`, `models/RetiradaMaterial.js`, `models/Material.js`
- **Backend:** `middleware/authMiddleware.js` (verifyToken, requireAdmin)

---

## 📋 Relatórios e Consultas

### Fluxo: Consultar Pedidos (Histórico)

```
┌─ FRONTEND: pages/consultar-pedidos.tsx
│  ├─ Form com filtros:
│  │  ├─ Data inicial/final
│  │  ├─ Usuário
│  │  ├─ Material
│  │  └─ Status
│  ├─ Botão "Buscar"
│  └─ GET /api/pedidos (com query params de filtro)
│
├─ BACKEND: GET /api/pedidos
│  ├─ Controllers retorna com filtros aplicados
│  └─ Response: Array de pedidos
│
└─ FRONTEND: pages/consultar-pedidos.tsx
   ├─ Renderiza tabela com resultados
   └─ Permite exportar/imprimir (se implementado)
```

### Fluxo: Alertas de Estoque

```
┌─ FRONTEND: pages/hub.tsx ou barra lateral
│  └─ GET /api/alerts
│
├─ BACKEND: GET /api/alerts
│  ├─ server.js: app.get('/api/alerts', ...)
│  ├─ Chamada: services/alertService.js → getSystemAlerts()
│  │  ├─ Query: Material.findAll()
│  │  ├─ Para cada material:
│  │  │  └─ Se estoque_atual < estoque_minimo:
│  │  │     └─ Adiciona à lista de alertas
│  │  ├─ Retorna array de alertas
│  │  └─ Inclui: material_id, nome, estoque_atual, estoque_minimo
│  └─ Response: [{ id_material, nome, estoque_atual, estoque_minimo, nivel: 'baixo'|'crítico' }]
│
└─ FRONTEND: pages/hub.tsx
   ├─ Exibe contador de alertas
   ├─ Mostra badge com número de alertas
   └─ Click → mostra lista detalhada
```

### Arquivos Envolvidos
- **Frontend:** `pages/consultar-pedidos.tsx`, `pages/hub.tsx`
- **Backend:** `server.js` (rota GET /api/alerts)
- **Backend:** `controllers/pedido_controller.js`
- **Backend:** `services/alertService.js`
- **Backend:** `models/Material.js`

---

## ⚠️ Alertas de Estoque

### Sistema de Alertas

```
┌─ BACKEND: services/alertService.js
│  ├─ Função: getSystemAlerts()
│  ├─ Busca materiais com estoque baixo:
│  │  ├─ Nível CRÍTICO: estoque < estoque_mínimo / 2
│  │  └─ Nível BAIXO: estoque < estoque_mínimo
│  ├─ Compila alertas com prioridade
│  └─ Retorna: [{ id_material, nome, nivel, urgencia }]
│
├─ FRONTEND: pages/hub.tsx
│  ├─ Carrega alertas ao inicializar
│  ├─ Exibe badge com contador
│  ├─ Cor vermelha para crítico, orange para baixo
│  └─ Click → abre modal com lista
│
└─ FRONTEND: Modal de Alertas
   ├─ Lista materiais com estoque baixo
   ├─ Ícones indicam urgência
   └─ Links para página de materiais ou retirada
```

### Arquivos Envolvidos
- **Frontend:** `pages/hub.tsx`, componentes de alerta
- **Backend:** `services/alertService.js`
- **Backend:** `models/Material.js`

---

## 🔗 Resumo de Dependências Entre Módulos

```
┌─ AUTENTICAÇÃO (gateway)
│  ├─ Requerida por: todos os outros módulos
│  └─ Processa: login, token refresh
│
├─ USUÁRIOS
│  ├─ Depende de: AUTENTICAÇÃO
│  ├─ Requerido por: Pedidos, Retirada (para registrar quem executou)
│  └─ Processa: CRUD de usuários (admin only)
│
├─ MATERIAIS
│  ├─ Depende de: AUTENTICAÇÃO (para admin CRUD)
│  ├─ Requerido por: Pedidos, Retirada
│  └─ Processa: CRUD, importação, listagem
│
├─ PEDIDOS
│  ├─ Depende de: AUTENTICAÇÃO, MATERIAIS, USUÁRIOS
│  ├─ Requerido por: Relatórios
│  └─ Processa: criação, confirmação, itens
│
├─ RETIRADA
│  ├─ Depende de: AUTENTICAÇÃO, MATERIAIS, USUÁRIOS
│  ├─ Requerido por: Relatórios, Alertas
│  └─ Processa: retirada de estoque, validações
│
└─ ALERTAS
   ├─ Depende de: MATERIAIS
   └─ Processa: monitoramento de estoque
```

---

**Versão da documentação:** 1.1  
**Última atualização:** Dezembro 2025
