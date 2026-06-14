import MarcasAdmin, { type AdminMarca } from "./MarcasAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminMarcasPage() {
  const sb = await createServerSupabase();
  const { data } = await sb.from("marcas").select("id, nome, descricao, imagem, ordem, ativo").order("ordem");
  return <MarcasAdmin marcas={(data ?? []) as AdminMarca[]} />;
}
