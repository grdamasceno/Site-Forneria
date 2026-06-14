"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/paginas");
  revalidatePath("/");
}

async function uploadToBanners(file: File, pagina: string, suffix: string) {
  if (!file || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${pagina}/${Date.now()}-${suffix}.${ext}`;
  const sb = await createServerSupabase();
  const { error } = await sb.storage.from("banners").upload(path, new Uint8Array(await file.arrayBuffer()), {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (error) return null;
  const { data: pub } = sb.storage.from("banners").getPublicUrl(path);
  return pub.publicUrl;
}

export async function addBanner(formData: FormData) {
  const pagina = String(formData.get("pagina") || "home");
  const href = String(formData.get("href") || "").trim() || null;
  const alt = String(formData.get("alt") || "").trim() || null;
  const ordem = Number(formData.get("ordem")) || 0;
  const desktop = formData.get("desktop") as File;
  const mobile = formData.get("mobile") as File;

  const imagem = await uploadToBanners(desktop, pagina, "d");
  if (!imagem) return;
  const imagem_mobile = await uploadToBanners(mobile, pagina, "m");

  const sb = await createServerSupabase();
  await sb.from("banners").insert({ pagina, href, alt, ordem, imagem, imagem_mobile, ativo: true });
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
