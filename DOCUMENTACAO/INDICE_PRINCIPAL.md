# 📚 Localizator - Índice Principal de Documentação

**Sistema de Gestão de Estoque e Endereçamento de Materiais**  
**Cliente:** Rissi Fachadas e Esquadrias  
**Versão:** 1.1  
**Status:** ✅ Ativo e em Desenvolvimento

---

## 📖 Como Usar Esta Documentação

Esta documentação está organizada em seções temáticas para facilitar a navegação:

1. **[01-Comece_Aqui/](01-Comece_Aqui/)** - Setup e primeiros passos
2. **[02-Entenda_o_Sistema/](02-Entenda_o_Sistema/)** - Arquitetura e design
3. **[03-Teste_o_Sistema/](03-Teste_o_Sistema/)** - Guias de teste
4. **[04-Referencia_e_Navega/](04-Referencia_e_Navega/)** - Documentação técnica
5. **[FASES_E_ATUALIZACOES.md](FASES_E_ATUALIZACOES.md)** - Histórico de implementações
6. **[MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md)** - Fluxo de código por funcionalidade

---

## 🗺️ Navegação Rápida

### 🚀 Para Começar (Primeiros Passos)
- [01-Comece_Aqui/COMECE_AQUI.md](01-Comece_Aqui/COMECE_AQUI.md) - Visão geral do projeto e setup
- [01-Comece_Aqui/RESUMO_VISUAL.md](01-Comece_Aqui/RESUMO_VISUAL.md) - Interface visual do sistema

### 🏗️ Para Entender a Arquitetura
- [02-Entenda_o_Sistema/ARQUITETURA_COMPLETA.md](02-Entenda_o_Sistema/ARQUITETURA_COMPLETA.md) - Stack técnico e estrutura
- [MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md) - Fluxo detalhado de cada funcionalidade
- [02-Entenda_o_Sistema/SEGURANCA.md](02-Entenda_o_Sistema/SEGURANCA.md) - Autenticação e autorização

### 🧪 Para Testar
- [03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md) - Cenários de teste
- [03-Teste_o_Sistema/CREDENCIAIS_ACESSO.md](03-Teste_o_Sistema/CREDENCIAIS_ACESSO.md) - Usuários para teste

### 📚 Referência Técnica
- [04-Referencia_e_Navega/API_ENDPOINTS.md](04-Referencia_e_Navega/API_ENDPOINTS.md) - Rotas e endpoints
- [04-Referencia_e_Navega/MODELO_DADOS.md](04-Referencia_e_Navega/MODELO_DADOS.md) - Schema do banco de dados
- [04-Referencia_e_Navega/GUIA_DESENVOLVIMENTO.md](04-Referencia_e_Navega/GUIA_DESENVOLVIMENTO.md) - Padrões de código

### 📋 Histórico e Evolução
- [FASES_E_ATUALIZACOES.md](FASES_E_ATUALIZACOES.md) - Todas as fases implementadas

---

## ✨ Funcionalidades Principais

```
┌─ Autenticação e Usuários
│  ├─ Login com JWT
│  ├─ Gerenciamento de usuários (Admin)
│  ├─ Controle de permissões
│  └─ Tokens com refresh
│
├─ Gestão de Materiais
│  ├─ CRUD completo (Admin)
│  ├─ Importação em lote (Excel)
│  ├─ Busca e filtros
│  ├─ Categorização
│  └─ Controle de estoque
│
├─ Pedidos
│  ├─ Criação de pedidos
│  ├─ Adição de materiais
│  ├─ Confirmação de pedidos
│  ├─ Histórico de pedidos
│  └─ Relatórios
│
├─ Retirada de Materiais
│  ├─ Retirada de estoque
│  ├─ Validação de disponibilidade
│  ├─ Registro de motivo/observação
│  └─ Histórico de retiradas
│
└─ Alertas e Monitoramento
   ├─ Alertas de baixo estoque
   ├─ Notificações do sistema
   └─ Logs de auditoria
```

---

## 🎯 Quick Start (5 Minutos)

```bash
# 1. Setup Banco de Dados
cd backend
npm install
node setup-database.js

# 2. Iniciar Backend
npm start

# 3. Em outro terminal, iniciar Frontend
cd frontend
npm install
npm run dev

# 4. Acessar no navegador
http://localhost:3000

# 5. Login com credenciais padrão
Usuário: admin
Senha: admin123
```

---

## 📊 Estrutura de Pastas

```
projeto rissi - vs1/
├── DOCUMENTACAO/                    ← Você está aqui
│   ├── 01-Comece_Aqui/
│   ├── 02-Entenda_o_Sistema/
│   ├── 03-Teste_o_Sistema/
│   ├── 04-Referencia_e_Navega/
│   ├── INDICE_PRINCIPAL.md         ← Este arquivo
│   ├── FASES_E_ATUALIZACOES.md    ← Histórico completo
│   └── MAPA_FUNCIONALIDADES.md    ← Fluxo de código
│
├── backend/                         # API Node.js/Express
│   ├── controllers/                # Lógica de negócio
│   ├── models/                     # Modelos Sequelize
│   ├── middleware/                 # Autenticação, validação
│   ├── services/                   # Serviços auxiliares
│   ├── repositories/               # Acesso a dados
│   └── server.js                   # Arquivo principal
│
├── frontend/                        # Next.js/React
│   ├── pages/                      # Páginas da aplicação
│   ├── components/                 # Componentes reutilizáveis
│   └── utils/                      # Funções auxiliares
│
├── database/                        # Arquivos de banco
│   ├── database.sqlite             # Banco SQLite
│   └── banco_integrador.sql        # Schema SQL
│
└── README.md                        # README principal
```

---

## 🔗 Referência Cruzada

### Por Funcionalidade

| Funcionalidade | Documentação | Frontend | Backend | Testes |
|---|---|---|---|---|
| **Login** | [SEGURANCA.md](02-Entenda_o_Sistema/SEGURANCA.md) | pages/login.tsx | controllers/auth_controller.js | [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md) |
| **Materiais** | [MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md#materiais) | pages/materiais.tsx | controllers/material_controller.js | [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md#teste-materiais) |
| **Pedidos** | [MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md#pedidos) | pages/pedido.tsx | models/Pedido.js | [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md#teste-pedidos) |
| **Retirada** | [MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md#retirada) | pages/retirada.tsx | controllers/retirada_controller.js | [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md#teste-retirada) |
| **Usuários** | [SEGURANCA.md](02-Entenda_o_Sistema/SEGURANCA.md#usuarios) | pages/cadastro-usuario.tsx | controllers/usuario_controller.js | [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md#teste-usuarios) |

---

## 📞 Suporte

Para dúvidas sobre partes específicas:

- **Problemas de instalação?** → [COMECE_AQUI.md](01-Comece_Aqui/COMECE_AQUI.md)
- **Entender o fluxo de uma funcionalidade?** → [MAPA_FUNCIONALIDADES.md](MAPA_FUNCIONALIDADES.md)
- **Problemas de autenticação?** → [SEGURANCA.md](02-Entenda_o_Sistema/SEGURANCA.md)
- **Testar o sistema?** → [GUIA_TESTE_COMPLETO.md](03-Teste_o_Sistema/GUIA_TESTE_COMPLETO.md)
- **Consultar API?** → [API_ENDPOINTS.md](04-Referencia_e_Navega/API_ENDPOINTS.md)

---

**Última atualização:** Dezembro 2025  
**Versão da documentação:** 1.1
