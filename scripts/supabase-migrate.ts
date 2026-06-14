// Migrates local data + images into Supabase (tables + storage buckets).
// Run: npx tsx scripts/supabase-migrate.ts
// Idempotent: clears each table and re-inserts; images are upserted.
import fs from "node:fs";
import path from "node:path";
import { products } from "../src/lib/products.data";
import { units } from "../src/lib/units.data";
import { posts } from "../src/lib/posts.data";
import { brands, banners } from "../src/lib/data";

function loadEnv() {
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}
const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY!;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const CT: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif",
};

function resolve(webPath: string) {
  const local = path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
  let bucket = "paginas";
  let obj = webPath.replace(/^\/img\//, "");
  if (webPath.startsWith("/img/cardapio/")) { bucket = "cardapio"; obj = webPath.slice("/img/cardapio/".length); }
  else if (webPath.startsWith("/img/unidades/")) { bucket = "unidades"; obj = webPath.slice("/img/unidades/".length); }
  else if (webPath.startsWith("/img/blog/")) { bucket = "blog"; obj = webPath.slice("/img/blog/".length); }
  else if (webPath.startsWith("/img/nossas-marcas/")) { bucket = "marcas"; obj = webPath.slice("/img/nossas-marcas/".length); }
  else if (webPath.startsWith("/img/home/banner-principal/")) { bucket = "banners"; obj = webPath.slice("/img/home/banner-principal/".length); }
  const publicUrl = `${URL}/storage/v1/object/public/${bucket}/${obj}`;
  return { local, bucket, obj, publicUrl };
}

const uploadCache = new Set<string>();
async function uploadImage(webPath?: string): Promise<string | null> {
  if (!webPath || !webPath.startsWith("/img/")) return webPath ?? null;
  const { local, bucket, obj, publicUrl } = resolve(webPath);
  if (uploadCache.has(publicUrl)) return publicUrl;
  if (!fs.existsSync(local)) { console.warn("  (sem arquivo local)", webPath); return publicUrl; }
  const ext = path.extname(local).toLowerCase();
  const res = await fetch(`${URL}/storage/v1/object/${bucket}/${obj}`, {
    method: "POST",
    headers: { ...H, "Content-Type": CT[ext] ?? "application/octet-stream", "x-upsert": "true" },
    body: fs.readFileSync(local),
  });
  if (!res.ok && res.status !== 200) {
    const b = await res.text();
    console.warn("  upload falhou", webPath, res.status, b.slice(0, 120));
  }
  uploadCache.add(publicUrl);
  return publicUrl;
}

async function clearTable(table: string) {
  await fetch(`${URL}/rest/v1/${table}?id=not.is.null`, { method: "DELETE", headers: H });
}
async function insert<T>(table: string, rows: T[], returning = false): Promise<any[]> {
  if (rows.length === 0) return [];
  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json", Prefer: returning ? "return=representation" : "return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) { console.error(`INSERT ${table} falhou`, res.status, (await res.text()).slice(0, 300)); return []; }
  return returning ? await res.json() : [];
}

async function uploadAll(paths: (string | undefined)[]) {
  const list = [...new Set(paths.filter(Boolean) as string[])];
  let i = 0;
  async function worker() { while (i < list.length) { await uploadImage(list[i++]); } }
  await Promise.all(Array.from({ length: 8 }, worker));
}

async function main() {
  console.log("Limpando tabelas...");
  for (const t of ["produto_nutricao", "unidades", "produtos", "regioes", "posts", "marcas", "banners"]) {
    await clearTable(t);
  }

  console.log("Subindo imagens (pode levar ~1 min)...");
  await uploadAll([
    ...products.map((p) => p.image),
    ...units.map((u) => u.image),
    ...posts.map((p) => p.image),
    ...brands.map((b) => b.image),
    ...banners.map((b) => b.image),
    ...banners.map((b) => b.imageMobile),
  ]);

  // ---- regioes (derivadas das unidades) ----
  const regMap = new Map<string, string>(); // nome -> telefone
  for (const u of units) if (u.region) regMap.set(u.region, u.phone || "");
  const regRows = [...regMap].map(([nome, telefone]) => ({ nome, telefone }));
  const regInserted = await insert("regioes", regRows, true);
  const regId = new Map<string, string>();
  for (const r of regInserted) regId.set(r.nome, r.id);
  console.log(`regioes: ${regInserted.length}`);

  // ---- unidades ----
  const uniRows = units.map((u, i) => ({
    nome: u.name, estado: u.state, cidade: u.city, endereco: u.address,
    horario: u.hours, imagem: u.image ? resolve(u.image).publicUrl : null,
    region_id: u.region ? regId.get(u.region) ?? null : null, ativo: true, ordem: i,
  }));
  await insert("unidades", uniRows);
  console.log(`unidades: ${uniRows.length}`);

  // ---- produtos + nutrição ----
  const prodRows = products.map((p, i) => ({
    nome: p.name, slug: p.slug ?? p.name, categoria: p.category,
    imagem: p.image ? resolve(p.image).publicUrl : null,
    ingredientes: p.ingredients ?? null, ativo: true, ordem: i,
  }));
  const prodInserted = await insert("produtos", prodRows, true);
  const prodId = new Map<string, string>();
  for (const r of prodInserted) prodId.set(r.slug, r.id);
  console.log(`produtos: ${prodInserted.length}`);

  const nutRows = products
    .filter((p) => p.nutrition)
    .map((p) => {
      const n = p.nutrition!;
      return {
        produto_id: prodId.get(p.slug ?? p.name),
        tamanho: "30 cm",
        porcao: n.porcao, carboidratos: n.carboidratos, proteinas: n.proteinas,
        gorduras_totais: n.gordurasTotais, gorduras_saturadas: n.gordurasSaturadas,
        fibras: n.fibras, calorias_kcal: n.caloriasKcal, gorduras_trans: n.gordurasTrans,
        sodio: n.sodio, calorias_kj: n.caloriasKj,
      };
    })
    .filter((r) => r.produto_id);
  await insert("produto_nutricao", nutRows);
  console.log(`produto_nutricao: ${nutRows.length}`);

  // ---- posts ----
  const postRows = posts.map((p, i) => ({
    slug: p.slug, titulo: p.title, data: p.date, resumo: p.excerpt,
    conteudo: p.text ?? null, imagem: p.image ? resolve(p.image).publicUrl : null,
    publicado: true, ordem: i,
  }));
  await insert("posts", postRows);
  console.log(`posts: ${postRows.length}`);

  // ---- marcas ----
  const marcaRows = brands.map((b, i) => ({
    nome: b.name, descricao: b.description,
    imagem: b.image ? resolve(b.image).publicUrl : null, ordem: i, ativo: true,
  }));
  await insert("marcas", marcaRows);
  console.log(`marcas: ${marcaRows.length}`);

  // ---- banners ----
  const bannerRows = banners.map((b, i) => ({
    alt: b.alt, imagem: resolve(b.image).publicUrl,
    imagem_mobile: b.imageMobile ? resolve(b.imageMobile).publicUrl : null,
    href: b.href ?? null, ordem: i, ativo: true,
  }));
  await insert("banners", bannerRows);
  console.log(`banners: ${bannerRows.length}`);

  console.log("\nMigração concluída ✓");
}

main().catch((e) => { console.error(e); process.exit(1); });
