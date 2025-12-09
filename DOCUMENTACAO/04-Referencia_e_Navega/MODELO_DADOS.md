# 🗄️ MODELO DE DADOS - SCHEMA DO BANCO

**Documentação completa do Banco de Dados SQLite**

---

## 📊 Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────┐
│    USUARIO      │
├─────────────────┤
│ id_usuario (PK) │
│ nome_usuario    │
│ senha_hash      │
│ cargo           │
│ ativo           │
│ criado_em       │
│ atualizado_em   │
└────────┬────────┘
         │ 1
         │ Cria
         │ N
    ┌────┴─────────────────┐
    │                      │
    │ (N)                  │ (N)
┌───┴──────────┐   ┌──────┴───────┐
│   PEDIDO     │   │   RETIRADA   │
├──────────────┤   ├──────────────┤
│ id_pedido(PK)│   │ id_retirada  │
│ numero_ped.  │   │ data_retirada│
│ data_pedido  │   │ motivo       │
│ status       │   │ observacao   │
└───┬──────────┘   └──────┬───────┘
    │ 1                   │ 1
    │ Contém              │ Contém
    │ N                   │ N
    │                     │
┌───┴──────────────┐  ┌───┴──────────────┐
│  ITEMPEDIDO      │  │ RETIRADOMATERIAL │
├──────────────────┤  ├──────────────────┤
│ id_item_pedido   │  │ id               │
│ fk_pedido_id     │  │ id_retirada      │
│ fk_material_id   │  │ id_material      │
│ quantidade       │  │ quantidade       │
│ valor_unitario   │  └──────┬───────────┘
│ observacao       │         │
└────────┬─────────┘         │
         │ N                 │ N
         │ Referencia        │ Referencia
         │ 1                 │ 1
    ┌────┴───────────────────┴──────┐
    │                               │
    │       MATERIAL (1)            │
    │       ├─ id_material (PK)     │
    │       ├─ codigo_material      │
    │       ├─ nome                 │
    │       ├─ descricao            │
    │       ├─ categoria            │
    │       ├─ unidade_medida       │
    │       ├─ estoque_minimo       │
    │       ├─ estoque_atual        │
    │       ├─ criado_em            │
    │       └─ atualizado_em        │
    │                               │
    └───────────────────────────────┘
