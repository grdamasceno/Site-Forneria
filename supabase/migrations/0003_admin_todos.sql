-- Forneria Original — acesso total para todos os usuários da retaguarda.
-- Rode no SQL Editor (projeto correto) depois do 0002.
--
-- Antes: is_admin() só reconhecia thais@onchannel.io, então o RLS bloqueava
-- gravações (excluir/desativar/editar) de qualquer outro login.
-- Agora: qualquer usuário AUTENTICADO (todos têm conta no backoffice) tem
-- domínio total de escrita, igual ao administrador principal.

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null;
$$;
