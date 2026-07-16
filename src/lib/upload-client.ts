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