```

---

## 📋 Tabelas

### 1. USUARIO

**Armazena informações de usuários do sistema.**

```sql
CREATE TABLE Usuario (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_usuario VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo VARCHAR(50) NOT NULL,
  ativo BOOLEAN DEFAULT 1,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id_usuario` | INTEGER | PK, AI | ID único do usuário |
| `nome_usuario` | VARCHAR(255) | UNIQUE, NOT NULL | Identificação única (login) |
| `senha_hash` | VARCHAR(255) | NOT NULL | Senha hasheada com bcrypt |
| `cargo` | VARCHAR(50) | NOT NULL | 'administrador' ou 'funcionário' |
| `ativo` | BOOLEAN | DEFAULT 1 | Status de atividade (1=ativo, 0=inativo) |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data última atualização |

**Índices:**
- PK: `id_usuario`
- UNIQUE: `nome_usuario`

**Relacionamentos:**
- 1 → N com `Pedido` (um usuário cria muitos pedidos)
- 1 → N com `Retirada` (um usuário faz muitas retiradas)

**Dados Padrão:**
```sql
INSERT INTO Usuario (nome_usuario, senha_hash, cargo, ativo)
VALUES 
  ('admin', '$2b$10$...', 'administrador', 1),
  ('funcionario1', '$2b$10$...', 'funcionário', 1),
  ('funcionario2', '$2b$10$...', 'funcionário', 1);
```

---

### 2. MATERIAL

**Catálogo de materiais disponíveis.**

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

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id_material` | INTEGER | PK, AI | ID único do material |
| `codigo_material` | VARCHAR(255) | NOT NULL | Código de identificação (não é único - pode repetir) |
| `nome` | VARCHAR(255) | NOT NULL | Nome descritivo |
| `descricao` | TEXT | - | Descrição detalhada |
| `categoria` | VARCHAR(100) | - | Categorização (Alumínio, Vidro, ACM, etc) |
| `unidade_medida` | VARCHAR(20) | DEFAULT 'UN' | Unidade (UN, metro, m², kg, etc) |
| `estoque_minimo` | DECIMAL(10,2) | DEFAULT 0 | Quantidade mínima para alerta |
| `estoque_atual` | DECIMAL(10,2) | DEFAULT 0 | Quantidade em estoque |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data última atualização |

**Índices:**
- PK: `id_material`
- Índice em: `codigo_material` (para busca rápida)
- Índice em: `categoria` (para filtros)

**Relacionamentos:**
- 1 → N com `ItemPedido` (um material pode ter muitos itens em pedidos)
- 1 → N com `RetiradaMaterial` (um material pode ter múltiplas retiradas)

**Exemplo de Dados:**
```sql
INSERT INTO Material 
(codigo_material, nome, descricao, categoria, unidade_medida, estoque_minimo, estoque_atual)
VALUES 
  ('ALU-001', 'Alumínio Perfil 40x40', 'Perfil quadrado', 'Alumínio', 'metro', 100, 500),
  ('VID-001', 'Vidro Temperado 8mm', 'Vidro temperado', 'Vidro', 'm²', 50, 200),
  ('ACM-001', 'ACM Branco 3mm', 'Revestimento ACM', 'ACM', 'm²', 30, 150);
```

---

### 3. PEDIDO

**Cabeçalho de pedidos criados pelos usuários.**

```sql
CREATE TABLE Pedido (
  id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  numero_pedido VARCHAR(255) UNIQUE NOT NULL,
  fk_usuario_id_usuario INTEGER NOT NULL,
  data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'novo',
  observacao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_usuario_id_usuario) REFERENCES Usuario(id_usuario)
);
```

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id_pedido` | INTEGER | PK, AI | ID único do pedido |
| `numero_pedido` | VARCHAR(255) | UNIQUE, NOT NULL | Número sequencial (ex: PED-001) |
| `fk_usuario_id_usuario` | INTEGER | FK, NOT NULL | Referência ao usuário que criou |
| `data_pedido` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `status` | VARCHAR(50) | DEFAULT 'novo' | Status: 'novo', 'confirmado', 'cancelado' |
| `observacao` | TEXT | - | Notas adicionais |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp de criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- PK: `id_pedido`
- UNIQUE: `numero_pedido`
- FK: `fk_usuario_id_usuario`
- Índice em: `status` (para filtros)
- Índice em: `data_pedido` (para filtros)

**Estados Possíveis:**
```
novo → confirmado → entregue (não obrigatório registrar)
   ↘ cancelado (em qualquer momento)
```

**Relacionamentos:**
- N → 1 com `Usuario` (muitos pedidos de um usuário)
- 1 → N com `ItemPedido` (um pedido tem muitos itens)

**Exemplo:**
```sql
INSERT INTO Pedido (numero_pedido, fk_usuario_id_usuario, observacao, status)
VALUES ('PED-001', 1, 'Urgente', 'novo');
```

---

### 4. ITEMPEDIDO

**Itens individuais dentro de um pedido.**

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

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id_item_pedido` | INTEGER | PK, AI | ID único do item |
| `fk_pedido_id_pedido` | INTEGER | FK, NOT NULL | Referência ao pedido |
| `fk_material_id_material` | INTEGER | FK, NOT NULL | Referência ao material |
| `quantidade` | DECIMAL(10,2) | NOT NULL | Quantidade solicitada |
| `valor_unitario` | DECIMAL(15,2) | - | Preço unitário (opcional) |
| `observacao` | TEXT | - | Notas específicas do item |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- PK: `id_item_pedido`
- FK: `fk_pedido_id_pedido`
- FK: `fk_material_id_material`

**Relacionamentos:**
- N → 1 com `Pedido`
- N → 1 com `Material`

**Exemplo:**
```sql
INSERT INTO ItemPedido 
(fk_pedido_id_pedido, fk_material_id_material, quantidade, valor_unitario)
VALUES (1, 1, 100, 50.00);
```

---

### 5. RETIRADA

**Cabeçalho de retiradas de materiais do estoque.**

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

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id_retirada` | INTEGER | PK, AI | ID único da retirada |
| `fk_usuario_id_usuario` | INTEGER | FK, NOT NULL | Usuário que fez a retirada |
| `data_retirada` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Data/hora da retirada |
| `motivo` | VARCHAR(255) | - | Motivo da retirada (ex: "Para produção") |
| `observacao` | TEXT | - | Notas adicionais |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- PK: `id_retirada`
- FK: `fk_usuario_id_usuario`
- Índice em: `data_retirada` (para filtros)

**Relacionamentos:**
- N → 1 com `Usuario`
- 1 → N com `RetiradaMaterial` (uma retirada pode ter múltiplos materiais)

**Exemplo:**
```sql
INSERT INTO Retirada 
(fk_usuario_id_usuario, motivo, observacao)
VALUES (1, 'Para produção', 'Linha de produção C');
```

---

### 6. RETIRADOMATERIAL

**Itens de materiais dentro de uma retirada.**

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

**Campos:**
| Campo | Tipo | Constraints | Descrição |
|-------|------|---|---|
| `id` | INTEGER | PK, AI | ID único do registro |
| `fk_retiradas_id_retirada` | INTEGER | FK, NOT NULL | Referência à retirada |
| `fk_material_id_material` | INTEGER | FK, NOT NULL | Referência ao material |
| `id_material` | INTEGER | - | Duplicação de id (campo redundante) |
| `quantidade` | DECIMAL(10,2) | NOT NULL | Quantidade retirada |
| `criado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp criação |
| `atualizado_em` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp atualização |

**Índices:**
- PK: `id`
- FK: `fk_retiradas_id_retirada`
- FK: `fk_material_id_material`

**Relacionamentos:**
- N → 1 com `Retirada`
- N → 1 com `Material`

**Exemplo:**
```sql
INSERT INTO RetiradaMaterial 
(fk_retiradas_id_retirada, fk_material_id_material, quantidade)
VALUES (1, 1, 50);
```

---

## 🔗 Relacionamentos

### 1. Usuario → Pedido (1:N)

**Um usuário pode criar múltiplos pedidos.**

```
Usuario.id_usuario (1) ← FK ← Pedido.fk_usuario_id_usuario (N)
```

**Integridade:** DELETE Usuario deve tratar pedidos orfãos

---

### 2. Usuario → Retirada (1:N)

**Um usuário pode fazer múltiplas retiradas.**

```
Usuario.id_usuario (1) ← FK ← Retirada.fk_usuario_id_usuario (N)
```

---

### 3. Pedido → ItemPedido (1:N)

**Um pedido contém múltiplos itens.**

```
Pedido.id_pedido (1) ← FK ← ItemPedido.fk_pedido_id_pedido (N)
```

**Cascade Delete:** Deletar pedido deleta seus itens

---

### 4. Material → ItemPedido (1:N)

**Um material pode estar em múltiplos itens de pedidos.**

```
Material.id_material (1) ← FK ← ItemPedido.fk_material_id_material (N)
```

---

### 5. Material → RetiradaMaterial (1:N)

**Um material pode ter múltiplas retiradas registradas.**

```
Material.id_material (1) ← FK ← RetiradaMaterial.fk_material_id_material (N)
```

---

### 6. Retirada → RetiradaMaterial (1:N)

**Uma retirada pode conter múltiplos materiais.**

```
Retirada.id_retirada (1) ← FK ← RetiradaMaterial.fk_retiradas_id_retirada (N)
```

---

## 📊 Integridade de Dados

### Constraints

**Primary Key:**
- Cada tabela tem PK (id_campo)

**Foreign Key:**
- ItemPedido → Pedido, Material
- Pedido → Usuario
- Retirada → Usuario
- RetiradaMaterial → Retirada, Material

**Unique:**
- Usuario.nome_usuario
- Pedido.numero_pedido

**Not Null:**
- Usuario: nome_usuario, senha_hash, cargo
- Material: nome, codigo_material
- Pedido: numero_pedido, fk_usuario_id_usuario
- ItemPedido: fk_pedido_id_pedido, fk_material_id_material, quantidade
- Retirada: fk_usuario_id_usuario
- RetiradaMaterial: fk_retiradas_id_retirada, fk_material_id_material, quantidade

**Default Values:**
- Usuario.ativo = 1
- Usuario.criado_em = CURRENT_TIMESTAMP
- Material.unidade_medida = 'UN'
- Material.estoque_minimo = 0
- Material.estoque_atual = 0
- Pedido.status = 'novo'
- Pedido.data_pedido = CURRENT_TIMESTAMP
- Retirada.data_retirada = CURRENT_TIMESTAMP

---

## 🔐 Operações de Banco

### Criar Pedido (TRANSACTION)

```sql
BEGIN TRANSACTION;

-- 1. Criar pedido
INSERT INTO Pedido (numero_pedido, fk_usuario_id_usuario, status)
VALUES ('PED-001', 1, 'novo');

-- 2. Adicionar itens
INSERT INTO ItemPedido (fk_pedido_id_pedido, fk_material_id_material, quantidade)
VALUES (LAST_INSERT_ID(), 1, 100);

COMMIT;
```

### Confirmar Pedido (TRANSACTION)

```sql
BEGIN TRANSACTION;

-- 1. Validar estoque
SELECT estoque_atual FROM Material WHERE id_material = 1;

-- 2. Atualizar pedido
UPDATE Pedido SET status = 'confirmado' WHERE id_pedido = 1;

-- 3. Decrementar estoque
UPDATE Material SET estoque_atual = estoque_atual - 100 WHERE id_material = 1;

COMMIT;
```

### Fazer Retirada (TRANSACTION)

```sql
BEGIN TRANSACTION;

-- 1. Criar retirada
INSERT INTO Retirada (fk_usuario_id_usuario, motivo)
VALUES (1, 'Para produção');

-- 2. Registrar material retirado
INSERT INTO RetiradaMaterial (fk_retiradas_id_retirada, fk_material_id_material, quantidade)
VALUES (LAST_INSERT_ID(), 1, 50);

-- 3. Atualizar estoque
UPDATE Material SET estoque_atual = estoque_atual - 50 WHERE id_material = 1;

COMMIT;
```

---

## 📈 Queries Comuns

### Listar materiais com baixo estoque

```sql
SELECT * FROM Material 
WHERE estoque_atual < estoque_minimo 
ORDER BY estoque_atual ASC;
```

### Histório de retiradas por usuário

```sql
SELECT r.*, rm.* 
FROM Retirada r
LEFT JOIN RetiradaMaterial rm ON r.id_retirada = rm.fk_retiradas_id_retirada
WHERE r.fk_usuario_id_usuario = 1
ORDER BY r.data_retirada DESC;
```

### Detalhes completos de um pedido

```sql
SELECT p.*, u.nome_usuario, ip.*, m.nome, m.estoque_atual
FROM Pedido p
JOIN Usuario u ON p.fk_usuario_id_usuario = u.id_usuario
LEFT JOIN ItemPedido ip ON p.id_pedido = ip.fk_pedido_id_pedido
LEFT JOIN Material m ON ip.fk_material_id_material = m.id_material
WHERE p.id_pedido = 1;
```

### Estoque por categoria

```sql
SELECT categoria, SUM(estoque_atual) as total_estoque
FROM Material
GROUP BY categoria;
```

---

## 🔄 Manutenção de Dados

### Backup

```bash
sqlite3 database.sqlite ".backup backup.db"
```

### Restaurar

```bash
sqlite3 database.sqlite ".restore backup.db"
```

### Exportar SQL

```bash
sqlite3 database.sqlite ".dump" > dump.sql
```

---

**Versão da documentação:** 1.1  
**Última atualização:** Dezembro 2025
