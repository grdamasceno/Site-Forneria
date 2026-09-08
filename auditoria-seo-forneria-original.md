# Auditoria SEO + AEO — forneriaoriginal.com

**Data:** 23 de agosto de 2026
**Escopo:** auditoria técnica, on-page, dados estruturados, SEO local e prontidão para IA generativa (AEO/GEO)
**Método:** crawl direto de `/`, `/cardapio`, `/cardapio/a-moda`, `/unidades`, `/a-forneria-original`, `/duvidas-frequentes`, `/robots.txt`, `/sitemap.xml` e variantes — inspeção do HTML servido (não renderizado por JS)
**Stack identificada:** Next.js (App Router) na Vercel, Supabase como storage de mídia, Cloudflare na borda, GTM `GTM-WW9DS9T7`, delivery externo em deliverydireto.com.br

---

## Sumário executivo

O site tem uma base técnica boa (Next.js, tempo de resposta entre 0,15s e 0,80s, HTTPS, mobile-ready) e conteúdo comercial forte — 44 unidades, cardápio completo, prêmios iFood, depoimentos. Mas está operando com a camada de SEO essencialmente **não implementada**: zero dados estruturados, zero canonical, zero Open Graph, sem sitemap, meta description duplicada em todas as páginas, e a home sem H1.

Além disso, o `robots.txt` bloqueia todos os principais crawlers de IA, o que remove a marca do universo de respostas do ChatGPT, Claude, Gemini e Perplexity.

A maior perda de tráfego não é técnica, é arquitetural: **44 unidades convivem em uma única URL**, desperdiçando o ativo mais valioso de uma rede de delivery — a busca local por bairro.

**Nota geral: 4,2 / 10.** Fundação sólida, camada de SEO ausente.

---

## 1. BLOQUEIO DE IA — Prioridade máxima

### O que foi encontrado

Conteúdo integral do `robots.txt` na parte relevante:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /

User-agent: Amazonbot            → Disallow: /
User-agent: Applebot-Extended    → Disallow: /
User-agent: Bytespider           → Disallow: /
User-agent: CCBot                → Disallow: /
User-agent: ClaudeBot            → Disallow: /
User-agent: Google-Extended      → Disallow: /
User-agent: GPTBot               → Disallow: /
User-agent: meta-externalagent   → Disallow: /
```

Os comentários no arquivo (`# BEGIN Cloudflare Managed content`) indicam que este bloco foi injetado automaticamente pelo Cloudflare, não escrito pela equipe. É o comportamento padrão do recurso de bloqueio de bots de IA da plataforma.

### O que isso significa na prática

| Bot | Quem é | Consequência do bloqueio |
|---|---|---|
| `GPTBot` | OpenAI | ChatGPT não pode usar o conteúdo do site |
| `ClaudeBot` | Anthropic | Claude não pode usar o conteúdo do site |
| `Google-Extended` | Google | Remove a marca do Gemini e do grounding do Vertex AI |
| `CCBot` | Common Crawl | Sai do dataset usado por praticamente todo modelo aberto |
| `Applebot-Extended` | Apple | Fora do Apple Intelligence |
| `meta-externalagent` | Meta | Fora do Meta AI (que roda dentro do WhatsApp e do Instagram) |

O último item é o mais caro no contexto brasileiro: o Meta AI opera dentro do WhatsApp, canal onde o público da marca efetivamente vive.

**Observação técnica importante:** bloquear `Google-Extended` **não** derruba a indexação no Google Search — quem controla isso é o `Googlebot`, que segue liberado. O AI Overviews da busca também é alimentado pelo Googlebot. O que se perde especificamente é o Gemini como produto e o grounding do Vertex.

### Decisão a tomar

Não é automático que se deva liberar tudo. O trade-off real:

- **Argumento pra manter bloqueado:** proteção de conteúdo proprietário, evitar que a IA responda no lugar do site.
- **Argumento pra liberar:** a Forneria não vende conteúdo, vende pizza. Não existe risco de canibalização de tráfego editorial. O site é um catálogo comercial — quanto mais a IA souber onde ficam as 44 lojas, melhor. O custo do bloqueio é invisibilidade total em um canal de descoberta que cresce.

**Recomendação:** liberar `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended` e `meta-externalagent` (os que geram respostas e citações ao vivo). Manter `CCBot` e `Bytespider` bloqueados se houver preocupação com treinamento em massa — são crawlers de dataset, não de resposta.

Ajuste sugerido do `Content-Signal` para `search=yes, ai-input=yes, ai-train=no, use=reference`: permite ser citado em tempo real sem autorizar treinamento.

### Sobre llms.txt

