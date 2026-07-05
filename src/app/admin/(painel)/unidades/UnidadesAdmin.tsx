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

  const filtered = useMemo(
    () => unidades.filter((u) => u.nome.toLowerCase().includes(query.toLowerCase())),
    [unidades, query],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque pelo nome" className={`${inputCls} flex-1`} />
        <button onClick={() => setEditing({ id: "" } as AdminUnidade)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">Nome</th>
              <th className="p-3">Ativo</th>
              <th className="p-3">Funcionamento</th>
              <th className="p-3">Fachada</th>
              <th className="p-3">Editar</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b last:border-0 align-top hover:bg-forneria-gray/40">
                <td className="p-3 font-medium text-forneria-black">{u.nome}</td>
                <td className="p-3"><Toggle on={u.ativo} onClick={() => start(() => toggleAtivo(u.id, !u.ativo))} /></td>
                <td className="max-w-xs p-3 text-xs text-forneria-black/60">{u.horario}</td>
                <td className="p-3">
                  <ImageUploadButton url={u.imagem} uploadAction={uploadFachada} fields={{ id: u.id, nome: u.nome }} />
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
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Salvar</button>
            </div>
            {editing.id && (
              <p className="text-xs text-forneria-black/50">A fachada é alterada na lista (miniatura).</p>
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
