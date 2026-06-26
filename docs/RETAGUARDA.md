# Retaguarda (Painel Administrativo) — Forneria Original

Documentação da área administrativa do site (`/admin`), por onde a equipe edita o
conteúdo que aparece no site público sem precisar mexer em código.

> **Resumo:** o painel é construído em Next.js (App Router) + Supabase. Toda
> leitura do site público vem do banco Supabase; a retaguarda é a interface de
> escrita. As alterações aparecem no site **imediatamente** (revalidação
> automática das páginas afetadas).

---

## 1. Acesso

| Item | Valor |
|---|---|
| URL de login | `https://<dominio>/admin/login` |
| URL do painel | `https://<dominio>/admin` |
| Autenticação | E-mail + senha (Supabase Auth) |
| Super administrador | `thais@onchannel.io` |

- **Entrar:** acesse `/admin/login`, informe e-mail e senha → redireciona para `/admin`.
- **Sair:** botão **Sair** no canto superior direito do cabeçalho do painel.
- Se tentar abrir qualquer página de `/admin` sem estar logado, é redirecionado
  para o login automaticamente.

---

## 2. Segurança e permissões

A proteção acontece em **três camadas**, então mesmo que uma falhe as outras seguram:

1. **Middleware** (`src/middleware.ts`) — intercepta todas as rotas `/admin/*`.
   Sem sessão válida → redireciona para `/admin/login`. Já logado tentando abrir
   o login → manda para `/admin`. É tolerante a falhas: se o ambiente Edge não
   tiver as variáveis do Supabase, ele não derruba o app (a camada 2 garante).
2. **Layout do painel** (`src/app/admin/(painel)/layout.tsx`) — no servidor,
   confere a sessão (`auth.getUser()`); sem usuário, `redirect('/admin/login')`.
3. **RLS no banco (Row Level Security)** — a regra final e mais importante. No
   Postgres do Supabase, **leitura é pública**, mas **escrita só é permitida ao
   administrador**, validada pela função `is_admin()`:

   ```sql
   select coalesce(auth.jwt() ->> 'email', '') = 'thais@onchannel.io';
   ```

   Ou seja: ainda que alguém burlasse a interface, o banco recusa qualquer
   gravação que não venha do e-mail administrador.

### Super admin vs. usuários comuns

- A gestão de **Usuários** (criar/excluir logins) é restrita ao
  **super admin** (`thais@onchannel.io`) — verificado no servidor antes de cada
  operação (`assertAdmin()`).
