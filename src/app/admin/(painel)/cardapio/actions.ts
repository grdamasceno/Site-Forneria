"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify, type ProductCategory } from "@/lib/data";

const CAT_DIR: Record<ProductCategory, string> = {
  "pizza-salgada": "salgada",
  "pizza-doce": "doce",
  vegana: "vegana",
  fornerito: "fornerito",
};

const CAMPO_COL: Record<string, "imagem" | "destaque_imagem" | "imagem_mobile"> = {
  principal: "imagem",
  destaque: "destaque_imagem",
  mobile: "imagem_mobile",
};

function refresh() {
  revalidatePath("/admin/cardapio");
  revalidatePath("/cardapio");
  revalidatePath("/");
}

export async function toggleField(id: string, field: "ativo" | "semana", value: boolean) {
  const sb = await createServerSupabase();
  await sb.from("produtos").update({ [field]: value }).eq("id", id);
  refresh();
}

export async function setCategoria(id: string, categoria: ProductCategory) {
  const sb = await createServerSupabase();
  await sb.from("produtos").update({ categoria }).eq("id", id);
  refresh();
}

export async function setIngredientes(id: string, ingredientes: string) {
  const sb = await createServerSupabase();
  await sb.from("produtos").update({ ingredientes }).eq("id", id);
  refresh();
}

export async function renameProduto(id: string, nome: string) {
  const sb = await createServerSupabase();
  await sb.from("produtos").update({ nome }).eq("id", id);
  refresh();
}

export async function createProduto(nome: string, categoria: ProductCategory) {
  const sb = await createServerSupabase();
  let slug = slugify(nome) || "produto";
  let n = 1;
  // Ensure a unique slug.
  while (true) {
    const { data } = await sb.from("produtos").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${slugify(nome)}-${++n}`;
  }
  await sb.from("produtos").insert({ nome, slug, categoria, ativo: true });
  refresh();
}

export async function deleteProduto(id: string) {
  const sb = await createServerSupabase();
  await sb.from("produtos").delete().eq("id", id);
  refresh();
}

export async function uploadImagem(formData: FormData) {
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const campo = String(formData.get("campo"));
  const categoria = String(formData.get("categoria")) as ProductCategory;
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;

  const col = CAMPO_COL[campo];
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const dir = CAT_DIR[categoria] ?? "outros";
  const path = `${dir}/${slug}-${campo}.${ext}`;

  const sb = await createServerSupabase();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await sb.storage.from("cardapio").upload(path, bytes, {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (error) return;

  const { data: pub } = sb.storage.from("cardapio").getPublicUrl(path);
  const url = `${pub.publicUrl}?v=${Date.now()}`;
  await sb.from("produtos").update({ [col]: url }).eq("id", id);
  refresh();
}

export async function saveNutricao(formData: FormData) {
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const payload = {
    produto_id: String(formData.get("produto_id")),
    tamanho: String(formData.get("tamanho") || ""),
    calorias_kcal: String(formData.get("calorias_kcal") || ""),
    calorias_kj: String(formData.get("calorias_kj") || ""),
    carboidratos: String(formData.get("carboidratos") || ""),
    fibras: String(formData.get("fibras") || ""),
    gorduras_saturadas: String(formData.get("gorduras_saturadas") || ""),
    gorduras_totais: String(formData.get("gorduras_totais") || ""),
    gorduras_trans: String(formData.get("gorduras_trans") || ""),
    porcao: String(formData.get("porcao") || ""),
    proteinas: String(formData.get("proteinas") || ""),
    sodio: String(formData.get("sodio") || ""),
  };
  const sb = await createServerSupabase();
  if (id) await sb.from("produto_nutricao").update(payload).eq("id", id);
  else await sb.from("produto_nutricao").insert(payload);
  refresh();
}

export async function deleteNutricao(id: string) {
  const sb = await createServerSupabase();
  await sb.from("produto_nutricao").delete().eq("id", id);
  refresh();
}
