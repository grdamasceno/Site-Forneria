"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify } from "@/lib/data";

function refresh() {
  revalidatePath("/admin/novidades");
  revalidatePath("/novidades");
  revalidatePath("/");
}

export async function togglePublicado(id: string, value: boolean) {
  const sb = await createServerSupabase();
  await sb.from("posts").update({ publicado: value }).eq("id", id);
  refresh();
}

export async function deletePost(id: string) {
  const sb = await createServerSupabase();
  await sb.from("posts").delete().eq("id", id);
  refresh();
}

export async function savePost(formData: FormData) {
  const v = (k: string) => String(formData.get(k) ?? "").trim();
  const id = v("id");
  const titulo = v("titulo");
  const row = {
    titulo,
    data: v("data") || null,
    resumo: v("resumo") || null,
    conteudo: v("conteudo") || null,
  };
  const sb = await createServerSupabase();
  if (id) {
    await sb.from("posts").update(row).eq("id", id);
  } else {
    // unique slug from title
    let slug = slugify(titulo) || "post";
    let n = 1;
    while (true) {
      const { data } = await sb.from("posts").select("id").eq("slug", slug).maybeSingle();
      if (!data) break;
      slug = `${slugify(titulo)}-${++n}`;
    }
    await sb.from("posts").insert({ ...row, slug, publicado: true });
  }
  refresh();
}

/** Grava a URL da imagem do post (já enviada ao Storage pelo navegador). */
export async function setPostImagemUrl(id: string, url: string) {
  const sb = await createServerSupabase();
  const { error } = await sb.from("posts").update({ imagem: url }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}