Só faz sentido **depois** de destravar o robots.txt — hoje ele seria um arquivo que ninguém tem permissão de ler. Mesmo depois, o retorno é baixo: os dados de 2026 mostram que os crawlers de IA raramente requisitam `/llms.txt`, preferindo o HTML. É uma aposta de 20 minutos, não uma estratégia. Prioridade baixa.

---

## 2. Dados estruturados (JSON-LD) — ausência total

Contagem de blocos `application/ld+json` encontrados:

| Página | Blocos |
|---|---|
| `/` | 0 |
| `/cardapio` | 0 |
| `/cardapio/a-moda` | 0 |
| `/unidades` | 0 |
| `/a-forneria-original` | 0 |
| `/duvidas-frequentes` | 0 |

Para uma rede de restaurantes, este é o item de maior perda em relação ao esforço de implementação. Schema é a linguagem em que buscadores e IAs leem entidades — sem ele, o site é texto solto.

### O que implementar

**`Organization` + `Brand`** na home — nome oficial, CNPJ (`34.104.005/0001-86`), logo, `sameAs` apontando para Instagram, Facebook, TikTok, YouTube e X, `foundingDate: 2016`, e `award` para os prêmios iFood Super Restaurantes 2024 e 2025. Este último ponto é importante: bicampeonato nacional é sinal de autoridade que hoje está enterrado num post de blog em vez de declarado como propriedade da entidade.

**`Restaurant` (subtipo de `LocalBusiness`)** em cada página de unidade — `address` completo com `PostalAddress`, `geo` com lat/long, `telephone`, `openingHoursSpecification` (os horários já existem em texto, só precisam ser estruturados), `servesCuisine: "Pizza"`, `priceRange`, `hasMenu` apontando pro cardápio, `acceptsReservations`, `parentOrganization` linkando de volta à marca.

**`Menu` + `MenuSection` + `MenuItem`** no cardápio — cada sabor como `MenuItem` com `name`, `description`, `image`, `offers` com preço, e `suitableForDiet: VeganDiet` na linha vegana (diferencial de nicho hoje invisível).

**`FAQPage`** em `/duvidas-frequentes` — a página já existe e já tem o formato certo. É o schema mais barato de implementar e o que mais é consumido por IA para gerar respostas diretas.

**`AggregateRating` / `Review`** — a home já exibe cinco depoimentos com cinco estrelas. Sem schema, eles são decoração. Com schema, viram estrela no resultado de busca. **Atenção:** o Google exige que as avaliações sejam genuínas e coletadas pelo próprio site; marcar depoimentos selecionados manualmente como `AggregateRating` viola as diretrizes e pode gerar penalidade manual. O caminho correto é puxar de fonte verificável (Google Business Profile ou iFood) ou marcar apenas como `Review` individual com autor identificado.

**`BreadcrumbList`** em todas as páginas internas.

---

## 3. Arquitetura de unidades — a maior oportunidade

### Situação atual

`/unidades` é uma página única com 44 lojas em 8 estados. Não existem URLs individuais.

### O problema

Cada unidade é um negócio local com demanda de busca própria. Hoje, quem procura "pizzaria em Icaraí", "pizza delivery Vila Valqueire" ou "forneria Copacabana telefone" não encontra uma página dedicada — encontra, no máximo, uma página gigante genérica que o Google terá dificuldade de considerar relevante para qualquer bairro específico.

### O que fazer

Criar **44 páginas** no padrão:

```
/unidades/rj/rio-de-janeiro/botafogo
/unidades/rj/niteroi/icarai
/unidades/go/goiania/setor-marista
/unidades/pe/recife/boa-viagem
```

Cada uma com:
- H1 no formato `Forneria Original Botafogo — Pizzaria e Delivery`
- Title e meta description únicos, com bairro e cidade
- Endereço, telefone, horário e mapa embutido
- `Restaurant` schema completo
- Link direto pro pedido daquela unidade
- Texto original de 150 a 300 palavras sobre a área de entrega e os bairros atendidos (evitar template com bairro trocado — isso gera *doorway pages* e é penalizável)
- Link para o Google Business Profile da unidade

`/unidades` vira um hub que linka pras 44 filhas.

**Pré-requisito crítico:** cada unidade precisa de um Google Business Profile reivindicado, verificado e com NAP (nome, endereço, telefone) **exatamente idêntico** ao do site. Divergência de NAP entre site e GBP é a causa número um de fraqueza em SEO local de rede. Hoje há sinal de risco aqui — a maioria das unidades exibe o mesmo telefone central `(21) 4063-5555`, o que dilui o sinal local. O ideal é telefone próprio por unidade, com o 4063 como fallback.

---

## 4. Erros de dados no conteúdo publicado

Encontrados na inspeção de `/unidades`, todos visíveis ao usuário final:

