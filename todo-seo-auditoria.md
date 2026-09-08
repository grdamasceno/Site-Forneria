# TO DO — SEO/AEO (a partir da auditoria de 23/08/2026)

Baseado em `auditoria-seo-forneria-original.md`, cruzado com o código atual.
Dividido por quem executa: o que dá pra codar já vs. o que depende de acesso/decisão fora do repo.

---

## ✅ Grupo A — Já podemos implementar agora (só código, sem dependência externa)

Baixo risco, sem precisar de decisão de negócio, sem precisar de acesso a Cloudflare/GBP/Search Console.

- [x] **Corrigir "54 unidades"** — consultado o Supabase ao vivo: 53 unidades ativas hoje. Trocado nos 3 lugares hardcoded para "mais de 50 unidades" (número redondo, não trava toda vez que abre/fecha uma loja):
  [src/app/(site)/page.tsx](<src/app/(site)/page.tsx>), [src/app/layout.tsx](src/app/layout.tsx), [src/components/Footer.tsx](src/components/Footer.tsx)
- [x] **H1 na home** — adicionado (`sr-only`, não altera o visual do hero) em [page.tsx](<src/app/(site)/page.tsx>)
- [x] **Meta description única por rota** — todas as 15 rotas estáticas + as 2 dinâmicas (`cardapio/[slug]`, `novidades/[slug]`) agora têm `description` própria
- [x] **`metadataBase` + canonical** — declarado em [layout.tsx](src/app/layout.tsx) (`SITE_URL = https://www.forneriaoriginal.com`) + `alternates.canonical` em toda rota
- [x] **Open Graph + Twitter Card** — defaults no layout raiz (`og:type`, `locale: pt_BR`, `twitter:card`), com `og:title`/`og:description` herdando automaticamente o `title`/`description` de cada página (comportamento nativo do Next). Páginas de produto/post sobrescrevem `og:image` com a foto real
- [x] **`app/sitemap.ts`** — criado, gera `/sitemap.xml` com rotas estáticas + todos os sabores do cardápio + todos os posts de novidades (dinâmico via Supabase)
- [x] **`FAQPage` JSON-LD** em `/duvidas-frequentes`
- [x] **`Organization` + `Brand` JSON-LD** na home (CNPJ, `sameAs`, `foundingDate`, prêmios iFood)
- [x] **`Article` JSON-LD** em `/novidades/[slug]` (com parser de data PT→ISO)
- [x] **`BreadcrumbList` JSON-LD** em `/cardapio/[slug]`, `/novidades` e `/novidades/[slug]` (onde já existe breadcrumb visual)
- [x] **Corrigir `sizes` do `next/image`** — os carrosséis principais (marcas, sugestão da semana, mais pedidos, banners) já estavam corretos; faltava só em `/fornelover` (4 imagens decorativas), corrigido
- [ ] **Facade no vídeo do YouTube da home** — **adiado**: é vídeo de fundo decorativo (mudo, em loop, não é o hero principal). Trocar por facade muda o comportamento visual (deixa de tocar sozinho) e precisa de uma imagem de poster — julguei que isso é uma decisão de design, não um ajuste de código puro. Fica pendente pra quando alguém validar a mudança de UX

### Extra implementado (não estava listado, mas ficou pronto de graça)
- [x] **`Menu` + `MenuSection` + `MenuItem` JSON-LD** em `/cardapio` (sem `offers`/preço — ver Grupo B abaixo) — dado e schema já usados por múltiplos sabores, com `suitableForDiet` na linha vegana

## 🟡 Grupo B — Precisa checar dado real antes de codar (rápido, mas depende de conferência)

- [x] **`Menu`/`MenuItem` JSON-LD no cardápio** — implementado (ver Grupo A), mas **sem `offers`/preço**: o catálogo (`produtos` no Supabase) não guarda preço por tamanho hoje, só dados nutricionais e ingredientes. Se quiserem o schema completo com preço, precisa adicionar esse campo na tabela e no admin primeiro
- [ ] **`Restaurant` JSON-LD por unidade** — bloqueado até existir rota própria por unidade (Grupo C) ou pode ser um schema agregado por enquanto, mas fica capenga sem endereço/geo por unidade confiável
- [ ] **Corrigir dados de Macaé, Nova Friburgo, Águas Claras e Anápolis** — não é código, é dado no Supabase (tabela de unidades no admin). Precisa entrar no painel `/admin/unidades` e:
  - Macaé e Nova Friburgo: preencher `streetAddress`
  - Águas Claras: remover o endereço/telefone da Asa Norte que está colado no campo de horário
  - Anápolis: corrigir endereço/link do Maps (hoje aponta pra Goiânia)

## 🔴 Grupo C — Depende de acesso externo ou decisão de negócio (não é só código)

- [ ] **Liberar crawlers de IA no robots.txt** — feito no painel Cloudflare (o bloqueio é injetado por lá, não pelo Next). Precisa de acesso admin ao Cloudflare da conta + decisão: liberar GPTBot/ClaudeBot/Google-Extended/Applebot-Extended/meta-externalagent, manter CCBot/Bytespider bloqueados
- [ ] **~53 páginas individuais de unidade** (`/unidades/rj/rio-de-janeiro/botafogo`) — contagem real consultada no Supabase (53 unidades ativas hoje, não 44). É código (roteamento dinâmico + schema), mas trava em texto original por unidade (150-300 palavras, não template) — decisão de quem escreve esse conteúdo
- [ ] **Google Business Profile por unidade** — reivindicar/verificar os ~53 GBPs, garantir NAP idêntico ao site. Fora do escopo de código, é operação/marketing
- [ ] **Telefone próprio por unidade** (hoje maioria cai no `(21) 4063-5555` central) — decisão de negócio (linha telefônica por loja) antes de refletir no código
- [ ] **`AggregateRating`/`Review`** dos depoimentos da home — juridicamente sensível (Google pune rating marcado à mão sem fonte verificável); decisão: puxar de GBP/iFood via API ou marcar só como `Review` individual com autor identificado
- [ ] **Migração de `franquia.forneriaoriginal.com` para `/franquia`** — mudança de infraestrutura (DNS, redirects, possível impacto em campanhas ativas), precisa ser planejada com quem cuida do domínio/Vercel
- [ ] **`llms.txt`** — baixa prioridade, só faz sentido depois do robots.txt liberado

---

## Plano de execução sugerido

**✅ Feito:** Grupo A quase inteiro (só falta o facade do vídeo do YouTube, adiado por ser mudança de UX). Build de produção validado (`npm run build`) e conferido em servidor local — metadata, canonical, sitemap.xml e todo o JSON-LD renderizando corretamente.

**Próximo, em paralelo:** Grupo B — corrigir Macaé, Nova Friburgo, Águas Claras e Anápolis no admin de unidades (rápido, só precisa de acesso ao painel); avaliar se vale adicionar preço por tamanho ao catálogo para fechar o `Menu` schema com `offers`.

**Depois, combinando com o cliente/negócio:** Grupo C — começar pelo robots.txt no Cloudflare (15 min, maior alavancagem) e pela decisão sobre as ~53 páginas de unidade (maior esforço, maior retorno).

---

*Gerado a partir da auditoria SEO/AEO de 23/08/2026. Grupo A implementado e validado em 02/09/2026.*