- ⚠️ **Importante:** hoje a função `is_admin()` reconhece **apenas** o e-mail
  `thais@onchannel.io` como quem pode **gravar** conteúdo. Usuários adicionais
  criados na tela de Usuários conseguem **logar e navegar**, mas as gravações
  deles serão **bloqueadas pelo RLS**. Para liberar mais administradores de
  escrita, é preciso ajustar a função `is_admin()` no banco (ver
  [§8 Limitações](#8-limitações-conhecidas)).

---

## 3. Navegação do painel

Cabeçalho vermelho fixo com os atalhos (componente `AdminNav`):

| Menu | Rota | O que gerencia |
|---|---|---|
| **A Forneria Original** | `/admin` | Textos institucionais, e-mails dos formulários e parceiros |
| **Cardápio** | `/admin/cardapio` | Produtos (pizzas/forneritos), imagens, ingredientes, tabela nutricional |
| **Marcas** | `/admin/marcas` | Marcas exibidas em "Nossas Marcas" |
| **Unidades** | `/admin/unidades` | Lojas/franquias e endereços |
| **Novidades** | `/admin/novidades` | Posts do blog |
| **Páginas** | `/admin/paginas` | Banners/carrosséis das páginas |
| **Usuários** | `/admin/usuarios` | Logins de acesso ao painel (somente super admin) |

---

## 4. Seções em detalhe

### 4.1 A Forneria Original (`/admin`)

Tela inicial, com três blocos:

- **Textos institucionais** — campos **Sobre Nós** e **Faturamento**, salvos na
  tabela `configuracoes` (formato chave/valor). Refletem na página
  `/a-forneria-original` e na home.
- **E-mails dos formulários** — lista de destinatários por formulário
  (`franqueado`, `sac`, `trabalhe_conosco`). Permite **adicionar** e **excluir**
  e-mails. São os endereços que **recebem** os envios de cada formulário do site.
- **Parceiros** — lista de parceiros (Coca-Cola, iFood, Seara, Catupiry, etc.)
  com **nome** e **ordem** de exibição. Permite adicionar, reordenar e excluir.

### 4.2 Cardápio (`/admin/cardapio`)

CRUD completo de produtos (`produtos` + `produto_nutricao`):

- **Criar produto** — informe nome + categoria; o sistema gera um `slug` único.
- **Editar** — renomear, trocar categoria, editar ingredientes.
- **Categorias:** `pizza-salgada`, `pizza-doce`, `vegana`, `fornerito`.
- **Flags (liga/desliga):**
  - **Ativo** — controla se o produto aparece no site.
  - **Semana** — marca o produto como "Sugestão da Semana" na home.
- **Imagens** — upload de três variantes (vão para o bucket `cardapio`):
  - **Principal** (`imagem`) — usada no card do cardápio.
  - **Destaque** (`destaque_imagem`) — versão para as faixas da home.
  - **Mobile** (`imagem_mobile`).
- **Tabela nutricional** — cria/edita/exclui a nutrição do produto (porção,
  calorias kcal/kJ, carboidratos, proteínas, gorduras totais/saturadas/trans,
  fibras, sódio).
- **Excluir produto** — remove o produto (e a nutrição em cascata).

> "Mais Pedidos" da home usa três produtos fixos por nome (**Calabresa**,
> **A Moda**, **Catuperoni**). Para trocar quais aparecem ali, é preciso ajuste
> em código (`getMostOrdered`), não pelo painel.

### 4.3 Marcas (`/admin/marcas`)

Marcas da seção "Nossas Marcas" (tabela `marcas`, bucket `marcas`):

- Criar/editar **nome**, **descrição** e **ordem**.
- Upload do **logo** (imagem redonda).
- **Ativo** — liga/desliga a exibição.
- Excluir marca.

### 4.4 Unidades (`/admin/unidades`)

Lojas/franquias (tabela `unidades`, bucket `unidades`):

- Cadastro via **modal** com endereço granular: CEP, logradouro, número,
  complemento, bairro, cidade, UF, estado, horário e **região** (vínculo com a
  tabela `regioes`, que carrega o telefone).
- O **endereço de exibição** é montado automaticamente a partir dos campos.
- Upload da **foto da fachada**.
- **Ativo** — liga/desliga a unidade no site.
- Excluir unidade.

### 4.5 Novidades (`/admin/novidades`)

Blog (tabela `posts`, bucket `blog`):

- Criar/editar post: **título**, **data**, **resumo** e **conteúdo**.
  O `slug` é gerado automaticamente a partir do título.
- Upload da **imagem** de capa.
- **Publicado** — liga/desliga a publicação.
- Excluir post.

### 4.6 Páginas (`/admin/paginas`)

Banners e carrosséis por página (tabela `banners`, bucket `banners`):

- **Adicionar banner** a uma página (campo `pagina`, ex.: `home`, `franqueado`),
  com imagem **desktop** e **mobile**, **link** (href), **alt** e **ordem**.
- **Ativo** — liga/desliga o banner.
- Excluir banner.
- O carrossel principal da home roda automaticamente quando há mais de um banner
  ativo.

### 4.7 Usuários (`/admin/usuarios`) — somente super admin

Gestão dos logins do painel (Supabase Auth, via `service_role`):

- **Criar usuário** — e-mail + senha (mínimo 6 caracteres); já criado confirmado.
- **Excluir usuário**.
- Veja a ressalva de permissão de escrita na [§2](#2-segurança-e-permissões).

---

## 5. Modelo de dados (Supabase / Postgres)

Tabelas principais (migrations em `supabase/migrations/`):

| Tabela | Conteúdo |
|---|---|
| `produtos` | Pizzas/forneritos. Flags `ativo`, `semana`; imagens `imagem`, `destaque_imagem`, `imagem_mobile` |
| `produto_nutricao` | Tabela nutricional (1→N por produto, cascade no delete) |
| `marcas` | Marcas de "Nossas Marcas" |
| `unidades` | Lojas/franquias (+ endereço granular) |
| `regioes` | Regiões com telefone, vinculadas às unidades |
| `posts` | Blog/Novidades |
| `banners` | Banners/carrosséis por página (`pagina`) |
| `page_assets` | Imagens editáveis avulsas de páginas (chave/valor) |
| `parceiros` | Parceiros institucionais |
| `configuracoes` | Pares chave/valor (`sobre_nos`, `faturamento`, …) |
| `form_emails` | Destinatários por formulário (`franqueado`/`sac`/`trabalhe_conosco`) — **não** é público |

**RLS:** todas com leitura pública (exceto `form_emails`, que é só do admin) e
escrita restrita ao admin via `is_admin()`.

### Buckets de Storage (todos públicos para leitura)

`cardapio`, `unidades`, `blog`, `marcas`, `banners`, `paginas` — upload restrito
ao admin. As URLs salvas recebem um sufixo `?v=<timestamp>` para furar cache do
navegador quando a imagem é trocada.

---

## 6. Como as alterações chegam ao site

Cada ação de gravação chama `revalidatePath(...)` nas páginas afetadas (ex.:
salvar um produto revalida `/admin/cardapio`, `/cardapio` e `/`). As páginas do
site público usam `dynamic = "force-dynamic"`, então leem sempre o estado atual
do banco. **Resultado: a mudança aparece no site logo após salvar** (basta
atualizar a página pública).

---

## 7. Variáveis de ambiente necessárias

Configuradas no `.env.local` (dev) e no projeto da Vercel (produção):

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (leitura + auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (somente servidor) — usada na gestão de usuários |
| `SMTP_*` | Envio de e-mail dos formulários (host, port, user, pass, from) |

> A `service_role` **nunca** é exposta ao navegador — fica apenas em código de
> servidor (`src/lib/supabase/admin.ts`, marcado `server-only`).

---

## 8. Limitações conhecidas

- **Apenas um administrador de escrita:** `is_admin()` reconhece somente
  `thais@onchannel.io`. Novos usuários logam, mas não gravam até a função ser
  ajustada no banco (ex.: trocar a comparação por uma lista de e-mails ou por
  uma tabela `admins`).
- **"Mais Pedidos" da home** é fixo em código (Calabresa, A Moda, Catuperoni).
- **Sugestão da Semana / Depoimentos:** a Sugestão da Semana é controlada pela
  flag `semana` no Cardápio; os **depoimentos** da home são estáticos em código
  (não há tela no painel ainda).

---

## 9. Tarefas comuns (passo a passo)

- **Colocar uma pizza na "Sugestão da Semana":** Cardápio → localizar o produto →
  ligar a flag **Semana**.
- **Tirar um produto do site temporariamente:** Cardápio → desligar **Ativo**.
- **Trocar a foto de uma pizza:** Cardápio → produto → upload da imagem
  (Principal/Destaque/Mobile).
- **Adicionar uma loja:** Unidades → novo → preencher o modal de endereço →
  enviar foto da fachada.
- **Publicar uma novidade:** Novidades → novo → título/data/resumo/conteúdo →
  imagem → garantir **Publicado** ligado.
- **Trocar o banner da home:** Páginas → adicionar banner na página `home`
  (desktop + mobile) → definir ordem.
- **Mudar para onde vão os e-mails do SAC:** A Forneria Original → bloco de
  e-mails → adicionar/excluir endereços no formulário `sac`.
- **Liberar acesso para outra pessoa:** Usuários → criar usuário (lembrando da
  ressalva de escrita acima).
