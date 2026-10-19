"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/links-delivery");
}

export async function savePlataforma(formData: FormData) {
  const sb = await createServerSupabase();
  const id = String(formData.get("id") || "");
  const nome = String(formData.get("nome") || "").trim();
  const ordem = Number(formData.get("ordem") || 0);
  if (!nome) return;
  const row = { nome, ordem };
  if (id) {
    await sb.from("delivery_plataformas").update(row).eq("id", id);
  } else {
    await sb.from("delivery_plataformas").insert(row);
  }
  refresh();
}

/** Grava o ícone (já enviado ao Storage pelo navegador) na plataforma. */
export async function setPlataformaIcone(id: string, url: string) {
  const sb = await createServerSupabase();
  const { error } = await sb.from("delivery_plataformas").update({ icone: url }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deletePlataforma(id: string) {
  const sb = await createServerSupabase();
  await sb.from("delivery_plataformas").delete().eq("id", id);
  refresh();
}

export async function saveLink(formData: FormData) {
  const sb = await createServerSupabase();
  const id = String(formData.get("id") || "");
  const unidadeIdRaw = String(formData.get("unidade_id") || "");
  const plataforma_id = String(formData.get("plataforma_id") || "");
  const url = String(formData.get("url") || "").trim();
  if (!plataforma_id || !url) return;
  const row = {
    unidade_id: unidadeIdRaw || null,
    plataforma_id,
    url,
  };
  if (id) {
    await sb.from("delivery_links").update(row).eq("id", id);
  } else {
    await sb.from("delivery_links").insert(row);
  }
  refresh();
}

export async function deleteLink(id: string) {
  const sb = await createServerSupabase();
  await sb.from("delivery_links").delete().eq("id", id);
  refresh();
}
