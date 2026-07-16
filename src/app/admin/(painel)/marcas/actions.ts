"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/marcas");
  revalidatePath("/marcas");
  revalidatePath("/");
}

export async function toggleAtiva(id: string, value: boolean) {
  const sb = await createServerSupabase();
  await sb.from("marcas").update({ ativo: value }).eq("id", id);
  refresh();
}

export async function deleteMarca(id: string) {
  const sb = await createServerSupabase();
  await sb.from("marcas").delete().eq("id", id);
  refresh();
}

export async function saveMarca(formData: FormData) {
  const v = (k: string) => String(formData.get(k) ?? "").trim();
  const id = v("id");
  const row = {
    nome: v("nome"),
    descricao: v("descricao") || null,
    ordem: Number(v("ordem")) || 0,
  };
  const sb = await createServerSupabase();
  if (id) await sb.from("marcas").update(row).eq("id", id);
  else await sb.from("marcas").insert({ ...row, ativo: true });
  refresh();
}

/** Grava a URL do logo da marca (já enviado ao Storage pelo navegador). */
export async function setMarcaLogoUrl(id: string, url: string) {
  const sb = await createServerSupabase();
  const { error } = await sb.from("marcas").update({ imagem: url }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}
