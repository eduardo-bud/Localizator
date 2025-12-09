# 🧪 GUIA DE TESTE COMPLETO

**Teste Manual de Todas as Funcionalidades do Sistema**

---

## 🎯 Objetivo

Este guia fornece cenários de teste para validar todas as funcionalidades do sistema Localizator.

---

## ✅ Pré-requisitos

- Backend rodando em `http://localhost:3001`
- Frontend rodando em `http://localhost:3000`
- Banco de dados inicializado (execute `node setup-database.js`)
- Navegador moderno (Chrome, Firefox, Edge)

---

## 🔐 TESTE 1: AUTENTICAÇÃO

### Teste 1.1: Login com Credenciais Válidas

**Passos:**
1. Acessa `http://localhost:3000`
2. Preenche `nome_usuario: admin`
3. Preenche `senha: admin123`
4. Clica em "Entrar"

**Resultado Esperado:**
- ✅ Redireciona para `/hub`
- ✅ Exibe "Olá, admin"
- ✅ Menu com opções disponível

**Validação Técnica:**
- Token JWT armazenado em localStorage
- Token enviado em requisições subsequentes

---

### Teste 1.2: Login com Senha Incorreta

**Passos:**
1. Acessa `http://localhost:3000`
2. Preenche `nome_usuario: admin`
3. Preenche `senha: senhaErrada`
4. Clica em "Entrar"

**Resultado Esperado:**
- ✅ Mensagem de erro exibida
- ✅ Permanece em `/login`
- ❌ Não redireciona para hub

---

### Teste 1.3: Login com Usuário Inexistente

**Passos:**
1. Preenche `nome_usuario: usuarioInexistente`
2. Preenche `senha: 123456`
3. Clica em "Entrar"

**Resultado Esperado:**
- ✅ Mensagem "Usuário não encontrado"
- ✅ Permanece em página de login

---

### Teste 1.4: Logout

**Passos:**
1. Loga como admin
2. Encontra botão de logout
3. Clica em logout

**Resultado Esperado:**
- ✅ Token removido de localStorage
- ✅ Redireciona para `/login`

---

## 👥 TESTE 2: GERENCIAMENTO DE USUÁRIOS (ADMIN ONLY)

### Teste 2.1: Listar Usuários

**Passos:**
1. Loga como `admin`
2. Acessa "Cadastro de Usuários"
3. Verifica tabela de usuários

**Resultado Esperado:**
- ✅ Exibe 3 usuários padrão (admin, funcionario1, funcionario2)
- ✅ Mostra colunas: nome_usuario, cargo, ativo
- ✅ Botões de editar/deletar visíveis

---

### Teste 2.2: Criar Novo Usuário

**Passos:**
1. Admin acessa "Cadastro de Usuários"
2. Clica em "Novo Usuário" ou "Adicionar"
3. Preenche:
   - nome_usuario: `testador`
   - senha: `senha123`
   - cargo: `funcionário`
4. Clica em "Salvar"

**Resultado Esperado:**
- ✅ Mensagem de sucesso
- ✅ Novo usuário aparece na tabela
- ✅ Usuário pode fazer login com credenciais

**Validação:**
- Tenta login com `testador / senha123`
- ✅ Login bem-sucedido

---

### Teste 2.3: Editar Usuário

**Passos:**
1. Admin clica em linha do usuário `testador`
2. Modal aparece com dados atuais
3. Altera cargo para `administrador`
4. Clica em "Salvar"

**Resultado Esperado:**
- ✅ Modal fecha
- ✅ Tabela atualiza com novo cargo
- ✅ Usuário agora tem permissões de admin

---

### Teste 2.4: Deletar Usuário

**Passos:**
1. Admin clica em botão delete para `testador`
2. Confirmação: "Tem certeza?"
3. Clica em "Sim"

**Resultado Esperado:**
- ✅ Usuário desaparece da tabela
- ✅ Mensagem de sucesso
- ✅ Usuário não consegue mais fazer login

---

## 📦 TESTE 3: GESTÃO DE MATERIAIS

### Teste 3.1: Listar Materiais

**Passos:**
1. Qualquer usuário acessa "Materiais"
2. Verifica tabela de materiais

**Resultado Esperado:**
- ✅ Exibe todos os materiais cadastrados
- ✅ Mostra colunas: código, nome, categoria, estoque
- ✅ Search e filtro por categoria funcionam

