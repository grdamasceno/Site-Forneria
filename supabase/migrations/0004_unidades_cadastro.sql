-- Forneria Original — cadastro completo da unidade (modal de edição).
-- Rode no SQL Editor depois do 0003.
-- Complementa os campos do 0003 com os dados societários/fiscais e anexos.

alter table public.unidades add column if not exists inscricao_estadual text;
alter table public.unidades add column if not exists associado         text; -- nome do associado/responsável
alter table public.unidades add column if not exists cpf               text; -- CPF do representante
alter table public.unidades add column if not exists nome_fantasia     text;
alter table public.unidades add column if not exists nome_socio        text;
alter table public.unidades add column if not exists tel_socio         text;
alter table public.unidades add column if not exists email_secundario  text; -- "Email 2º"
alter table public.unidades add column if not exists porte             text; -- MEI, ME, PP, EPP...
alter table public.unidades add column if not exists restricao         text; -- "Sim" / "Não"
alter table public.unidades add column if not exists restricao_anexo   text; -- URL do documento anexado
alter table public.unidades add column if not exists fornecedor        text;
alter table public.unidades add column if not exists logo              text; -- URL da logo da unidade

-- Vínculo com o usuário de acesso (Supabase Auth). O e-mail de acesso da
-- unidade corresponde a um usuário; redefinir a senha altera esse usuário.
alter table public.unidades add column if not exists user_id uuid;

-- OBS.: `contato` (0003) = Tel. Gerente; `cidade` = Município; `logradouro` = Endereço.
