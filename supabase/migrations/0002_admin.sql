-- Forneria Original — extensões de schema para a retaguarda (admin).
-- Rode no SQL Editor depois do 0001.

-- Produtos: destaque "Sugestão da Semana", imagens destaque/mobile
alter table public.produtos add column if not exists semana          boolean not null default false;
alter table public.produtos add column if not exists destaque_imagem text;
alter table public.produtos add column if not exists imagem_mobile   text;

-- Unidades: endereço granular (modal de edição)
alter table public.unidades add column if not exists cep         text;
alter table public.unidades add column if not exists logradouro  text;
alter table public.unidades add column if not exists numero      text;
alter table public.unidades add column if not exists bairro      text;
alter table public.unidades add column if not exists complemento text;
alter table public.unidades add column if not exists uf          text;

-- Banners agrupados por página (home, franqueado, etc.) + carrossel
alter table public.banners add column if not exists pagina text not null default 'home';

-- Parceiros (Coca-cola, iFood, Seara, Catupiry, Scala, Nestlé...)
create table if not exists public.parceiros (
  id     uuid primary key default gen_random_uuid(),
  nome   text not null,
  imagem text,
  ordem  int not null default 0,
  ativo  boolean not null default true
);

-- Configurações chave/valor (Sobre Nós, Faturamento, etc.)
create table if not exists public.configuracoes (
  chave text primary key,
  valor text
);

-- E-mails vinculados aos formulários (franqueado pode ter vários)
create table if not exists public.form_emails (
  id         uuid primary key default gen_random_uuid(),
  formulario text not null check (formulario in ('franqueado','sac','trabalhe_conosco')),
  email      text not null,
  ordem      int not null default 0
);

-- RLS nas novas tabelas
alter table public.parceiros     enable row level security;
alter table public.configuracoes enable row level security;
alter table public.form_emails   enable row level security;

do $$
declare t text;
begin
  -- leitura pública: parceiros e configurações (exibidos no site)
  foreach t in array array['parceiros','configuracoes'] loop
    execute format('drop policy if exists "leitura publica" on public.%I;', t);
    execute format('drop policy if exists "escrita admin" on public.%I;', t);
    execute format('create policy "leitura publica" on public.%I for select using (true);', t);
    execute format('create policy "escrita admin" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- form_emails: leitura e escrita só do admin (não expor e-mails publicamente;
-- o envio dos formulários usa a service_role no servidor).
drop policy if exists "form_emails admin" on public.form_emails;
create policy "form_emails admin" on public.form_emails
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
