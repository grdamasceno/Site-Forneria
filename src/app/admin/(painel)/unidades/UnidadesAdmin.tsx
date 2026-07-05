"use client";

import { useMemo, useState, useTransition } from "react";
import { Modal, Toggle, ImageUploadButton, inputCls } from "@/components/admin/ui";
import { unitStates } from "@/lib/data";
import {
  saveUnidade,
  toggleAtivo,
  deleteUnidade,
  uploadFachada,
  uploadLogo,
  uploadRestricaoAnexo,
  deleteRestricaoAnexo,
  resetSenhaUnidade,
} from "./actions";

const PORTES = ["MEI", "ME", "PP", "EPP", "Outro"];

export type Regiao = { id: string; nome: string };
export type AdminUnidade = {
  id: string;
  nome: string;
  estado: string | null;
  region_id: string | null;
  codigo: string | null;
  gerente: string | null;
  contato: string | null;
  razao_social: string | null;
  cnpj: string | null;
  email_acesso: string | null;
  inscricao_estadual: string | null;
  associado: string | null;
  cpf: string | null;
  nome_fantasia: string | null;
  nome_socio: string | null;
  tel_socio: string | null;
  email_secundario: string | null;
  porte: string | null;
  restricao: string | null;
  restricao_anexo: string | null;
  fornecedor: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  complemento: string | null;
  cidade: string | null;
  uf: string | null;
  horario: string | null;
  imagem: string | null;
  logo: string | null;
  ativo: boolean;
};