---

### Teste 3.2: Buscar Material

**Passos:**
1. Em "Materiais", preenche campo de busca: `aluminio`
2. Aguarda resultado

**Resultado Esperado:**
- ✅ Tabela filtra em tempo real
- ✅ Mostra apenas materiais com "aluminio" no nome
- ✅ Busca é case-insensitive

---

### Teste 3.3: Filtrar por Categoria

**Passos:**
1. Em "Materiais", seleciona categoria do dropdown
2. Seleciona `Alumínio`

**Resultado Esperado:**
- ✅ Tabela mostra apenas materiais da categoria Alumínio

---

### Teste 3.4: Criar Material (Admin)

**Passos:**
1. Admin acessa "Materiais"
2. Clica em "Novo Material"
3. Preenche:
   - Código: `TEST-001`
   - Nome: `Material Teste`
   - Categoria: `Teste`
   - Estoque Mínimo: `50`
   - Estoque Atual: `100`
4. Clica em "Salvar"

**Resultado Esperado:**
- ✅ Material criado e aparece na tabela
- ✅ Mensagem de sucesso
- ✅ Pode ser buscado imediatamente

---

### Teste 3.5: Editar Material

**Passos:**
1. Admin clica em material criado
2. Modal de edição aparece
3. Altera `Estoque Atual` para `150`
4. Clica em "Salvar"

**Resultado Esperado:**
- ✅ Estoque atualizado na tabela
- ✅ Timestamp de `atualizado_em` muda

---

### Teste 3.6: Deletar Material

**Passos:**
1. Admin clica em botão delete
2. Confirmação exibida
3. Clica em "Confirmar"

**Resultado Esperado:**
- ✅ Material desaparece da tabela
- ✅ Mensagem de sucesso

---

### Teste 3.7: Importar Materiais (Excel)

**Passos:**
1. Admin em "Materiais" clica em "Importar Excel"
2. Baixa template (se disponível)
3. Preenche com dados:
   ```
   Nome | Codigo | Categoria | Estoque_Min | Estoque_Atual
   Aço 1 | ACO-001 | Aço | 100 | 500
   Aço 2 | ACO-002 | Aço | 80 | 300
   ```
4. Faz upload do arquivo

**Resultado Esperado:**
- ✅ Resumo: "2 inseridos, 0 erros"
- ✅ Novos materiais aparecem na tabela
- ✅ Podem ser buscados imediatamente

---

## 📝 TESTE 4: SISTEMA DE PEDIDOS

### Teste 4.1: Criar Novo Pedido

**Passos:**
1. Funcionário acessa "Pedidos"
2. Clica em "Novo Pedido"
3. Preenche observação (opcional): "Urgente"
4. Clica em "Criar"

**Resultado Esperado:**
- ✅ Pedido criado com status "novo"
- ✅ Número de pedido gerado (ex: PED-001)
- ✅ Redireciona para página de edição

---

### Teste 4.2: Adicionar Material ao Pedido

**Passos:**
1. Em pedido aberto, busca material: `aluminio`
2. Seleciona um material
3. Preenche `quantidade: 100`
4. Clica em "Adicionar"

**Resultado Esperado:**
- ✅ Material aparece na tabela de itens
- ✅ Quantidade exibida
- ✅ Campos de input limpam para novo item

---

### Teste 4.3: Remover Item do Pedido

**Passos:**
1. Em item da tabela, clica em botão delete
2. Confirmação exibida
3. Clica em "Confirmar"

**Resultado Esperado:**
- ✅ Linha desaparece da tabela
- ✅ Total do pedido atualiza

---

### Teste 4.4: Confirmar Pedido

**Passos:**
1. Pedido com 2-3 itens criado
2. Valida estoque de todos os materiais
3. Clica em "Confirmar Pedido"

**Resultado Esperado:**
- ✅ Mensagem de sucesso
- ✅ Status muda para "confirmado"
- ✅ Estoque de materiais decrementado
- ✅ Redireciona para lista de pedidos

**Validação Técnica:**
- Verificar que `Material.estoque_atual` foi decrementado

---

### Teste 4.5: Confirmar Pedido com Estoque Insuficiente

**Passos:**
1. Cria pedido com item que tem quantidade > estoque
2. Clica em "Confirmar"