| Unidade | Problema |
|---|---|
| **Macaé** | Sem endereço. O card mostra apenas "— Macaé". Link do Maps aponta para a cidade genérica. |
| **Nova Friburgo** | Mesmo caso — sem logradouro. |
| **Águas Claras (DF)** | O bloco de horário contém, colado ao final, o endereço e o telefone da unidade Asa Norte (`Asa Norte Shc 309 Bloco D Lj 48... Telefone: 61 3686-2222`). Erro de cadastro. |
| **Anápolis (GO)** | Título diz Anápolis, mas endereço e link do Maps apontam para Goiânia (`Av. Goiás, 30 — Vila Santana, Goiânia`). |
| **Contagem geral** | Home e meta description afirmam "mais de 54 unidades"; a página lista 44. |

Os dois primeiros casos impossibilitam implementar `Restaurant` schema (falta `streetAddress`) e quebram a experiência de quem clica em "como chegar". O caso de Anápolis pode estar enviando cliente pro endereço errado.

---

## 5. Meta tags e on-page

### Meta description duplicada

Todas as seis páginas testadas servem exatamente o mesmo texto:

> "A Forneria Original oferece uma experiência única em pizzas desde 2016, com receitas inovadoras, sabores exclusivos e muito recheio. Mais de 54 unidades em todo o Brasil."

Isso é a description padrão vazando do layout raiz do Next.js para todas as rotas filhas. Consequência: o Google descarta e reescreve por conta própria, e a marca perde o controle do texto que aparece no resultado — que é o anúncio gratuito da página.

Cada rota precisa exportar seu próprio `metadata` (ou `generateMetadata` para as rotas dinâmicas de cardápio e unidades).

### Home sem H1

`grep '<h1'` na home retorna zero. As demais páginas têm exatamente um H1, o que está correto. Adicionar um H1 na home — algo como `Forneria Original — Pizza com muito recheio, entregue quentinha` — resolve.

### Canonical ausente

Nenhuma página declara `rel="canonical"`. Sem isso, qualquer variação de URL (com `www`/sem, com parâmetro de UTM, com barra final) pode ser tratada como página distinta. Com campanha paga rodando e GTM instalado, parâmetros de UTM vão aparecer — é questão de tempo.

Implementar via `metadataBase` + `alternates.canonical` no Next.

### Open Graph e Twitter Card ausentes

Nenhuma tag `og:*` em nenhuma página. Quando alguém cola o link do site no WhatsApp, Instagram ou Slack, o preview sai sem imagem e sem descrição — apenas a URL crua.

Para uma marca de food service, onde o compartilhamento por WhatsApp é canal de aquisição real, isso é perda direta de conversão. Implementar `og:title`, `og:description`, `og:image` (1200×630), `og:type`, `og:locale: pt_BR` e `twitter:card: summary_large_image`. Nas páginas de sabor, usar a foto da própria pizza como `og:image`.

---

## 6. Sitemap

`sitemap.xml`, `sitemap_index.xml`, `sitemap-0.xml` e `server-sitemap.xml` retornam todos **404**. O `robots.txt` também não declara nenhuma diretiva `Sitemap:`.

O Next.js App Router gera sitemap nativamente via `app/sitemap.ts`. Deve incluir as páginas estáticas, todos os sabores do cardápio, todas as unidades (após a criação das páginas individuais) e todos os posts de novidades — com `lastModified` real puxado do Supabase, não hardcoded.

Após publicar, declarar no robots.txt e submeter no Search Console.

---

## 7. Performance

Tempos de resposta do HTML medidos: 0,15s a 0,80s. Bom.

Pontos de atenção:

- **Imagens em PNG e JPG apenas.** Nenhuma em WebP ou AVIF. O `next/image` suporta conversão automática — provavelmente desativada ou não configurada.
- **Thumbnails servidos em `w=3840`.** Os cards do carrossel de marcas e os destaques do cardápio pedem a imagem em largura de 3840px para exibir em espaço muito menor. Isso infla o LCP no mobile, que é onde está a maioria do tráfego. Corrigir o parâmetro `sizes` do `next/image`.
- **Vídeo do YouTube com `autoplay=1` na home.** Custa banda e atrapalha o LCP. Considerar facade (thumbnail que só carrega o iframe no clique).
- **Peso do HTML de `/cardapio`: 413 KB.** Alto para uma listagem. Vale investigar se todo o cardápio está sendo serializado no payload inicial.

---

## 8. Estratégia de conteúdo e AEO

### Novidades subaproveitado

Existem posts com material excelente — o caso dos dois casais que saíram de 8 pedidos por dia para R$ 148 milhões, o bicampeonato do Prêmio iFood, o Manifesto da Pizza com marcas concorrentes. Isso é exatamente o tipo de conteúdo que gera citação em IA e link editorial. Mas está publicado sem `Article` schema, sem autor declarado, sem data estruturada.

