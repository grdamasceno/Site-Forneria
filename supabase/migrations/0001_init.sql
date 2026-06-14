-- Forneria Original — schema inicial
-- Rode no Supabase: Dashboard → SQL Editor → New query → cole tudo → Run.
-- Leitura: pública. Escrita: somente o administrador (e-mail definido abaixo).

-- ───────────────────────── Tabelas ─────────────────────────

create table if not exists public.regioes (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null unique,
  telefone   text,
  created_at timestamptz not null default now()
);

create table if not exists public.unidades (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  estado     text,
  cidade     text,
  endereco   text,
  horario    text,
  imagem     text,
  region_id  uuid references public.regioes(id) on delete set null,
  ativo      boolean not null default true,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.produtos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  slug         text not null unique,
  categoria    text not null check (categoria in ('pizza-salgada','pizza-doce','vegana','fornerito')),
  imagem       text,
  ingredientes text,
  ativo        boolean not null default true,
  ordem        int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.produto_nutricao (
  id                 uuid primary key default gen_random_uuid(),
  produto_id         uuid not null references public.produtos(id) on delete cascade,
  tamanho            text,
  porcao             text,
  carboidratos       text,
  proteinas          text,
  gorduras_totais    text,
  gorduras_saturadas text,
  fibras             text,
  calorias_kcal      text,
  gorduras_trans     text,
  sodio              text,
  calorias_kj        text
);

create table if not exists public.posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  titulo     text not null,
  data       text,
  resumo     text,
  conteudo   text,
  imagem     text,
  publicado  boolean not null default true,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.marcas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  descricao  text,
  imagem     text,
  ordem      int not null default 0,
  ativo      boolean not null default true
);

create table if not exists public.banners (
  id            uuid primary key default gen_random_uuid(),
  alt           text,
  imagem        text not null,
  imagem_mobile text,
  href          text,
  ordem         int not null default 0,
  ativo         boolean not null default true
);

-- Imagens editáveis das páginas (banners internos, backgrounds, etc.)
create table if not exists public.page_assets (
  id        uuid primary key default gen_random_uuid(),
  chave     text not null unique,
  descricao text,
  imagem    text
);

-- ───────────────────────── RLS ─────────────────────────

alter table public.regioes          enable row level security;
alter table public.unidades         enable row level security;
alter table public.produtos         enable row level security;
alter table public.produto_nutricao enable row level security;
alter table public.posts            enable row level security;
alter table public.marcas           enable row level security;
alter table public.banners          enable row level security;
alter table public.page_assets      enable row level security;

-- Função: o usuário autenticado é o administrador?
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'thais@onchannel.io';
$$;

-- Policies (leitura pública + escrita só admin) para cada tabela
do $$
declare t text;
begin
  foreach t in array array[
    'regioes','unidades','produtos','produto_nutricao','posts','marcas','banners','page_assets'
  ] loop
    execute format('drop policy if exists "leitura publica" on public.%I;', t);
    execute format('drop policy if exists "escrita admin" on public.%I;', t);
    execute format('create policy "leitura publica" on public.%I for select using (true);', t);
    execute format('create policy "escrita admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- ───────────────────── Storage (escrita só admin) ─────────────────────
-- Os buckets já foram criados como públicos (leitura liberada).
-- Estas policies restringem o UPLOAD/edição aos buckets do projeto ao admin.

drop policy if exists "storage leitura publica" on storage.objects;
create policy "storage leitura publica" on storage.objects
  for select using (bucket_id in ('cardapio','unidades','blog','marcas','banners','paginas'));

drop policy if exists "storage escrita admin" on storage.objects;
create policy "storage escrita admin" on storage.objects
  for all to authenticated
  using (bucket_id in ('cardapio','unidades','blog','marcas','banners','paginas') and public.is_admin())
  with check (bucket_id in ('cardapio','unidades','blog','marcas','banners','paginas') and public.is_admin());