**Resultado Esperado:**
- ❌ Mensagem de erro: "Estoque insuficiente"
- ✅ Pedido permanece em status "novo"
- ✅ Estoque não é alterado

---

### Teste 4.6: Listar Pedidos

**Passos:**
1. Acessa "Meus Pedidos"
2. Verifica tabela de pedidos

**Resultado Esperado:**
- ✅ Listados todos os pedidos do usuário
- ✅ Mostra: número, data, status
- ✅ Click em linha abre detalhes

---

### Teste 4.7: Filtrar Pedidos por Status

**Passos:**
1. Em lista de pedidos, seleciona filtro `status: confirmado`

**Resultado Esperado:**
- ✅ Mostra apenas pedidos confirmados
- ✅ Filtra em tempo real

---

### Teste 4.8: Consultar Histórico de Pedidos (Admin)

**Passos:**
1. Admin acessa "Consultar Pedidos"
2. Define filtros (data inicial, data final, usuário)
3. Clica em "Buscar"

**Resultado Esperado:**
- ✅ Mostra pedidos que atendem critérios
- ✅ Permite exportar (se implementado)

---

## 🏭 TESTE 5: RETIRADA DE MATERIAIS

### Teste 5.1: Listar Materiais para Retirada

**Passos:**
1. Acessa "Retirada de Materiais"
2. Verifica lista de materiais

**Resultado Esperado:**
- ✅ Exibe todos os materiais
- ✅ Mostra estoque atual
- ✅ Indicador visual de estoque (verde/orange/vermelho)

---

### Teste 5.2: Buscar Material para Retirada

**Passos:**
1. Em "Retirada", preenche busca: `vidro`

**Resultado Esperado:**
- ✅ Lista filtra mostrando apenas vidros

---

### Teste 5.3: Confirmar Retirada

**Passos:**
1. Clica em material para retirar
2. Página de confirmação abre
3. Preenche:
   - Quantidade: `50`
   - Motivo: `Para produção`
   - Observação: `Linha C`
4. Clica em "Confirmar"

**Resultado Esperado:**
- ✅ Mensagem de sucesso (verde)
- ✅ Estoque do material decrementado em 50
- ✅ Redireciona para lista de retiradas

**Validação Técnica:**
- Verificar que `Retirada` foi criada
- Verificar que `RetiradaMaterial` foi criada
- Verificar que `Material.estoque_atual` foi decrementado

---

### Teste 5.4: Retirada com Quantidade Inválida

**Passos:**
1. Em confirmação de retirada, preenche `quantidade: 0`
2. Clica em "Confirmar"

**Resultado Esperado:**
- ❌ Validação de erro
- ❌ Não permite confirmar

---

### Teste 5.5: Retirada com Estoque Insuficiente

**Passos:**
1. Material tem 30 unidades
2. Tenta retirar 50 unidades

**Resultado Esperado:**
- ❌ Erro: "Estoque insuficiente"
- ❌ Não permite confirmar

---

### Teste 5.6: Ver Histórico de Retiradas (Admin)

**Passos:**
1. Admin em "Retirada" clica em "Histórico"
2. Verifica tabela de retiradas passadas

**Resultado Esperado:**
- ✅ Mostra todas as retiradas do sistema
- ✅ Filtra por data, usuário, material

---

## ⚠️ TESTE 6: ALERTAS E MONITORAMENTO

### Teste 6.1: Alertas de Baixo Estoque

**Passos:**
1. Admin acessa dashboard/hub
2. Verifica seção de alertas

**Resultado Esperado:**
- ✅ Mostra materiais com estoque < estoque_minimo
- ✅ Exibe contador de alertas
- ✅ Ícone visual diferencia urgência

---

### Teste 6.2: Gerar Alerta Reduzindo Estoque

**Passos:**
1. Material `A` tem: atual=100, mínimo=50
2. Cria pedido + confirma com 70 unidades do material A
3. Agora: atual=30, mínimo=50
4. Verifica alertas

**Resultado Esperado:**
- ✅ Material aparece em alertas
- ✅ Mostra "Estoque crítico"

---

## 🔄 TESTE 7: FLUXO COMPLETO (INTEGRAÇÃO)

### Teste 7.1: Cenário de Pedido Completo

**Cenário:**
```
1. Admin cria materiais (aluminio, vidro)
2. Funcionario1 faz pedido com 2 materiais
3. Confirma pedido (decrementa estoque)
4. Verifica lista de pedidos
5. Consulta histórico
6. Admin vê alertas se estoque baixo
```

