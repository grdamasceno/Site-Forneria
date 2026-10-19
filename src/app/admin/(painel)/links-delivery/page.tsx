import LinksDeliveryAdmin, { type AdminLink, type Plataforma, type UnidadeOption } from "./LinksDeliveryAdmin";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LinkRow = {
  id: string;
  url: string;
  unidade_id: string | null;
  plataforma_id: string;
  unidades: { nome: string } | { nome: string }[] | null;
  delivery_plataformas: { nome: string } | { nome: string }[] | null;
};

function one<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : v;
}

export default async function AdminLinksDeliveryPage() {
  const sb = await createServerSupabase();
  const [{ data: plataformas }, { data: links }, { data: unidades }] = await Promise.all([
    sb.from("delivery_plataformas").select("id, nome, icone, ordem").order("ordem"),
    sb
      .from("delivery_links")
      .select("id, url, unidade_id, plataforma_id, unidades(nome), delivery_plataformas(nome)")
      .order("created_at", { ascending: false }),
    sb.from("unidades").select("id, nome").eq("ativo", true).order("nome"),
  ]);

  const adminLinks: AdminLink[] = ((links ?? []) as LinkRow[]).map((r) => ({
    id: r.id,
    url: r.url,
    unidade_id: r.unidade_id,
    plataforma_id: r.plataforma_id,
    unidade_nome: one(r.unidades)?.nome ?? null,
    plataforma_nome: one(r.delivery_plataformas)?.nome ?? "—",
  }));

  return (
    <LinksDeliveryAdmin
      plataformas={(plataformas ?? []) as Plataforma[]}
      links={adminLinks}
      unidades={(unidades ?? []) as UnidadeOption[]}
    />
  );
}
