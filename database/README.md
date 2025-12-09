# 🗄️ Banco de Dados

## Arquivos

- **database.sqlite** - Arquivo principal de banco de dados SQLite
- **banco_integrador.sql** - Script de integração do banco
- **seed_data.sql** - Dados iniciais para populate do banco
- **seed_materiais.sql** - Materiais iniciais
- **debug.log** - Logs de debug (gerado automaticamente)

## Inicializar o Banco

Para configurar o banco pela primeira vez, execute no backend:

```bash
node setup_db.js
node seed-materiais.js
node seed-usuarios.js
```

## Estrutura de Tabelas

### usuario
- id_usuario (PK)
- nome_usuario
- senha (hash)
- cargo (administrador/funcionário)
- ativo
- criado_em

### material
- id_material (PK)
- nome
- categoria
- descricao
- unidade_medida
- estoque_atual
- estoque_minimo

### pedido
- id_pedido (PK)
- usuario_responsavel
- data_pedido
- status

## Dados de Teste

**Usuário padrão:**
- Username: `admin`
- Password: `123456`
- Role: administrador

**Materiais:** 8 itens de teste pré-configurados
