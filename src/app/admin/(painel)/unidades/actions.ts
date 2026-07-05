"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/data";

const SUPER_ADMIN = "thais@onchannel.io";

function refresh() {
  revalidatePath("/admin/unidades");
  revalidatePath("/unidades");
}

async function assertAdmin() {
  const sb = await createServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN) throw new Error("Não autorizado");
}

/** Find an existing auth user by e-mail (pages through the admin list). */
async function findUserIdByEmail(email: string): Promise<string | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) return null;
    const found = data.users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (found) return found.id;
    if (data.users.length < 200) return null;
  }
  return null;
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
    codigo: v("codigo"),
    gerente: v("gerente"),
    contato: v("contato"),
    razao_social: v("razao_social"),
    cnpj: v("cnpj"),
    email_acesso: v("email_acesso"),
    inscricao_estadual: v("inscricao_estadual"),
    associado: v("associado"),
    cpf: v("cpf"),
    nome_fantasia: v("nome_fantasia"),
    nome_socio: v("nome_socio"),
    tel_socio: v("tel_socio"),
    email_secundario: v("email_secundario"),
    porte: v("porte"),
    restricao: v("restricao"),
    fornecedor: v("fornecedor"),
    cep: v("cep"),
    logradouro,
    numero,
    complemento,
    bairro,
    cidade: v("cidade"),
    uf: v("uf"),
    horario: v("horario"),
    endereco,
    ativo: formData.get("ativo") === "true",
  };

  const sb = await createServerSupabase();
  if (id) {
    await sb.from("unidades").update(row).eq("id", id);
  } else {
    await sb.from("unidades").insert(row);
  }
  refresh();
}

export async function uploadFachada(formData: FormData) {
  const id = String(formData.get("id"));
  const nome = String(formData.get("nome") || "unidade");
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${slugify(nome) || id}.${ext}`;
  const sb = await createServerSupabase();
  const { error } = await sb.storage.from("unidades").upload(path, new Uint8Array(await file.arrayBuffer()), {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (error) return;
  const { data: pub } = sb.storage.from("unidades").getPublicUrl(path);
  await sb.from("unidades").update({ imagem: `${pub.publicUrl}?v=${Date.now()}` }).eq("id", id);
  refresh();
}

export async function uploadLogo(formData: FormData) {
  const id = String(formData.get("id"));
  const nome = String(formData.get("nome") || "unidade");
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `logos/${slugify(nome) || id}.${ext}`;
  const sb = await createServerSupabase();
  const { error } = await sb.storage.from("unidades").upload(path, new Uint8Array(await file.arrayBuffer()), {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (error) return;
  const { data: pub } = sb.storage.from("unidades").getPublicUrl(path);
  await sb.from("unidades").update({ logo: `${pub.publicUrl}?v=${Date.now()}` }).eq("id", id);
  refresh();
}

export async function uploadRestricaoAnexo(formData: FormData) {
  const id = String(formData.get("id"));
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;
  const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
  const path = `restricao/${id}-${Date.now()}.${ext}`;
  const sb = await createServerSupabase();
  const { error } = await sb.storage.from("unidades").upload(path, new Uint8Array(await file.arrayBuffer()), {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });
  if (error) return;
  const { data: pub } = sb.storage.from("unidades").getPublicUrl(path);
  await sb.from("unidades").update({ restricao_anexo: pub.publicUrl }).eq("id", id);
  refresh();
}

export async function deleteRestricaoAnexo(id: string) {
  const sb = await createServerSupabase();
  await sb.from("unidades").update({ restricao_anexo: null }).eq("id", id);
  refresh();
}

/**
 * Redefine (ou cria) a senha do usuário de acesso vinculado à unidade.
 * O e-mail de acesso da unidade corresponde a um usuário do Supabase Auth;
 * este é o mesmo login usado por aquela unidade.
 */
export async function resetSenhaUnidade(
  unidadeId: string,
  email: string,
  senha: string,
): Promise<{ ok: boolean; message: string }> {
  await assertAdmin();
  const mail = email.trim().toLowerCase();
  if (!mail) return { ok: false, message: "Defina o e-mail de acesso primeiro." };
  if (senha.length < 6) return { ok: false, message: "A senha deve ter ao menos 6 caracteres." };

  const sb = await createServerSupabase();
  const { data: uni } = await sb.from("unidades").select("user_id").eq("id", unidadeId).maybeSingle();

  let userId = uni?.user_id as string | null;
  if (!userId) userId = await findUserIdByEmail(mail);

  if (userId) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: senha,
      email: mail,
    });
    if (error) return { ok: false, message: error.message };
  } else {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: mail,
      password: senha,
      email_confirm: true,
    });
    if (error || !created?.user) return { ok: false, message: error?.message ?? "Falha ao criar usuário." };
    userId = created.user.id;
  }

  await sb.from("unidades").update({ user_id: userId }).eq("id", unidadeId);
  refresh();
  return { ok: true, message: "Senha redefinida com sucesso." };
}
