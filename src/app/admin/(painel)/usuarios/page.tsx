import UsuariosAdmin, { type AdminUser } from "./UsuariosAdmin";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SUPER_ADMIN = "thais@onchannel.io";

export default async function AdminUsuariosPage() {
  const sb = await createServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  const isSuper = user?.email === SUPER_ADMIN;

  if (!isSuper) {
    return (
      <p className="rounded-lg bg-white p-6 text-forneria-black/70 shadow-sm">
        Apenas o administrador principal pode gerenciar usuários.
      </p>
    );
  }

  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const users: AdminUser[] = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return <UsuariosAdmin users={users} superAdmin={SUPER_ADMIN} />;
}
