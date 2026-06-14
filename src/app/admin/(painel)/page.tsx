import ForneriaConfig, { type Email, type Parceiro } from "./ForneriaConfig";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminForneriaPage() {
  const sb = await createServerSupabase();
  const [{ data: config }, { data: emails }, { data: parceiros }] = await Promise.all([
    sb.from("configuracoes").select("chave, valor"),
    sb.from("form_emails").select("id, formulario, email").order("ordem"),
    sb.from("parceiros").select("id, nome, ordem, ativo").order("ordem"),
  ]);

  const conf: Record<string, string> = {};
  for (const c of config ?? []) conf[c.chave] = c.valor ?? "";

  return (
    <ForneriaConfig
      sobreNos={conf.sobre_nos ?? ""}
      faturamento={conf.faturamento ?? ""}
      emails={(emails ?? []) as Email[]}
      parceiros={(parceiros ?? []) as Parceiro[]}
    />
  );
}
