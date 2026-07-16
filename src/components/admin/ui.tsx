"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadToBucket } from "@/lib/upload-client";

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-forneria-red" : "bg-gray-300"}`}
      aria-pressed={on}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} overflow-hidden rounded-lg bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-grad-dark flex items-center justify-between px-5 py-3 text-white">
          <h2 className="font-bold uppercase">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none">×</button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

/**
 * Miniatura que, ao clicar, envia a imagem DIRETO para o Supabase Storage
 * (sem passar pela Server Action, logo sem o teto de ~4,5 MB) e depois grava a
 * URL no banco via `save`. Erros aparecem na tela.
 */
export function ImageUploadButton({
  url,
  bucket,
  buildPath,
  save,
}: {
  url: string | null;
  bucket: string;
  /** Caminho do arquivo dentro do bucket, a partir do File escolhido. */
  buildPath: (file: File) => string;
  /** Server action que persiste a URL pública no registro. */
  save: (publicUrl: string) => Promise<void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErro("");
    try {
      const publicUrl = await uploadToBucket(bucket, buildPath(file), file);
      await save(`${publicUrl}?v=${Date.now()}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <span className="inline-block">
      <button type="button" onClick={() => ref.current?.click()} className="relative block h-14 w-14" title="Trocar imagem">
        {url ? (
          <Image src={url} alt="" fill sizes="56px" className="rounded object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded border border-dashed border-gray-400 text-lg text-gray-400">+</span>
        )}
        {busy && <span className="absolute inset-0 grid place-items-center rounded bg-white/70 text-xs">...</span>}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </button>
      {erro && <span className="mt-1 block max-w-[120px] text-[10px] leading-tight text-forneria-red">{erro}</span>}
    </span>
  );
}

export const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-forneria-red";
