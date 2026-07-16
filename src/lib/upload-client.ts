"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";

/**
 * Envia um arquivo DIRETO do navegador para o Supabase Storage e devolve a URL
 * pública. Evita passar o arquivo pela Server Action, que na Vercel tem teto de
 * ~4,5 MB no corpo da requisição.
 */
export async function uploadToBucket(bucket: string, path: string, file: File): Promise<string> {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Extensão do arquivo (minúscula), com fallback. */
export function ext(file: File, fallback = "png") {
  return (file.name.split(".").pop() || fallback).toLowerCase();
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Comprime a imagem no navegador antes do upload.
 *
 * Saída em WebP: preserva TRANSPARÊNCIA (as pizzas são recortadas em PNG, então
 * JPEG estragaria o fundo) e comprime muito melhor. Configuração conservadora —
 * só reduz o que a tela nunca mostra, sem perda visível.
 *
 * Nunca "piora": se algo falhar, ou se o resultado ficar maior que o original,
 * devolve o arquivo original intacto.
 */
export async function compressImage(
  file: File,
  { maxWidth = 2560, quality = 0.92 }: { maxWidth?: number; quality?: number } = {},
): Promise<File> {
  // SVG é vetor e GIF pode ser animado — não mexer.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/webp", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const nome = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], nome, { type: "image/webp" });
  } catch {
    return file;
  }
}
