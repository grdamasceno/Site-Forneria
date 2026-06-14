"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/a-forneria-original");
  revalidatePath("/");
}

export async function saveConfig(formData: FormData) {
  const sb = await createServerSupabase();
  const rows = [
    { chave: "sobre_nos", valor: String(formData.get("sobre_nos") ?? "") },
    { chave: "faturamento", valor: String(formData.get("faturamento") ?? "") },
  ];
  await sb.from("configuracoes").upsert(rows, { onConflict: "chave" });
  refresh();
}

export async function addEmail(formulario: string, email: string) {
  if (!email.trim()) return;
  const sb = await createServerSupabase();
  await sb.from("form_emails").insert({ formulario, email: email.trim() });
  refresh();
}

export async function deleteEmail(id: string) {
  const sb = await createServerSupabase();
  await sb.from("form_emails").delete().eq("id", id);
  refresh();
}

export async function addParceiro(nome: string, ordem: number) {
  if (!nome.trim()) return;
  const sb = await createServerSupabase();
  await sb.from("parceiros").insert({ nome: nome.trim(), ordem: ordem || 0, ativo: true });
  refresh();
}

export async function updateParceiroOrdem(id: string, ordem: number) {
  const sb = await createServerSupabase();
  await sb.from("parceiros").update({ ordem }).eq("id", id);
  refresh();
}

export async function deleteParceiro(id: string) {
  const sb = await createServerSupabase();
  await sb.from("parceiros").delete().eq("id", id);
  refresh();
}
