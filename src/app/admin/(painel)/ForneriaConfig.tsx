"use client";

import { useState, useTransition } from "react";
import { inputCls } from "@/components/admin/ui";
import {
  saveConfig,
  addEmail,
  deleteEmail,
  addParceiro,
  deleteParceiro,
} from "./actions";

export type Email = { id: string; formulario: string; email: string };
export type Parceiro = { id: string; nome: string; ordem: number; ativo: boolean };

const FORMS: { key: string; label: string }[] = [
  { key: "franqueado", label: "Formulário Franqueado" },
  { key: "sac", label: "Formulário SAC" },
  { key: "trabalhe_conosco", label: "Formulário Trabalhe Conosco" },
];

export default function ForneriaConfig({
  sobreNos,
  faturamento,
  emails,
  parceiros,
}: {
  sobreNos: string;
  faturamento: string;
  emails: Email[];
  parceiros: Parceiro[];
}) {
  const [, start] = useTransition();
  const [novoEmail, setNovoEmail] = useState<Record<string, string>>({});
  const [novoParceiro, setNovoParceiro] = useState("");
  const [ordemParceiro, setOrdemParceiro] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-forneria-black">A Forneria Original</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sobre + faturamento */}
        <form
          action={(fd) => start(() => saveConfig(fd))}
          className="space-y-4 rounded-lg bg-white p-5 shadow-sm lg:col-span-2"
        >
          <h2 className="font-bold uppercase text-forneria-black/70">Sobre nós / Faturamento</h2>
          <label className="block text-sm">
            <span className="mb-1 block text-forneria-black/70">Sobre nós</span>
            <textarea name="sobre_nos" defaultValue={sobreNos} rows={8} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-forneria-black/70">Faturamento</span>
            <input name="faturamento" defaultValue={faturamento} className={inputCls} />
          </label>
          <button type="submit" className="rounded-full bg-forneria-red px-6 py-2 font-bold text-white">Salvar</button>
        </form>

        {/* Parceiros */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold uppercase text-forneria-black/70">Parceiros</h2>
          <ul className="mb-3 space-y-1">
            {parceiros.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded border border-gray-200 px-3 py-1.5 text-sm">
                <span>{p.nome}</span>
                <span className="flex items-center gap-3 text-forneria-black/50">
                  <span>ordem {p.ordem}</span>
                  <button onClick={() => start(() => deleteParceiro(p.id))} className="hover:text-forneria-red">×</button>
                </span>
              </li>
            ))}
            {parceiros.length === 0 && <li className="text-sm text-forneria-black/50">Nenhum parceiro.</li>}
          </ul>
          <div className="flex gap-2">
            <input value={novoParceiro} onChange={(e) => setNovoParceiro(e.target.value)} placeholder="Nome" className={inputCls} />
            <input value={ordemParceiro} onChange={(e) => setOrdemParceiro(e.target.value)} placeholder="Ordem" type="number" className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm" />
            <button
              onClick={() => { start(() => addParceiro(novoParceiro, Number(ordemParceiro))); setNovoParceiro(""); setOrdemParceiro(""); }}
              className="rounded-md bg-forneria-red px-3 text-white"
            >+</button>
          </div>
        </div>
      </div>

      {/* E-mails dos formulários */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold uppercase text-forneria-black/70">E-mails dos formulários</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FORMS.map((f) => {
            const list = emails.filter((e) => e.formulario === f.key);
            return (
              <div key={f.key}>
                <p className="mb-2 font-semibold text-forneria-red">{f.label}</p>
                <ul className="mb-2 space-y-1">
                  {list.map((e) => (
                    <li key={e.id} className="flex items-center justify-between rounded border border-gray-200 px-3 py-1.5 text-sm">
                      <span className="truncate">{e.email}</span>
                      <button onClick={() => start(() => deleteEmail(e.id))} className="text-forneria-black/40 hover:text-forneria-red">×</button>
                    </li>
                  ))}
                  {list.length === 0 && <li className="text-xs text-forneria-black/40">Nenhum e-mail.</li>}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={novoEmail[f.key] ?? ""}
                    onChange={(e) => setNovoEmail({ ...novoEmail, [f.key]: e.target.value })}
                    placeholder="e-mail"
                    className={inputCls}
                  />
                  <button
                    onClick={() => { start(() => addEmail(f.key, novoEmail[f.key] ?? "")); setNovoEmail({ ...novoEmail, [f.key]: "" }); }}
                    className="rounded-md bg-forneria-red px-3 text-white"
                  >+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
