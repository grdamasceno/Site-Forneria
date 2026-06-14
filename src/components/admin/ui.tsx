"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";

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

/** Small image thumbnail that uploads on click via a server action (FormData). */
export function ImageUploadButton({
  url,
  uploadAction,
  fields,
}: {
  url: string | null;
  uploadAction: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  return (
    <button type="button" onClick={() => ref.current?.click()} className="relative block h-14 w-14" title="Trocar imagem">
      {url ? (
        <Image src={url} alt="" fill sizes="56px" className="rounded object-cover" />
      ) : (
        <span className="flex h-14 w-14 items-center justify-center rounded border border-dashed border-gray-400 text-lg text-gray-400">+</span>
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
          Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
          fd.set("file", file);
          start(() => uploadAction(fd));
        }}
      />
    </button>
  );
}

export const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-forneria-red";
