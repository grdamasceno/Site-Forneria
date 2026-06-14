import CardapioAdmin, { type AdminProduct } from "./CardapioAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCardapioPage() {
  const sb = await createServerSupabase();
  const { data } = await sb
    .from("produtos")
    .select(
      "id, nome, slug, categoria, ativo, semana, imagem, destaque_imagem, imagem_mobile, ingredientes, produto_nutricao(*)",
    )
    .order("nome");

  return <CardapioAdmin products={(data ?? []) as AdminProduct[]} />;
}