**Validações:**
- ✅ Estoque decrementado após confirmação
- ✅ Histórico registra corretamente
- ✅ Alertas aparecem se necessário
- ✅ Todos os usuários veem dados corretos

---

### Teste 7.2: Cenário de Retirada Completa

**Cenário:**
```
1. Material existe com estoque=500
2. Funcionario2 faz retirada de 100
3. Estoque agora = 400
4. Verifica histórico de retiradas
5. Admin ve histórico completo
6. Cria novo pedido com mesmo material
7. Valida que estoque disponível é 400
```

**Validações:**
- ✅ Retirada registrada corretamente
- ✅ Estoque global atualizado
- ✅ Histórico rastreável
- ✅ Pedido respeita novo estoque

---

## 📊 TESTE 8: VALIDAÇÕES E ERROS

### Teste 8.1: Validação de Campo Obrigatório

**Passos:**
1. Tenta criar material sem nome
2. Clica em salvar

**Resultado Esperado:**
- ❌ Erro: "Nome é obrigatório"

---

### Teste 8.2: Validação de Tipo de Dado

**Passos:**
1. Em material, preenche estoque com texto: `abc`
2. Clica em salvar

**Resultado Esperado:**
- ❌ Erro: "Estoque deve ser número"

---

### Teste 8.3: Validação de Unicidade

**Passos:**
1. Cria usuário com nome: `teste`
2. Tenta criar outro com mesmo nome

**Resultado Esperado:**
- ❌ Erro: "Usuário já existe"

---

### Teste 8.4: Acesso Negado (Não Admin)

**Passos:**
1. Loga como `funcionario1`
2. Tenta acessar "Materiais" (admin)

**Resultado Esperado:**
- ❌ Acesso negado
- ❌ Redireciona ou exibe erro

---

## 🔒 TESTE 9: SEGURANÇA

### Teste 9.1: Token Expirado

**Passos:**
1. Loga normalmente
2. Aguarda por 1 hora (ou simula token expirado)
3. Tenta fazer requisição

**Resultado Esperado:**
- ✅ Sistema detecta expiração
- ✅ Tenta renovar com refreshToken
- ✅ Se sucesso: continua operação
- ✅ Se falha: redireciona para login

---

### Teste 9.2: Rate Limiting

**Passos:**
1. Faz 150 requisições ao /api/materials em 15 minutos
2. Requisição 151

**Resultado Esperado:**
- ❌ Resposta 429 (Too Many Requests)

---

### Teste 9.3: CORS

**Passos:**
1. Tenta acessar API de outro domínio
2. Ex: abrir console em http://site-externo.com

**Resultado Esperado:**
- ❌ Erro de CORS (bloqueado)

---

## 📈 TESTE 10: PERFORMANCE

### Teste 10.1: Listar 1000 Materiais

**Passos:**
1. Importa 1000 materiais
2. Acessa página de materiais

**Resultado Esperado:**
- ✅ Página carrega em < 2 segundos
- ✅ Search funciona rapidamente
- ✅ Paginação ou virtualização funciona

---

### Teste 10.2: Confirmar Pedido com 100 Itens

**Passos:**
1. Cria pedido com 100 itens
2. Confirma

**Resultado Esperado:**
- ✅ Confirmação completa em < 5 segundos
- ✅ Todos os estoques atualizados corretamente

---

## 📋 Checklist de Testes

- [ ] Login funciona
- [ ] Logout funciona
- [ ] CRUD usuários (admin)
- [ ] CRUD materiais (admin)
- [ ] Importar materiais (Excel)
- [ ] Criar pedido
- [ ] Adicionar itens ao pedido
- [ ] Confirmar pedido
- [ ] Retirada de material
- [ ] Histórico de retiradas
- [ ] Alertas de estoque
- [ ] Filtros e busca
- [ ] Validações de erro
- [ ] Segurança (JWT, CORS)
- [ ] Performance

---

## 🐛 Reportar Bugs

Ao encontrar um problema, documente:
1. **Passo a passo** para reproduzir
2. **Resultado esperado**
3. **Resultado obtido**
4. **Screenshots/logs** se aplicável
5. **Ambiente** (navegador, sistema operacional)

---

**Versão do guia:** 1.1  
**Última atualização:** Dezembro 2025
