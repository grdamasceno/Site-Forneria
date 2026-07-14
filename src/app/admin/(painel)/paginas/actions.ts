"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/paginas");
  revalidatePath("/");
}

/**
 * Insere um banner cujas imagens JÁ foram enviadas ao Storage pelo navegador
 * (upload direto). Assim o arquivo não trafega pela Server Action, evitando o
 * limite de corpo (~4,5 MB) das funções serverless.
 */
export async function insertBanner(data: {
  pagina: string;
  href: string | null;
  alt: string | null;
  ordem: number;
  imagem: string;
  imagem_mobile: string | null;
}) {
  const sb = await createServerSupabase();
  const { error } = await sb.from("banners").insert({ ...data, ativo: true });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteBanner(id: string) {
  const sb = await createServerSupabase();
  await sb.from("banners").delete().eq("id", id);
  refresh();
}

export async function toggleBannerAtivo(id: string, value: boolean) {
  const sb = await createServerSupabase();
  await sb.from("banners").update({ ativo: value }).eq("id", id);
  refresh();
}
