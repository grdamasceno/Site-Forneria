// Server-side data access — reads from Supabase (public/anon, governed by RLS).
import { supabase } from "@/lib/supabase/client";
import type { Product, Unit, Post, Brand, Banner, ProductCategory } from "@/lib/data";

type NutricaoRow = {
  porcao: string | null;
  carboidratos: string | null;
  proteinas: string | null;
  gorduras_totais: string | null;
  gorduras_saturadas: string | null;
  fibras: string | null;
  calorias_kcal: string | null;
  gorduras_trans: string | null;
  sodio: string | null;
  calorias_kj: string | null;
};

type ProdutoRow = {
  nome: string;
  slug: string;
  categoria: string;
  imagem: string | null;
  ingredientes: string | null;
  destaque_imagem?: string | null;
  produto_nutricao?: NutricaoRow[];
};

function toProduct(r: ProdutoRow): Product {
  const n: NutricaoRow | undefined = Array.isArray(r.produto_nutricao)
    ? r.produto_nutricao[0]
    : undefined;
  return {
    name: r.nome,
    slug: r.slug,
    category: r.categoria as ProductCategory,
    image: r.imagem ?? "",
    ingredients: r.ingredientes ?? undefined,
    nutrition: n
      ? {
          porcao: n.porcao ?? undefined,
          carboidratos: n.carboidratos ?? undefined,
          proteinas: n.proteinas ?? undefined,
          gordurasTotais: n.gorduras_totais ?? undefined,
          gordurasSaturadas: n.gorduras_saturadas ?? undefined,
          fibras: n.fibras ?? undefined,
          caloriasKcal: n.calorias_kcal ?? undefined,
          gordurasTrans: n.gorduras_trans ?? undefined,
          sodio: n.sodio ?? undefined,
          caloriasKj: n.calorias_kj ?? undefined,
        }
      : undefined,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("produtos")
    .select("nome, slug, categoria, imagem, ingredientes, ordem, produto_nutricao(*)")
    .eq("ativo", true)
    .order("nome");
  if (error || !data) return [];
  return data.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("produtos")
    .select("nome, slug, categoria, imagem, ingredientes, produto_nutricao(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toProduct(data);
}

export async function getUnits(): Promise<Unit[]> {
  const { data, error } = await supabase
    .from("unidades")
    .select("nome, estado, cidade, endereco, horario, imagem, ordem, regioes(nome, telefone)")
    .eq("ativo", true)
    .order("ordem");
  if (error || !data) return [];
  return data.map((r): Unit => {
    const reg = Array.isArray(r.regioes) ? r.regioes[0] : r.regioes;
    return {
      name: r.nome,
      state: r.estado ?? "",
      city: r.cidade ?? "",
      address: r.endereco ?? "",
      hours: r.horario ?? "",
      phone: reg?.telefone ?? "",
      region: reg?.nome ?? "",
      image: r.imagem ?? "",
    };
  });
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("slug, titulo, data, resumo, conteudo, imagem, ordem")
    .eq("publicado", true)
    .order("ordem");
  if (error || !data) return [];
  return data.map((r): Post => ({
    slug: r.slug,
    title: r.titulo,
    date: r.data ?? "",
    excerpt: r.resumo ?? "",
    text: r.conteudo ?? undefined,
    image: r.imagem ?? "",
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getWeeklySuggestions(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("produtos")
    .select("nome, slug, categoria, imagem, destaque_imagem")
    .eq("ativo", true)
    .eq("semana", true)
    .order("nome");
  if (error || !data) return [];
  return data.map((r): Product => ({
    name: r.nome,
    slug: r.slug,
    category: r.categoria as ProductCategory,
    image: r.destaque_imagem || r.imagem || "",
  }));
}

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("marcas")
    .select("nome, descricao, imagem, ordem")
    .eq("ativo", true)
    .order("ordem");
  if (error || !data) return [];
  return data.map((r): Brand => ({
    name: r.nome,
    description: r.descricao ?? "",
    image: r.imagem ?? "",
  }));
}

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from("banners")
    .select("alt, imagem, imagem_mobile, href, ordem")
    .eq("ativo", true)
    .order("ordem");
  if (error || !data) return [];
  return data.map((r): Banner => ({
    alt: r.alt ?? "",
    image: r.imagem,
    imageWidth: 1920,
    imageHeight: 660,
    imageMobile: r.imagem_mobile ?? undefined,
    imageMobileWidth: 700,
    imageMobileHeight: 1300,
    href: r.href ?? undefined,
  }));
}
