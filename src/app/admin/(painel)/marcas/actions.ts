"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/data";

function refresh() {
  revalidatePath("/admin/marcas");
  revalidatePath("/nossas-marcas");
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

export async function uploadLogoMarca(formData: FormData) {
  const id = String(formData.get("id"));
  const nome = String(formData.get("nome") || "marca");
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${slugify(nome) || id}.${ext}`;
  const sb = await createServerSupabase();
  const { error } = await sb.storage.from("marcas").upload(path, new Uint8Array(await file.arrayBuffer()), {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (error) return;
  const { data: pub } = sb.storage.from("marcas").getPublicUrl(path);
  await sb.from("marcas").update({ imagem: `${pub.publicUrl}?v=${Date.now()}` }).eq("id", id);
  refresh();
}
