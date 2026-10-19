"use client";

import { useMemo, useState, useTransition } from "react";
import { Modal, inputCls, ImageUploadButton } from "@/components/admin/ui";
import { slugify } from "@/lib/data";
import {
  savePlataforma,
  setPlataformaIcone,
  deletePlataforma,
  saveLink,
  deleteLink,
} from "./actions";

export type Plataforma = { id: string; nome: string; icone: string | null; ordem: number };
export type UnidadeOption = { id: string; nome: string };
export type AdminLink = {
  id: string;
  url: string;
  unidade_id: string | null;
  plataforma_id: string;
  unidade_nome: string | null;
  plataforma_nome: string;
};

export default function LinksDeliveryAdmin({
  plataformas,
  links,
  unidades,
}: {
  plataformas: Plataforma[];
  links: AdminLink[];
  unidades: UnidadeOption[];
}) {
  const [, start] = useTransition();
  const [novaPlataforma, setNovaPlataforma] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<AdminLink | { id: ""; unidade_id: null; plataforma_id: ""; url: "" } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter(
      (l) =>
        (l.unidade_nome ?? "").toLowerCase().includes(q) ||
        l.plataforma_nome.toLowerCase().includes(q),
    );
  }, [links, query]);

  const semUnidade = links.filter((l) => !l.unidade_id).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-forneria-black">Links Delivery</h1>

      {/* Plataformas (nomenclaturas) */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-1 font-bold uppercase text-forneria-black/70">Plataformas</h2>
        <p className="mb-4 text-xs text-forneria-black/50">
          O nome e o ícone aqui valem para os links de todas as unidades nessa plataforma.
        </p>
        <div className="flex flex-wrap gap-4">
          {plataformas.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
              <ImageUploadButton
                url={p.icone}
                bucket="marcas"
                buildPath={(f) => `delivery/${slugify(p.nome) || p.id}.${f.name.split(".").pop() || "png"}`}
                save={(url) => setPlataformaIcone(p.id, url)}
              />
              <div className="flex flex-col gap-1">
                <EditableNomePlataforma plataforma={p} />
                <button
                  onClick={() => {
                    if (confirm(`Excluir a plataforma "${p.nome}"? Os links dela também somem.`)) {
                      start(() => deletePlataforma(p.id));
                    }
                  }}
                  className="text-left text-xs text-forneria-black/40 hover:text-forneria-red"
                >
                  Excluir plataforma
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={novaPlataforma}
            onChange={(e) => setNovaPlataforma(e.target.value)}
            placeholder="Nome da nova plataforma"
            className={`${inputCls} max-w-xs`}
          />
          <button
            onClick={() => {
              if (!novaPlataforma.trim()) return;
              const fd = new FormData();
              fd.set("nome", novaPlataforma.trim());
              fd.set("ordem", String(plataformas.length));
              start(() => savePlataforma(fd));
              setNovaPlataforma("");
            }}
            className="rounded-md bg-forneria-red px-4 text-sm font-bold text-white"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Links por unidade */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold uppercase text-forneria-black/70">Links por unidade</h2>
            {semUnidade > 0 && (
              <p className="text-xs text-forneria-black/50">
                {semUnidade} link(s) sem unidade vinculada — não aparecem no site, só aqui.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por unidade ou plataforma"
              className={`${inputCls} w-64`}
            />
            <button
              onClick={() => setEditing({ id: "", unidade_id: null, plataforma_id: "", url: "" })}
              className="whitespace-nowrap rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white"
            >
              Adicionar +
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-forneria-gray/40 text-left text-xs uppercase text-forneria-black/60">
                <th className="p-3">Unidade</th>
                <th className="p-3">Plataforma</th>
                <th className="p-3">URL</th>
                <th className="p-3">Editar</th>
                <th className="p-3">Excluir</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b last:border-0 align-top hover:bg-forneria-gray/40">
                  <td className="p-3">
                    {l.unidade_nome ?? (
                      <span className="italic text-forneria-black/40">— sem unidade —</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{l.plataforma_nome}</td>
                  <td className="max-w-xs truncate p-3 text-forneria-black/60">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {l.url}
                    </a>
                  </td>
                  <td className="p-3">
                    <button onClick={() => setEditing(l)} className="text-forneria-red underline-offset-2 hover:underline">
                      editar
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        if (confirm("Excluir este link?")) start(() => deleteLink(l.id));
                      }}
                      className="text-gray-400 hover:text-forneria-red"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-forneria-black/40">
                    Nenhum link encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-forneria-black/50">{filtered.length} link(s)</p>
      </div>

      {editing && (
        <Modal title={editing.id ? "Editar link" : "Novo link"} onClose={() => setEditing(null)}>
          <form
            action={(fd) => {
              start(() => saveLink(fd));
              setEditing(null);
            }}
            className="space-y-3"
          >
            {editing.id && <input type="hidden" name="id" value={editing.id} />}
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Unidade</span>
              <select name="unidade_id" defaultValue={editing.unidade_id ?? ""} className={inputCls}>
                <option value="">— Sem unidade (só aparece aqui) —</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">Plataforma</span>
              <select name="plataforma_id" defaultValue={editing.plataforma_id} required className={inputCls}>
                <option value="" disabled>
                  Selecione
                </option>
                {plataformas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-forneria-black/70">URL</span>
              <input
                name="url"
                type="url"
                defaultValue={editing.url}
                required
                placeholder="https://..."
                className={inputCls}
              />
            </label>
            <div className="flex justify-end">
              <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function EditableNomePlataforma({ plataforma }: { plataforma: Plataforma }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(plataforma.nome);
  const [, start] = useTransition();

  function save() {
    const nome = value.trim();
    setEditing(false);
    if (!nome || nome === plataforma.nome) {
      setValue(plataforma.nome);
      return;
    }
    const fd = new FormData();
    fd.set("id", plataforma.id);
    fd.set("nome", nome);
    fd.set("ordem", String(plataforma.ordem));
    start(() => savePlataforma(fd));
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            setValue(plataforma.nome);
            setEditing(false);
          }
        }}
        className="w-32 rounded border border-forneria-red px-2 py-1 text-sm outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setValue(plataforma.nome);
        setEditing(true);
      }}
      title="Clique para editar o nome"
      className="flex items-center gap-1 text-left text-sm font-semibold text-forneria-black hover:text-forneria-red"
    >
      {plataforma.nome}
      <span className="text-xs opacity-0 transition hover:opacity-60">✎</span>
    </button>
  );
}