### Lacuna de conteúdo

Não existe nada respondendo às perguntas que o cliente realmente faz e que a IA realmente cita:

- Qual pizza escolher para um grupo grande
- Diferença entre as massas
- O que é a linha vegana e como é feita
- Quanto tempo demora a entrega em cada região
- Quais unidades atendem por qual bairro
- Comparativos honestos de sabores

Conteúdo em formato pergunta-resposta, com resposta direta no primeiro parágrafo, é o formato que os sistemas de IA extraem e citam.

### O ativo institucional

`/a-forneria-original` é a página que estabelece a marca como entidade — e ela tem apenas 57 KB de HTML, o menor do site. História, fundadores, número real de unidades, prêmios, filosofia de produto. É a página que a IA lê para saber "quem é a Forneria Original". Merece ser a mais rica do site, não a mais magra.

---

## 9. Subdomínio de franquia

`franquia.forneriaoriginal.com` roda separado do domínio principal.

"Franquia de pizzaria" é a busca de maior valor comercial de todo o negócio — um lead de franqueado vale ordens de magnitude mais que um pedido de pizza. Buscadores tratam subdomínio como propriedade parcialmente distinta, o que significa que a autoridade construída no domínio principal não flui integralmente pra lá.

Migrar para `forneriaoriginal.com/franquia` (com redirect 301) consolidaria os sinais. É uma mudança de infraestrutura com risco — deve ser planejada, não improvisada. Se a migração não for viável, no mínimo reforçar o link interno cruzado entre os dois e garantir que o subdomínio tenha seu próprio sitemap e schema `FranchiseOrganization`.

---

## Plano de execução priorizado

### Semana 1 — destravar

| # | Ação | Esforço |
|---|---|---|
| 1 | Liberar crawlers de IA no robots.txt via painel Cloudflare | 15 min |
| 2 | Gerar `app/sitemap.ts` e declarar no robots.txt | 2 h |
| 3 | Meta description e title únicos por rota | 4 h |
| 4 | Canonical via `metadataBase` | 1 h |
| 5 | Open Graph e Twitter Card | 3 h |
| 6 | H1 na home | 15 min |
| 7 | Corrigir Macaé, Nova Friburgo, Águas Claras e Anápolis | 1 h |
| 8 | Alinhar contagem de unidades (54 vs 44) | 30 min |

### Semanas 2 e 3 — estruturar

| # | Ação | Esforço |
|---|---|---|
| 9 | `Organization` + `Brand` na home, com prêmios | 3 h |
| 10 | `FAQPage` em dúvidas frequentes | 2 h |
| 11 | `Menu` + `MenuItem` no cardápio | 6 h |
| 12 | `BreadcrumbList` global | 2 h |
| 13 | WebP/AVIF e correção do `sizes` | 4 h |
| 14 | Auditar e padronizar NAP nos 44 Google Business Profiles | 2 dias |

### Mês 2 — escalar

| # | Ação | Esforço |
|---|---|---|
| 15 | 44 páginas de unidade com `Restaurant` schema | 3 a 5 dias |
| 16 | Reescrever `/a-forneria-original` como página de entidade | 2 dias |
| 17 | `Article` schema em novidades | 3 h |
| 18 | Plano editorial de 12 conteúdos em formato pergunta-resposta | contínuo |

### Mês 3 — consolidar

| # | Ação |
|---|---|
| 19 | Avaliar migração de franquia para subpasta |
| 20 | Publicar `llms.txt` e `llms-full.txt` |
| 21 | Monitorar citação da marca em ChatGPT, Gemini, Perplexity e AI Overviews |

---

## Como medir

**Antes de qualquer alteração**, registrar a linha de base:

- Search Console: impressões, cliques, CTR médio e posição média dos últimos 90 dias
- Contagem de páginas indexadas
- Core Web Vitals (campo, não laboratório)
- Posição atual para o conjunto de termos-alvo por bairro
- Uma bateria de perguntas-teste em ChatGPT, Gemini e Perplexity ("melhor pizza delivery em Botafogo", "onde fica a Forneria Original em Recife") — registrar hoje que a marca não aparece, para poder comprovar a mudança depois

**Sinal mais rápido de que o desbloqueio funcionou:** monitorar os logs do Cloudflare filtrando por user-agent `GPTBot`, `ClaudeBot` e `PerplexityBot`. Se em 30 dias eles começarem a rastrear páginas, o canal abriu.

---

*Auditoria baseada em inspeção do HTML servido em 23/08/2026. Não inclui dados de Search Console, Analytics, perfil de backlinks nem volume de busca — com acesso a essas fontes a priorização pode ser refinada com dados reais em vez de inferência.*
