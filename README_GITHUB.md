# 🚀 Localizator v1.1

**Sistema de Gestão de Estoque e Endereçamento de Materiais**

Projeto Integrador de Engenharia de Software desenvolvido para a **Rissi Fachadas e Esquadrias** - Chapecó, SC

---

## 📋 Sobre o Projeto

Localizator é uma solução web completa para gerenciar e rastrear materiais em estoque, desenvolvida com tecnologias modernas e boas práticas de engenharia de software.

**Objetivo:** Centralizar, organizar e endereçar corretamente todos os materiais em estoque, eliminando planilhas dispersas e garantindo um fluxo logístico ágil, preciso e rastreável.

---

## 🎯 Funcionalidades

✅ **Autenticação JWT** com refresh tokens  
✅ **CRUD de Materiais** com importação Excel  
✅ **Sistema de Pedidos** com confirmação  
✅ **Retirada de Materiais** simples e em lote  
✅ **Alertas de Estoque Baixo**  
✅ **Relatórios e Consultas**  
✅ **Gerenciamento de Usuários** (Admin)  
✅ **Interface Responsiva**  

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 13.5** - Framework React
- **TypeScript** - Type safety
- **React 18** - UI library
- **date-fns** - Date utilities
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Autenticação

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| **Telas** | 11 páginas |
| **CRUDs** | 5 módulos |
| **Endpoints API** | 40+ rotas |
| **Tabelas BD** | 6 tabelas |
| **Linhas de Código** | 12.207 |
| **Linhas de Documentação** | 6.329 |
| **Casos de Teste** | 80+ |

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação Backend
```bash
cd backend
npm install
npm start
```

Backend rodará em: `http://localhost:3001`

### Instalação Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend rodará em: `http://localhost:3000`

---

## 🔐 Credenciais de Demo

| Usuário | Senha | Permissão |
|---------|-------|-----------|
| admin | admin123 | Todas (Admin) |
| funcionario1 | 123456 | Consulta/Retirada |
| funcionario2 | 123456 | Consulta/Retirada |

---

## 📚 Documentação

Documentação completa e organizada está em `/DOCUMENTACAO`:

- **INDICE_PRINCIPAL.md** - Índice navegável
- **FASES_E_ATUALIZACOES.md** - Histórico de implementação
- **MAPA_FUNCIONALIDADES.md** - Código para funcionalidade mapping
- **ARQUITETURA_COMPLETA.md** - Arquitetura técnica
- **API_ENDPOINTS.md** - Referência de API (40+ endpoints)
- **MODELO_DADOS.md** - Schema do banco de dados
- **GUIA_TESTE_COMPLETO.md** - 80+ casos de teste
- **CREDENCIAIS_ACESSO.md** - Guia de acesso
- **ESTATISTICAS_PROJETO.md** - Métricas do projeto

---

## 📁 Estrutura do Projeto

```
localizator/
├── backend/              # API Node.js/Express
│   ├── controllers/      # 5 controllers (auth, usuario, material, retirada, module)
│   ├── models/           # Modelos Sequelize (6 models)
│   ├── middleware/       # Autenticação e autorização
│   ├── services/         # Serviços (alertas, etc)
│   └── server.js         # Servidor principal
│
├── frontend/             # App Next.js/React
│   ├── pages/            # 11 páginas (telas)
│   ├── components/       # ~40 componentes UI
│   └── styles/           # Estilos globais
│
├── database/             # Scripts SQL e inicialização
│
├── DOCUMENTACAO/         # 15+ documentos profissionais
│   ├── 01-Comece_Aqui/          (4 docs)
│   ├── 02-Entenda_o_Sistema/    (2 docs)
│   ├── 03-Teste_o_Sistema/      (2 docs)
│   ├── 04-Referencia_e_Navega/  (2 docs)
│   └── Raiz                      (5 docs)
│
└── README.md             # Este arquivo
```

---

## 🧪 Testes

Documentação completa de testes disponível em:
`DOCUMENTACAO/03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md`

Inclui:
- ✅ 4 testes de autenticação
- ✅ 4 testes de usuários
- ✅ 7 testes de materiais
- ✅ 8 testes de pedidos
- ✅ 6 testes de retirada
- ✅ 2 testes de alertas
- ✅ 2 testes de fluxo integrado
- ✅ E muito mais...

---

## 🔄 Fases de Desenvolvimento

### Fase 1: Novembro 2025
- Autenticação JWT com refresh tokens
- Base de estrutura (frontend + backend)

### Fase 2: Novembro 2025
- CRUD de Materiais
- Importação Excel

### Fase 3: Novembro 2025
- Sistema de Pedidos
- Confirmação de pedidos

### Fase 4: Dezembro 2025
- Retirada de Materiais (simples + batch)
- Histórico de retiradas

### Fase 5: Dezembro 2025
- Refinamentos
- Otimizações

### Fase 6: Dezembro 2025
- Documentação profissional (15+ docs)
- Testes abrangentes (80+ casos)

---

## 🔗 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Materiais
- `GET /api/materiais` - Listar materiais
- `POST /api/materiais` - Criar material
- `PUT /api/materiais/:id` - Atualizar material
- `DELETE /api/materiais/:id` - Deletar material
- `POST /api/materiais/import/excel` - Importar Excel

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Criar pedido
- `PUT /api/pedidos/:id` - Atualizar pedido
- `PUT /api/pedidos/:id/confirmar` - Confirmar pedido

### Retiradas
- `POST /api/retirada` - Criar retirada
- `POST /api/retirada/batch` - Retirada em lote
- `GET /api/retirada` - Listar retiradas
- `GET /api/retirada/historico/:usuario` - Histórico por usuário

---

## 📊 Banco de Dados

Tabelas principais:
- **usuario** - Usuários do sistema (3 padrão)
- **material** - Catálogo de materiais (8 padrão)
- **pedido** - Pedidos de materiais
- **item_pedido** - Itens de cada pedido
- **retirada** - Registros de retirada
- **retirada_material** - Itens retirados

---

## 👤 Autor

**Eduardo** - Desenvolvedor Full Stack  
Email: eduardo.bud.oli@gmail.com  
Período: Novembro - Dezembro 2025

---

## 📝 Licença

Este projeto é proprietário da Rissi Fachadas e Esquadrias.

---

## 🤝 Contribuições

Para questões, sugestões ou contribuições, entre em contato através dos canais oficiais da Rissi.

---

## ✨ Status

✅ **v1.1 - COMPLETO E DOCUMENTADO**

- ✅ Todas as funcionalidades implementadas
- ✅ Documentação profissional (15+ documentos)
- ✅ Testes abrangentes (80+ casos)
- ✅ Pronto para produção
- ✅ Interface responsiva
- ✅ API completa (40+ endpoints)

---

**Última atualização:** Dezembro 2025  
**Repositório criado:** Dezembro 2025  
**Projeto desenvolvido em:** Novembro - Dezembro 2025
