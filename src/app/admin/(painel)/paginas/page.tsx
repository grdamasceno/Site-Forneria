import PaginasAdmin, { type AdminBanner } from "./PaginasAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPaginasPage() {
  const sb = await createServerSupabase();
  const { data } = await sb
    .from("banners")
    .select("id, pagina, alt, href, ordem, imagem, imagem_mobile, ativo")
    .order("ordem");
  return <PaginasAdmin banners={(data ?? []) as AdminBanner[]} />;
}
