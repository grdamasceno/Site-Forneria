"use client";

import { useState, useTransition } from "react";
import { Modal, Toggle, ImageUploadButton, inputCls } from "@/components/admin/ui";
import { saveMarca, toggleAtiva, deleteMarca, uploadLogoMarca } from "./actions";

export type AdminMarca = {
  id: string;
  nome: string;
  descricao: string | null;
  imagem: string | null;
  ordem: number;
  ativo: boolean;
};

export default function MarcasAdmin({ marcas }: { marcas: AdminMarca[] }) {
  const [editing, setEditing] = useState<AdminMarca | null>(null);
  const [, start] = useTransition();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
        <h1 className="text-lg font-bold text-forneria-black">Marcas</h1>
        <button onClick={() => setEditing({ id: "", ordem: marcas.length } as AdminMarca)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">Logo</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Ativa</th>
              <th className="p-3">Ordem</th>
              <th className="p-3">Editar</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-forneria-gray/40">
                <td className="p-3"><ImageUploadButton url={m.imagem} uploadAction={uploadLogoMarca} fields={{ id: m.id, nome: m.nome }} /></td>
                <td className="p-3 font-medium text-forneria-black">{m.nome}</td>
                <td className="p-3"><Toggle on={m.ativo} onClick={() => start(() => toggleAtiva(m.id, !m.ativo))} /></td>
                <td className="p-3 text-forneria-black/60">{m.ordem}</td>
                <td className="p-3"><button onClick={() => setEditing(m)} className="text-forneria-red hover:underline">editar</button></td>
                <td className="p-3"><button onClick={() => { if (confirm(`Excluir "${m.nome}"?`)) start(() => deleteMarca(m.id)); }} className="text-gray-400 hover:text-forneria-red">🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing.id ? "Editar marca" : "Nova marca"} onClose={() => setEditing(null)} wide>
          <form action={(fd) => { start(() => saveMarca(fd)); setEditing(null); }} className="space-y-3">
            {editing.id && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
              <label className="block text-sm">
                <span className="mb-1 block text-forneria-black/70">Nome</span>
                <input name="nome" defaultValue={editing.nome ?? ""} required className={inputCls} />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-forneria-black/70">Ordem</span>
                <input name="ordem" type="number" defaultValue={editing.ordem ?? 0} className={inputCls} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Descrição</span>
              <textarea name="descricao" defaultValue={editing.descricao ?? ""} rows={6} className={inputCls} />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Salvar</button>
            </div>
            {!editing.id && <p className="text-xs text-forneria-black/50">O logo é adicionado na lista (miniatura) após salvar.</p>}
          </form>
        </Modal>
      )}
    </div>
  );
}