export default function UnidadesAdmin({ unidades, regioes }: { unidades: AdminUnidade[]; regioes: Regiao[] }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminUnidade | null>(null);
  const [, start] = useTransition();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return unidades;
    return unidades.filter((u) =>
      [u.nome, u.codigo, u.gerente, u.razao_social, u.cnpj, u.email_acesso]
        .some((f) => (f ?? "").toLowerCase().includes(q)),
    );
  }, [unidades, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque pelo nome" className={`${inputCls} flex-1`} />
        <button onClick={() => setEditing({ id: "" } as AdminUnidade)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">Nº</th>
              <th className="p-3">Gerente</th>
              <th className="p-3">Contato</th>
              <th className="p-3">Razão Social</th>
              <th className="p-3">CNPJ</th>
              <th className="p-3">Endereço</th>
              <th className="p-3">Número</th>
              <th className="p-3">Email Acesso</th>
              <th className="p-3">Status</th>
              <th className="p-3">Editar</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b last:border-0 align-top hover:bg-forneria-gray/40">
                <td className="whitespace-nowrap p-3 font-bold text-forneria-black">{u.codigo || "—"}</td>
                <td className="p-3 text-forneria-black/80">{u.gerente || "—"}</td>
                <td className="whitespace-nowrap p-3 text-forneria-black/80">{u.contato || "—"}</td>
                <td className="max-w-[220px] p-3 text-xs uppercase text-forneria-black/70">{u.razao_social || "—"}</td>
                <td className="whitespace-nowrap p-3 text-forneria-black/70">{u.cnpj || "—"}</td>
                <td className="max-w-[200px] p-3 uppercase text-forneria-black/70">{u.logradouro || "—"}</td>
                <td className="p-3 text-forneria-black/70">{u.numero || "—"}</td>
                <td className="whitespace-nowrap p-3 text-forneria-black/70">{u.email_acesso || "—"}</td>
                <td className="p-3">
                  <span className="flex items-center gap-2">
                    <Toggle on={u.ativo} onClick={() => start(() => toggleAtivo(u.id, !u.ativo))} />
                    <span className={`text-xs font-bold ${u.ativo ? "text-green-600" : "text-gray-400"}`}>
                      {u.ativo ? "ATIVO" : "INATIVO"}
                    </span>
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => setEditing(u)} className="text-forneria-red underline-offset-2 hover:underline">editar</button>
                </td>
                <td className="p-3">
                  <button onClick={() => { if (confirm(`Excluir "${u.nome}"?`)) start(() => deleteUnidade(u.id)); }} className="text-gray-400 hover:text-forneria-red">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-forneria-black/50">{filtered.length} unidade(s)</p>

      {editing && (
        <EditModal unidade={editing} regioes={regioes} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-forneria-black/70">{label}</span>
      {children}
    </label>
  );
}

function EditModal({
  unidade,
  regioes,
  onClose,
}: {
  unidade: AdminUnidade;
  regioes: Regiao[];
  onClose: () => void;
}) {
  const isNew = !unidade.id;
  const [, start] = useTransition();
  const [ativo, setAtivo] = useState(unidade.ativo ?? true);
  const [emailAcesso, setEmailAcesso] = useState(unidade.email_acesso ?? "");

  // Reset de senha (vinculada ao usuário de acesso)
  const [resetOpen, setResetOpen] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [resetMsg, setResetMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [resetPending, startReset] = useTransition();

  function doReset() {
    setResetMsg(null);
    startReset(async () => {
      const r = await resetSenhaUnidade(unidade.id, emailAcesso, novaSenha);
      setResetMsg({ ok: r.ok, text: r.message });
      if (r.ok) setNovaSenha("");
    });
  }

  // Anexo de restrição
  const [anexoPending, startAnexo] = useTransition();
  function uploadAnexo(file: File) {
    const fd = new FormData();
    fd.set("id", unidade.id);
    fd.set("file", file);
    startAnexo(() => uploadRestricaoAnexo(fd));
  }

  const cartaStub = (nome: string) =>
    alert(`"${nome}" — o disparo deste documento será configurado em breve.`);

  return (
    <Modal title={isNew ? "Nova unidade" : `Editar unidade ${unidade.codigo ?? ""}`.trim()} onClose={onClose} wide>
      <form action={(fd) => { start(() => saveUnidade(fd)); onClose(); }} className="space-y-4">
        {!isNew && <input type="hidden" name="id" value={unidade.id} />}
        <input type="hidden" name="ativo" value={String(ativo)} />

        {/* Cabeçalho: logo + código + status */}
        <div className="flex flex-wrap items-center gap-4 border-b pb-4">
          {!isNew ? (
            <ImageUploadButton url={unidade.logo} uploadAction={uploadLogo} fields={{ id: unidade.id, nome: unidade.nome }} />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded border border-dashed border-gray-400 text-[10px] text-gray-400">LOGO</span>
          )}
          <label className="text-sm">
            <span className="mb-1 block text-forneria-black/70">Nº (código)</span>
            <input name="codigo" defaultValue={unidade.codigo ?? ""} placeholder="ex.: CB01" className={`${inputCls} w-28`} />
          </label>
          <div className="flex items-center gap-2">
            <Toggle on={ativo} onClick={() => setAtivo((a) => !a)} />
            <span className={`text-sm font-bold ${ativo ? "text-green-600" : "text-gray-400"}`}>
              {ativo ? "Unidade Ativa!" : "Inativa"}
            </span>
          </div>
        </div>

        {/* Duas colunas: fiscal/societário */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="CNPJ"><input name="cnpj" defaultValue={unidade.cnpj ?? ""} placeholder="00.000.000/0000-00" className={inputCls} /></Field>
          <Field label="Associado"><input name="associado" defaultValue={unidade.associado ?? ""} className={inputCls} /></Field>
          <Field label="Inscr. Estadual"><input name="inscricao_estadual" defaultValue={unidade.inscricao_estadual ?? ""} className={inputCls} /></Field>
          <Field label="CPF (representante)"><input name="cpf" defaultValue={unidade.cpf ?? ""} className={inputCls} /></Field>
          <Field label="Razão Social"><input name="razao_social" defaultValue={unidade.razao_social ?? ""} className={inputCls} /></Field>
          <Field label="Email Acesso">
            <input name="email_acesso" type="email" value={emailAcesso} onChange={(e) => setEmailAcesso(e.target.value)} className={inputCls} />
          </Field>
        </div>

        {/* Redefinir senha */}
        <div className="rounded-md border border-gray-200 p-3">
          {!resetOpen ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-forneria-black/70">🔑 Redefinir senha</span>
              <button
                type="button"
                disabled={isNew}
                onClick={() => setResetOpen(true)}
                className="rounded-md bg-forneria-red px-4 py-1.5 text-sm font-bold text-white disabled:opacity-40"
                title={isNew ? "Salve a unidade primeiro" : "Redefinir a senha do usuário vinculado"}
              >
                Reset 🔑
              </button>
              {isNew && <span className="text-xs text-forneria-black/50">salve a unidade primeiro</span>}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-forneria-black/60">
                Define a senha do usuário <strong>{emailAcesso || "(sem e-mail)"}</strong> (login desta unidade).
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha (mín. 6)"
                  className={`${inputCls} w-56`}
                />
                <button type="button" onClick={doReset} disabled={resetPending} className="rounded-md bg-forneria-red px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                  {resetPending ? "..." : "Confirmar"}
                </button>
                <button type="button" onClick={() => { setResetOpen(false); setResetMsg(null); }} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
              </div>
              {resetMsg && (
                <p className={`text-xs ${resetMsg.ok ? "text-green-600" : "text-forneria-red"}`}>{resetMsg.text}</p>
              )}
            </div>
          )}
        </div>

        {/* Identificação comercial */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nome Fantasia"><input name="nome_fantasia" defaultValue={unidade.nome_fantasia ?? ""} className={inputCls} /></Field>
          <Field label="Nome da unidade (exibido no site)"><input name="nome" defaultValue={unidade.nome ?? ""} required className={inputCls} /></Field>
        </div>

        {/* Endereço */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Endereço (logradouro)"><input name="logradouro" defaultValue={unidade.logradouro ?? ""} className={inputCls} /></Field>
          <Field label="Complemento"><input name="complemento" defaultValue={unidade.complemento ?? ""} className={inputCls} /></Field>
          <Field label="CEP"><input name="cep" defaultValue={unidade.cep ?? ""} className={inputCls} /></Field>
          <Field label="Bairro"><input name="bairro" defaultValue={unidade.bairro ?? ""} className={inputCls} /></Field>
          <Field label="Número"><input name="numero" defaultValue={unidade.numero ?? ""} className={inputCls} /></Field>
          <Field label="UF"><input name="uf" defaultValue={unidade.uf ?? ""} className={inputCls} /></Field>
          <Field label="Município (cidade)"><input name="cidade" defaultValue={unidade.cidade ?? ""} className={inputCls} /></Field>
        </div>

        {/* Gerente / sócio */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Nome Gerente"><input name="gerente" defaultValue={unidade.gerente ?? ""} className={inputCls} /></Field>
          <Field label="Nome Sócio"><input name="nome_socio" defaultValue={unidade.nome_socio ?? ""} className={inputCls} /></Field>
          <Field label="Tel. Gerente"><input name="contato" defaultValue={unidade.contato ?? ""} placeholder="(21) 99999-9999" className={inputCls} /></Field>
          <Field label="Tel. Sócio"><input name="tel_socio" defaultValue={unidade.tel_socio ?? ""} className={inputCls} /></Field>
          <Field label="Email 2º"><input name="email_secundario" type="email" defaultValue={unidade.email_secundario ?? ""} placeholder="email@email.com" className={inputCls} /></Field>
          <Field label="Porte">
            <select name="porte" defaultValue={unidade.porte ?? ""} className={inputCls}>
              <option value="">—</option>
              {PORTES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* Restrição + anexo */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Restrição">
            <select name="restricao" defaultValue={unidade.restricao ?? ""} className={inputCls}>
              <option value="">—</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </Field>
          <div className="text-sm">
            <span className="mb-1 block text-forneria-black/70">Restrição — anexo</span>
            {unidade.restricao_anexo ? (
              <div className="flex items-center gap-3">
                <a href={unidade.restricao_anexo} target="_blank" rel="noopener noreferrer" className="text-forneria-red underline">👁 ver anexo</a>
                <button type="button" onClick={() => start(() => deleteRestricaoAnexo(unidade.id))} className="text-gray-400 hover:text-forneria-red">🗑</button>
              </div>
            ) : isNew ? (
              <span className="text-xs text-forneria-black/50">Disponível após salvar.</span>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-forneria-red">
                <span className="rounded border border-forneria-red px-3 py-1.5">{anexoPending ? "enviando..." : "Anexar arquivo"}</span>
                <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAnexo(f); }} />
              </label>
            )}
          </div>
          <Field label="Fornecedor"><input name="fornecedor" defaultValue={unidade.fornecedor ?? ""} className={inputCls} /></Field>
        </div>

        {/* Exibição no site */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Estado (agrupamento no site)">
            <select name="estado" defaultValue={unidade.estado ?? ""} className={inputCls}>
              <option value="">—</option>
              {unitStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Região (telefone)">
            <select name="region_id" defaultValue={unidade.region_id ?? ""} className={inputCls}>
              <option value="">—</option>
              {regioes.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Funcionamento">
          <textarea name="horario" defaultValue={unidade.horario ?? ""} rows={2} className={inputCls} />
        </Field>
        {!isNew && (
          <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
            <ImageUploadButton url={unidade.imagem} uploadAction={uploadFachada} fields={{ id: unidade.id, nome: unidade.nome }} />
            <span className="text-sm text-forneria-black/70">Fachada da unidade (clique para trocar)</span>
          </div>
        )}

        {/* Documentos / notificações (a configurar) */}
        <div className="grid grid-cols-1 gap-2 border-t pt-4 sm:grid-cols-2">
          <button type="button" onClick={() => cartaStub("Carta Responsabilidade")} className="rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white">Carta Responsabilidade ✉</button>
          <button type="button" onClick={() => cartaStub("Notificação de Bloqueio")} className="rounded-md bg-forneria-red px-4 py-2 text-sm font-bold text-white">Notificação de Bloqueio ✈</button>
          <button type="button" onClick={() => cartaStub("Carta Associação")} className="rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white">Carta Associação ✉</button>
          <button type="button" onClick={() => cartaStub("Carta de Exclusão")} className="rounded-md bg-forneria-red px-4 py-2 text-sm font-bold text-white">Carta de Exclusão ✈</button>
        </div>

        <div className="flex justify-end border-t pt-4">
          <button type="submit" className="rounded-md bg-forneria-red px-8 py-2 font-bold text-white">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
