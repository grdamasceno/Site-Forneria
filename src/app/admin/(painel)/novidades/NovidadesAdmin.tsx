"use client";

import { useState, useTransition } from "react";
import { Modal, Toggle, ImageUploadButton, inputCls } from "@/components/admin/ui";
import { savePost, togglePublicado, deletePost, uploadImagemPost } from "./actions";

export type AdminPost = {
  id: string;
  slug: string;
  titulo: string;
  data: string | null;
  resumo: string | null;
  conteudo: string | null;
  imagem: string | null;
  publicado: boolean;
};

export default function NovidadesAdmin({ posts }: { posts: AdminPost[] }) {
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [, start] = useTransition();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-3 shadow-sm">
        <h1 className="text-lg font-bold text-forneria-black">Novidades</h1>
        <button onClick={() => setEditing({ id: "" } as AdminPost)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">Título</th>
              <th className="p-3">Imagem</th>
              <th className="p-3">Publicado</th>
              <th className="p-3">Data</th>
              <th className="p-3">Editar</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-forneria-gray/40">
                <td className="max-w-sm p-3 font-medium text-forneria-black">{p.titulo}</td>
                <td className="p-3">
                  <ImageUploadButton url={p.imagem} uploadAction={uploadImagemPost} fields={{ id: p.id, slug: p.slug }} />
                </td>
                <td className="p-3"><Toggle on={p.publicado} onClick={() => start(() => togglePublicado(p.id, !p.publicado))} /></td>
                <td className="p-3 text-xs text-forneria-black/60">{p.data}</td>
                <td className="p-3"><button onClick={() => setEditing(p)} className="text-forneria-red hover:underline">editar</button></td>
                <td className="p-3"><button onClick={() => { if (confirm(`Excluir "${p.titulo}"?`)) start(() => deletePost(p.id)); }} className="text-gray-400 hover:text-forneria-red">🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-forneria-black/50">{posts.length} post(s)</p>

      {editing && (
        <Modal title={editing.id ? "Editar novidade" : "Nova novidade"} onClose={() => setEditing(null)} wide>
          <form action={(fd) => { start(() => savePost(fd)); setEditing(null); }} className="space-y-3">
            {editing.id && <input type="hidden" name="id" value={editing.id} />}
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Título</span>
              <input name="titulo" defaultValue={editing.titulo ?? ""} required className={inputCls} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Data</span>
              <input name="data" defaultValue={editing.data ?? ""} placeholder="ex.: 14 de junho de 2026" className={inputCls} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Resumo (aparece nos cards)</span>
              <textarea name="resumo" defaultValue={editing.resumo ?? ""} rows={2} className={inputCls} />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Conteúdo (um parágrafo por linha)</span>
              <textarea name="conteudo" defaultValue={editing.conteudo ?? ""} rows={8} className={inputCls} />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Salvar</button>
            </div>
            {!editing.id && <p className="text-xs text-forneria-black/50">A imagem é adicionada na lista (miniatura) após salvar.</p>}
          </form>
        </Modal>
      )}
    </div>
  );
}
