import UnidadesAdmin, { type AdminUnidade, type Regiao } from "./UnidadesAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminUnidadesPage() {
  const sb = await createServerSupabase();
  const [{ data: unidades }, { data: regioes }] = await Promise.all([
    sb.from("unidades").select("*").order("nome"),
    sb.from("regioes").select("id, nome").order("nome"),
  ]);

  return (
    <UnidadesAdmin
      unidades={(unidades ?? []) as AdminUnidade[]}
      regioes={(regioes ?? []) as Regiao[]}
    />
  );
}
