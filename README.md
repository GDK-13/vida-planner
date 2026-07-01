# Vida — hospedagem privada e gratuita (Vercel + Upstash), sem cartão, sem domínio

O que você tem aqui:
- `index.html` — o app, já ajustado pra sincronizar automaticamente com o
  próprio domínio (sem precisar configurar nada nas configurações do app).
- `middleware.ts` — trava TODO o site (páginas e API) atrás de usuário/senha.
  Sem login certo, nada carrega — nem o HTML.
- `api/data.ts` e `api/health.ts` — onde os dados ficam salvos de verdade
  (banco Redis gratuito da Upstash), pra sincronizar entre computadores.

Nada disso pede cartão de crédito.

## Passo 1 — Conta na Vercel
1. Vá em https://vercel.com/signup e crie conta com GitHub ou e-mail (sem cartão).

## Passo 2 — Conta na Upstash (o banco de dados)
1. Vá em https://console.upstash.com e crie conta grátis (sem cartão).
2. Clique em **Create Database**, escolha um nome e a região mais próxima de
   você (ex: `us-east-1` já é rápido o bastante pro Brasil).
3. Na página do banco criado, role até **REST API** e copie:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Passo 3 — Subir este projeto pro GitHub
1. Crie um repositório novo no GitHub (pode ser privado ou público — não faz
   diferença de segurança, já que o middleware protege o acesso de qualquer
   forma).
2. Suba os arquivos desta pasta (`index.html`, `middleware.ts`, `api/`,
   `package.json`, `.gitignore`) pra esse repositório.

## Passo 4 — Importar na Vercel
1. No painel da Vercel, **Add New → Project** → selecione o repositório.
2. Antes de fazer o deploy, vá em **Environment Variables** e adicione:
   - `SITE_USER` → o usuário que só você vai saber
   - `SITE_PASS` → a senha que só você vai saber
   - `UPSTASH_REDIS_REST_URL` → o valor copiado no Passo 2
   - `UPSTASH_REDIS_REST_TOKEN` → o valor copiado no Passo 2
3. Clique em **Deploy**.

## Passo 5 — Testar
Acesse a URL que a Vercel gerou (tipo `https://vida-app-seunome.vercel.app`).
O navegador vai pedir usuário/senha antes de mostrar qualquer coisa — use o
`SITE_USER`/`SITE_PASS` que você definiu. Depois disso, o app carrega
normalmente e já salva os dados sincronizados no Upstash (dá pra abrir a
mesma URL de outro computador e logar de novo pra ver os mesmos dados).

## Como a segurança funciona aqui
- O `middleware.ts` roda na borda da Vercel, antes de qualquer arquivo ser
  entregue — inclusive antes do `index.html` e das rotas `/api/*`.
- Sem o usuário/senha corretos, o servidor responde só "401 Unauthorized",
  nunca entrega o conteúdo.
- O navegador guarda a senha durante a sessão e reenvia automaticamente nas
  chamadas de sincronização — por isso o app já funciona sem precisar
  configurar token manualmente nas Configurações.

## Se quiser trocar a senha depois
Só editar as variáveis `SITE_USER`/`SITE_PASS` no painel da Vercel
(Settings → Environment Variables) e fazer um novo deploy (ou redeploy do
último commit) — não precisa mexer em código.
