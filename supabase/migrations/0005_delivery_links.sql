-- Forneria Original — plataformas de delivery (iFood, DD, Olga...) e os
-- links de cada unidade nelas.
-- Rode no SQL Editor (projeto correto) depois do 0004.

-- "Nomenclaturas" — hoje iFood/DD/Olga, mas o nome e o ícone são editáveis
-- pelo admin, e novas plataformas podem ser criadas no futuro.
create table if not exists public.delivery_plataformas (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  icone      text,
  ordem      int not null default 0,
  created_at timestamptz not null default now()
);

-- Um link por unidade+plataforma. unidade_id é opcional de propósito: um
-- link sem unidade vinculada existe só na tela de cadastro, não aparece em
-- lugar nenhum do site público.
create table if not exists public.delivery_links (
  id            uuid primary key default gen_random_uuid(),
  plataforma_id uuid not null references public.delivery_plataformas(id) on delete cascade,
  unidade_id    uuid references public.unidades(id) on delete set null,
  url           text not null,
  created_at    timestamptz not null default now()
);

alter table public.delivery_plataformas enable row level security;
alter table public.delivery_links       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['delivery_plataformas','delivery_links'] loop
    execute format('drop policy if exists "leitura publica" on public.%I;', t);
    execute format('drop policy if exists "escrita admin" on public.%I;', t);
    execute format('create policy "leitura publica" on public.%I for select using (true);', t);
    execute format('create policy "escrita admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Seed das 3 plataformas de hoje (idempotente — não duplica se já existir).
insert into public.delivery_plataformas (nome, ordem)
select v.nome, v.ordem
from (values ('iFood', 1), ('DD', 2), ('Olga', 3)) as v(nome, ordem)
where not exists (
  select 1 from public.delivery_plataformas where nome = v.nome
);
