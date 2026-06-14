"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import type { ProductCategory } from "@/lib/data";
import { ingredientesDisponiveis } from "@/lib/ingredientes";
import {
  createProduto,
  deleteProduto,
  saveNutricao,
  deleteNutricao,
  setCategoria,
  setIngredientes,
  toggleField,
  uploadImagem,
} from "./actions";

export type NutricaoRow = {
  id: string;
  tamanho: string | null;
  porcao: string | null;
  carboidratos: string | null;
  proteinas: string | null;
  gorduras_totais: string | null;
  gorduras_saturadas: string | null;
  fibras: string | null;
  calorias_kcal: string | null;
  gorduras_trans: string | null;
  sodio: string | null;
  calorias_kj: string | null;
};

export type AdminProduct = {
  id: string;
  nome: string;
  slug: string;
  categoria: ProductCategory;
  ativo: boolean;
  semana: boolean;
  imagem: string | null;
  destaque_imagem: string | null;
  imagem_mobile: string | null;
  ingredientes: string | null;
  produto_nutricao: NutricaoRow[];
};

const CATEGORIAS: { value: ProductCategory; label: string }[] = [
  { value: "vegana", label: "Vegana" },
  { value: "pizza-doce", label: "Pizza Doce" },
  { value: "pizza-salgada", label: "Pizza Salgada" },
  { value: "fornerito", label: "Fornerito" },
];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-forneria-red" : "bg-gray-300"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function ImageCell({ product, campo, url }: { product: AdminProduct; campo: string; url: string | null }) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  return (
    <button type="button" onClick={() => ref.current?.click()} className="relative block h-12 w-12" title="Trocar imagem">
      {url ? (
        <Image src={url} alt="" fill sizes="48px" className="rounded object-cover" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded border border-dashed border-gray-400 text-lg text-gray-400">+</span>
      )}
      {pending && <span className="absolute inset-0 grid place-items-center bg-white/70 text-xs">...</span>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const fd = new FormData();
          fd.set("id", product.id);
          fd.set("slug", product.slug);
          fd.set("campo", campo);
          fd.set("categoria", product.categoria);
          fd.set("file", file);
          start(() => uploadImagem(fd));
        }}
      />
    </button>
  );
}

