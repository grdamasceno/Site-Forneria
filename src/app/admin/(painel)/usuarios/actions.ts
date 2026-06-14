"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const SUPER_ADMIN = "thais@onchannel.io";

async function assertAdmin() {
  const sb = await createServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user || user.email !== SUPER_ADMIN) {
    throw new Error("Não autorizado");
  }
}

export async function createUser(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || password.length < 6) return;
  await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
  revalidatePath("/admin/usuarios");
}

export async function deleteUser(id: string) {
  await assertAdmin();
  await supabaseAdmin.auth.admin.deleteUser(id);
  revalidatePath("/admin/usuarios");
}
