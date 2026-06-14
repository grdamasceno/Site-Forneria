# Site Forneria Original

Recriação do site da **Forneria Original** em **Next.js (App Router) + TypeScript + Tailwind CSS**.

## Fase 1 — Estático

Esta fase usa **conteúdo fixo** e **imagens placeholder** (via `picsum.photos`). Nenhum
banco de dados está conectado ainda. Todo o conteúdo estático fica centralizado em
[`src/lib/data.ts`](src/lib/data.ts) para facilitar a futura migração para um CMS/API.

## Rodando o projeto

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run lint
```

> Requer Node 18.18+.

## Estrutura

```
src/
  app/
    layout.tsx              # layout raiz (Header, Footer, botão delivery)
    page.tsx                # Home (carrossel + seções)
    cardapio/               # Cardápio (filtros + busca)
    unidades/               # Unidades (abas por estado)
    nossas-marcas/          # Nossas Marcas (seções alternadas)
    novidades/              # Blog (post principal + sidebar)
    sac/                    # Contato (formulário + mapa)
    a-forneria-original/    # Institucional
    seja-um-franqueado/     # Franquias
  components/               # Header, Footer, HeroBanner, Carousel,
                            # ProductCard, UnitCard, ContentSection, etc.
  lib/data.ts               # Conteúdo estático (nav, cidades, produtos, etc.)
```

## Identidade visual

- Vermelho `#CC0000`, preto, branco, cinza claro.
- Fonte: Poppins.
- Cores configuradas em [`tailwind.config.ts`](tailwind.config.ts) como `forneria.*`.

## Próximas fases

- Conectar conteúdo dinâmico (cardápio, unidades, blog) a uma API/CMS.
- Páginas de detalhe de post (`/novidades/[slug]`) e produto.
- Integração do formulário SAC com backend.