export default function CardapioAdmin({ products }: { products: AdminProduct[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [ativo, setAtivo] = useState("");
  const [semana, setSemana] = useState("");
  const [, start] = useTransition();
  const [ingredientesDe, setIngredientesDe] = useState<AdminProduct | null>(null);
  const [nutricaoDe, setNutricaoDe] = useState<AdminProduct | null>(null);
  const [novo, setNovo] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (query && !p.nome.toLowerCase().includes(query.toLowerCase())) return false;
      if (cat && p.categoria !== cat) return false;
      if (ativo && String(p.ativo) !== ativo) return false;
      if (semana && String(p.semana) !== semana) return false;
      return true;
    });
  }, [products, query, cat, ativo, semana]);

  const sel = "rounded-md border border-gray-300 px-3 py-2 text-sm";

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque pelo nome" className={`${sel} flex-1`} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={sel}>
          <option value="">Filtrar categoria</option>
          {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={ativo} onChange={(e) => setAtivo(e.target.value)} className={sel}>
          <option value="">Ativos / Inativos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
        <select value={semana} onChange={(e) => setSemana(e.target.value)} className={sel}>
          <option value="">Sugestão da Semana</option>
          <option value="true">Na semana</option>
          <option value="false">Fora da semana</option>
        </select>
        <button onClick={() => setNovo(true)} className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">
          Adicionar +
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-forneria-black/60">
              <th className="p-3">Nome</th>
              <th className="p-3">Ativo</th>
              <th className="p-3">Semana</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Principal</th>
              <th className="p-3">Destaque</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Ingredientes</th>
              <th className="p-3">Nutricional</th>
              <th className="p-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-forneria-gray/40">
                <td className="p-3 font-medium uppercase text-forneria-black">{p.nome}</td>
                <td className="p-3"><Toggle on={p.ativo} onClick={() => start(() => toggleField(p.id, "ativo", !p.ativo))} /></td>
                <td className="p-3"><Toggle on={p.semana} onClick={() => start(() => toggleField(p.id, "semana", !p.semana))} /></td>
                <td className="p-3">
                  <select
                    defaultValue={p.categoria}
                    onChange={(e) => start(() => setCategoria(p.id, e.target.value as ProductCategory))}
                    className="rounded border border-gray-300 px-2 py-1 text-sm"
                  >
                    {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </td>
                <td className="p-3"><ImageCell product={p} campo="principal" url={p.imagem} /></td>
                <td className="p-3"><ImageCell product={p} campo="destaque" url={p.destaque_imagem} /></td>
                <td className="p-3"><ImageCell product={p} campo="mobile" url={p.imagem_mobile} /></td>
                <td className="p-3">
                  <button onClick={() => setIngredientesDe(p)} className="text-forneria-red underline-offset-2 hover:underline">
                    {p.ingredientes ? "ver / editar" : "+ adicionar"}
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => setNutricaoDe(p)} className="text-forneria-red underline-offset-2 hover:underline">
                    {p.produto_nutricao.length || "+"} {p.produto_nutricao.length ? "tab." : ""}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => { if (confirm(`Excluir "${p.nome}"?`)) start(() => deleteProduto(p.id)); }}
                    className="text-gray-400 hover:text-forneria-red"
                    title="Excluir"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-forneria-black/50">{filtered.length} produto(s)</p>

      {ingredientesDe && (
        <IngredientesModal product={ingredientesDe} onClose={() => setIngredientesDe(null)} />
      )}
      {nutricaoDe && (
        <NutricaoModal product={nutricaoDe} onClose={() => setNutricaoDe(null)} />
      )}
      {novo && <NovoModal onClose={() => setNovo(false)} />}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-grad-dark flex items-center justify-between px-5 py-3 text-white">
          <h2 className="font-bold uppercase">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function IngredientesModal({ product, onClose }: { product: AdminProduct; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(
    (product.ingredientes ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const [, start] = useTransition();

  const available = ingredientesDisponiveis.filter((i) => !selected.includes(i));

  function add(name: string) {
    if (name && !selected.includes(name)) setSelected([...selected, name]);
  }
  function remove(name: string) {
    setSelected(selected.filter((s) => s !== name));
  }
  function move(idx: number, dir: -1 | 1) {
    const next = [...selected];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setSelected(next);
  }

  return (
    <Modal title={`Ingredientes — ${product.nome}`} onClose={onClose}>
      <label className="mb-1 block text-sm font-medium text-forneria-black/70">
        Adicionar ingrediente
      </label>
      <select
        value=""
        onChange={(e) => { add(e.target.value); e.target.value = ""; }}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">Selecione…</option>
        {available.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
      </select>

      <p className="mb-2 mt-4 text-sm font-medium text-forneria-black/70">
        Selecionados (na ordem de exibição)
      </p>
      {selected.length === 0 ? (
        <p className="text-sm text-forneria-black/50">Nenhum ingrediente selecionado.</p>
      ) : (
        <ul className="space-y-1">
          {selected.map((name, idx) => (
            <li key={name} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-1.5 text-sm">
              <span>{name}</span>
              <span className="flex items-center gap-2 text-forneria-black/50">
                <button type="button" onClick={() => move(idx, -1)} title="Subir" className="hover:text-forneria-red disabled:opacity-30" disabled={idx === 0}>↑</button>
                <button type="button" onClick={() => move(idx, 1)} title="Descer" className="hover:text-forneria-red disabled:opacity-30" disabled={idx === selected.length - 1}>↓</button>
                <button type="button" onClick={() => remove(name)} title="Remover" className="hover:text-forneria-red">×</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => start(() => { setIngredientes(product.id, selected.join(", ")); onClose(); })}
          className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}

const NUT_FIELDS: { key: keyof NutricaoRow; label: string }[] = [
  { key: "calorias_kcal", label: "Calorias Kcal" },
  { key: "gorduras_totais", label: "Gorduras Totais" },
  { key: "calorias_kj", label: "Calorias KJ" },
  { key: "gorduras_trans", label: "Gorduras Trans" },
  { key: "carboidratos", label: "Carboidratos" },
  { key: "porcao", label: "Porção (g)" },
  { key: "fibras", label: "Fibras" },
  { key: "proteinas", label: "Proteínas" },
  { key: "gorduras_saturadas", label: "Gorduras Saturadas" },
  { key: "sodio", label: "Sódio" },
];

function NutricaoModal({ product, onClose }: { product: AdminProduct; onClose: () => void }) {
  const [editing, setEditing] = useState<NutricaoRow | null>(null);
  const [, start] = useTransition();

  if (editing) {
    return (
      <Modal title="Tabela Nutricional" onClose={() => setEditing(null)}>
        <form
          action={(fd) => { start(() => { saveNutricao(fd); }); setEditing(null); }}
          className="space-y-3"
        >
          <input type="hidden" name="produto_id" value={product.id} />
          {editing.id && <input type="hidden" name="id" value={editing.id} />}
          <select name="tamanho" defaultValue={editing.tamanho ?? "30 cm"} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option>20 cm</option><option>30 cm</option><option>40 cm</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            {NUT_FIELDS.map((f) => (
              <label key={f.key} className="text-sm">
                <span className="mb-1 block text-forneria-black/70">{f.label}</span>
                <input name={f.key} defaultValue={(editing[f.key] as string) ?? ""} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" className="rounded-md bg-green-600 px-6 py-2 font-bold text-white">Salvar</button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal title={`Tabela Nutricional — ${product.nome}`} onClose={onClose}>
      <ul className="mb-4 space-y-2">
        {product.produto_nutricao.map((n) => (
          <li key={n.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm">
            <span><strong>{n.tamanho || "—"}</strong> · {n.calorias_kcal || "?"} kcal · porção {n.porcao || "?"}</span>
            <span className="flex gap-3">
              <button onClick={() => setEditing(n)} className="text-forneria-red">Editar</button>
              <button onClick={() => start(() => deleteNutricao(n.id))} className="text-gray-400 hover:text-forneria-red">Apagar</button>
            </span>
          </li>
        ))}
        {product.produto_nutricao.length === 0 && <li className="text-sm text-forneria-black/50">Nenhuma tabela cadastrada.</li>}
      </ul>
      <button
        onClick={() => setEditing({ id: "", tamanho: "30 cm" } as NutricaoRow)}
        className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white"
      >
        + Adicionar tamanho
      </button>
    </Modal>
  );
}

function NovoModal({ onClose }: { onClose: () => void }) {
  const [, start] = useTransition();
  return (
    <Modal title="Novo produto" onClose={onClose}>
      <form
        action={(fd) => { start(() => createProduto(String(fd.get("nome")), fd.get("categoria") as ProductCategory)); onClose(); }}
        className="space-y-3"
      >
        <input name="nome" required placeholder="Nome do produto" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        <select name="categoria" defaultValue="pizza-salgada" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <div className="flex justify-end">
          <button type="submit" className="rounded-md bg-forneria-red px-6 py-2 font-bold text-white">Criar</button>
        </div>
      </form>
    </Modal>
  );
}
