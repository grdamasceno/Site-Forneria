import NovidadesAdmin, { type AdminPost } from "./NovidadesAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminNovidadesPage() {
  const sb = await createServerSupabase();
  const { data } = await sb
    .from("posts")
    .select("id, slug, titulo, data, resumo, conteudo, imagem, publicado, ordem")
    .order("ordem");
  return <NovidadesAdmin posts={(data ?? []) as AdminPost[]} />;
}
