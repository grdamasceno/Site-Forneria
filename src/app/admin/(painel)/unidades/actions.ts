"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";

function refresh() {
  revalidatePath("/admin/unidades");
  revalidatePath("/unidades");
}

export async function toggleAtivo(id: string, value: boolean) {
  const sb = await createServerSupabase();
  await sb.from("unidades").update({ ativo: value }).eq("id", id);
  refresh();
}

export async function deleteUnidade(id: string) {
  const sb = await createServerSupabase();
  await sb.from("unidades").delete().eq("id", id);
  refresh();
}

export async function saveUnidade(formData: FormData) {
  const v = (k: string) => {
    const s = String(formData.get(k) ?? "").trim();
    return s === "" ? null : s;
  };
  const id = v("id");
  const logradouro = v("logradouro");
  const numero = v("numero");
  const complemento = v("complemento");
  const bairro = v("bairro");

  // Recompose the display address from the granular fields.
  const endereco = [
    [logradouro, numero].filter(Boolean).join(", "),
    complemento,
    bairro,
  ].filter(Boolean).join(" - ") || null;

  const row = {
    nome: v("nome"),
    estado: v("estado"),
    region_id: v("region_id"),
    cep: v("cep"),
    logradouro,
    numero,
    complemento,
    bairro,
    cidade: v("cidade"),
    uf: v("uf"),
    horario: v("horario"),
    endereco,
  };

  const sb = await createServerSupabase();
  if (id) {
    await sb.from("unidades").update(row).eq("id", id);
  } else {
    await sb.from("unidades").insert({ ...row, ativo: true });
  }
  refresh();
}

/** Grava a URL da fachada (já enviada ao Storage pelo navegador). */
export async function setFachadaUrl(id: string, url: string) {
  const sb = await createServerSupabase();
  const { error } = await sb.from("unidades").update({ imagem: url }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}
