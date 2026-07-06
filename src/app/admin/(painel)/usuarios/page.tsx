import UsuariosAdmin, { type AdminUser } from "./UsuariosAdmin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Conta principal — protegida contra exclusão para não travar o acesso.
const SUPER_ADMIN = "thais@onchannel.io";

export default async function AdminUsuariosPage() {
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const users: AdminUser[] = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
  }));

  return <UsuariosAdmin users={users} superAdmin={SUPER_ADMIN} />;
}
