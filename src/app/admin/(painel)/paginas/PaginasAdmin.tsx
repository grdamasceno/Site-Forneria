"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Toggle, inputCls } from "@/components/admin/ui";
import { addBanner, deleteBanner, toggleBannerAtivo } from "./actions";

export type AdminBanner = {
  id: string;
  pagina: string;
  alt: string | null;
  href: string | null;
  ordem: number;
  imagem: string | null;
  imagem_mobile: string | null;
  ativo: boolean;
};

const PAGINAS: { key: string; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "franqueado", label: "Franqueado" },
];

export default function PaginasAdmin({ banners }: { banners: AdminBanner[] }) {
  const [, start] = useTransition();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-forneria-black">Páginas — Carrosséis</h1>

      {PAGINAS.map((pg) => {
        const slides = banners.filter((b) => b.pagina === pg.key);
        return (
          <section key={pg.key} className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-bold uppercase text-forneria-red">{pg.label}</h2>

            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slides.map((b) => (
                <div key={b.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex gap-2">
                    {b.imagem && <div className="relative h-20 flex-1 overflow-hidden rounded"><Image src={b.imagem} alt="" fill sizes="200px" className="object-cover" /></div>}
                    {b.imagem_mobile && <div className="relative h-20 w-12 overflow-hidden rounded"><Image src={b.imagem_mobile} alt="" fill sizes="48px" className="object-cover" /></div>}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><Toggle on={b.ativo} onClick={() => start(() => toggleBannerAtivo(b.id, !b.ativo))} /> <span className="text-xs text-forneria-black/50">ordem {b.ordem}</span></span>
                    <button onClick={() => { if (confirm("Excluir banner?")) start(() => deleteBanner(b.id)); }} className="text-gray-400 hover:text-forneria-red">🗑</button>
                  </div>
                </div>
              ))}
              {slides.length === 0 && <p className="text-sm text-forneria-black/50">Nenhum banner nesta página.</p>}
            </div>

            <form action={(fd) => start(() => addBanner(fd))} className="flex flex-wrap items-end gap-3 rounded-md bg-forneria-gray/50 p-3">
              <input type="hidden" name="pagina" value={pg.key} />
              <label className="text-sm">
                <span className="mb-1 block text-forneria-black/70">Imagem desktop</span>
                <input type="file" name="desktop" accept="image/*" required className="text-sm" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-forneria-black/70">Imagem mobile</span>
                <input type="file" name="mobile" accept="image/*" className="text-sm" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-forneria-black/70">Link (opcional)</span>
                <input name="href" placeholder="https://..." className={inputCls} />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-forneria-black/70">Ordem</span>
                <input name="ordem" type="number" defaultValue={slides.length} className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm" />
              </label>
              <button type="submit" className="rounded-full bg-forneria-red px-5 py-2 text-sm font-bold text-white">Inserir imagem</button>
            </form>
          </section>
        );
      })}
    </div>
  );
}
