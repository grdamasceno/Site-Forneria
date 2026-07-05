-- Forneria Original — campos administrativos das unidades (franqueados).
-- Rode no SQL Editor depois do 0002.
-- Colunas exibidas na lista da retaguarda: Nº, Gerente, Contato, Razão Social,
-- CNPJ, Email de Acesso (endereço/número já existem).

alter table public.unidades add column if not exists codigo       text; -- Nº (ex.: CB01)
alter table public.unidades add column if not exists gerente      text;
alter table public.unidades add column if not exists contato      text; -- telefone de contato da unidade
alter table public.unidades add column if not exists razao_social text;
alter table public.unidades add column if not exists cnpj         text;
alter table public.unidades add column if not exists email_acesso text;
