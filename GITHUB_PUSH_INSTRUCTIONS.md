# 🔑 Como Fazer Push para o GitHub

Seu repositório está pronto localmente, mas GitHub precisa de autenticação para fazer push.

---

## Opção 1: Personal Access Token (Recomendado - Mais Fácil)

### Passo 1: Criar Token no GitHub
1. Acesse https://github.com/settings/tokens/new
2. Clique em "Generate new token (classic)"
3. Preencha:
   - **Note:** `Localizator Push Token`
   - **Expiration:** `90 days` (ou 365)
   - **Select scopes:** Marque `repo` (acesso completo ao repositório)
4. Clique em "Generate token"
5. **Copie o token** (você não poderá vê-lo novamente!)

### Passo 2: Fazer Push no VS Code

Abra o terminal integrado e execute:

```bash
cd "c:\Users\eduar\Documents\prog2\projeto rissi - vs1"
git push -u origin main
```

Quando pedir **username**: Digite seu usuário GitHub (`eduardo-bud`)

Quando pedir **password**: Cole o token que você copiou

### Pronto! 🎉

---

## Opção 2: GitHub CLI (Mais Moderno)

### Passo 1: Instalar GitHub CLI
```bash
# Download de: https://cli.github.com/
# Ou via winget:
winget install GitHub.CLI
```

### Passo 2: Autenticar
```bash
gh auth login
# Seguir as instruções (escolha HTTPS)
```

### Passo 3: Fazer Push
```bash
cd "c:\Users\eduar\Documents\prog2\projeto rissi - vs1"
git push -u origin main
```

---

## Opção 3: Git Credential Manager (Automático)

Se você tiver Git Credential Manager instalado:

```bash
cd "c:\Users\eduar\Documents\prog2\projeto rissi - vs1"
git push -u origin main
```

Uma janela de browser abrirá para você autenticar automaticamente.

---

## ✅ Verificar se Funcionou

Após fazer push, você pode verificar:

1. **Terminal:**
   ```bash
   git log -1  # Mostra o último commit
   git remote -v  # Mostra as URLs remotas
   ```

2. **GitHub:**
   - Acesse https://github.com/eduardo-bud/Localizator
   - Você verá todos os 191 arquivos
   - E o histórico de commits

---

## 📋 O que Será Feito Upload

```
191 arquivos totais:
├── 15 documentos (DOCUMENTACAO/)
├── Backend completo (controllers, models, etc)
├── Frontend completo (pages, components)
├── Database scripts
├── Configuration files
├── .gitignore
└── README.md + LINUX_SETUP.md
```

**Não será feito upload** (ignorado pelo .gitignore):
- ❌ node_modules/ (~350 MB)
- ❌ .next/ (~50 MB)
- ❌ .git/ (interno)

**Tamanho total no GitHub:** ~1-2 MB ✅

---

## 🔄 Fluxo de Push

```
1. Você: git push -u origin main
2. GitHub: Pede autenticação
3. Você: Fornece token/credencial
4. GitHub: Recebe 191 arquivos
5. Pronto! 🎉
```

---

## 💡 Dica: Guardar Credenciais

Depois que fizer push uma vez, você pode guardar as credenciais:

```bash
git config --global credential.helper wincred
```

Assim não precisa digitar token toda vez!

---

## ❓ Se Tiver Dúvida

Se a autenticação falhar:

1. Verifique se o repositório é público
2. Verifique se a URL está correta:
   ```bash
   git remote -v
   # Deve mostrar: https://github.com/eduardo-bud/Localizator.git
   ```
3. Tente novamente com seu token

---

## Status Atual

```
✅ Repositório local: Pronto
✅ 3 commits feitos
✅ .gitignore configurado
⏳ Push para GitHub: Aguardando autenticação
```

Você está a **1 comando de distância** de ter seu projeto no GitHub! 🚀
