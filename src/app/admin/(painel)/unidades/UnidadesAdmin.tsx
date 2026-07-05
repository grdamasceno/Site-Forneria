"use client";

import { useMemo, useState, useTransition } from "react";
import { Modal, Toggle, ImageUploadButton, inputCls } from "@/components/admin/ui";
import { unitStates } from "@/lib/data";
import { saveUnidade, toggleAtivo, deleteUnidade, uploadFachada } from "./actions";

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
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  bairro: string | null;
  complemento: string | null;
  cidade: string | null;
  uf: string | null;
  horario: string | null;
  imagem: string | null;
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
        <Modal title={editing.id ? "Editar unidade" : "Nova unidade"} onClose={() => setEditing(null)} wide>
          <form action={(fd) => { start(() => saveUnidade(fd)); setEditing(null); }} className="space-y-3">
            {editing.id && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nº (código)"><input name="codigo" defaultValue={editing.codigo ?? ""} placeholder="ex.: CB01" className={inputCls} /></Field>
              <Field label="Gerente"><input name="gerente" defaultValue={editing.gerente ?? ""} className={inputCls} /></Field>
              <Field label="Contato"><input name="contato" defaultValue={editing.contato ?? ""} placeholder="(21) 99999-9999" className={inputCls} /></Field>
              <Field label="Email de acesso"><input name="email_acesso" type="email" defaultValue={editing.email_acesso ?? ""} className={inputCls} /></Field>
              <Field label="Razão Social"><input name="razao_social" defaultValue={editing.razao_social ?? ""} className={inputCls} /></Field>
              <Field label="CNPJ"><input name="cnpj" defaultValue={editing.cnpj ?? ""} placeholder="00.000.000/0000-00" className={inputCls} /></Field>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Estado">
                <select name="estado" defaultValue={editing.estado ?? ""} className={inputCls}>
                  <option value="">—</option>
                  {unitStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Região">
                <select name="region_id" defaultValue={editing.region_id ?? ""} className={inputCls}>
                  <option value="">—</option>
                  {regioes.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Nome da unidade">
              <input name="nome" defaultValue={editing.nome ?? ""} required className={inputCls} />
            </Field>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="CEP"><input name="cep" defaultValue={editing.cep ?? ""} className={inputCls} /></Field>
              <Field label="Logradouro"><input name="logradouro" defaultValue={editing.logradouro ?? ""} className={inputCls} /></Field>
              <Field label="Número"><input name="numero" defaultValue={editing.numero ?? ""} className={inputCls} /></Field>
              <Field label="Bairro"><input name="bairro" defaultValue={editing.bairro ?? ""} className={inputCls} /></Field>
              <Field label="Complemento"><input name="complemento" defaultValue={editing.complemento ?? ""} className={inputCls} /></Field>
              <Field label="Cidade"><input name="cidade" defaultValue={editing.cidade ?? ""} className={inputCls} /></Field>
              <Field label="UF"><input name="uf" defaultValue={editing.uf ?? ""} className={inputCls} /></Field>
            </div>
            <Field label="Funcionamento">
              <textarea name="horario" defaultValue={editing.horario ?? ""} rows={3} className={inputCls} />
            </Field>
            {editing.id && (
              <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
                <ImageUploadButton url={editing.imagem} uploadAction={uploadFachada} fields={{ id: editing.id, nome: editing.nome }} />
                <span className="text-sm text-forneria-black/70">Fachada da unidade (clique para trocar)</span>
              </div>
            )}
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Salvar</button>
            </div>
            {!editing.id && (
              <p className="text-xs text-forneria-black/50">A fachada pode ser adicionada após salvar (reabra a unidade em “editar”).</p>
            )}
          </form>
        </Modal>
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
