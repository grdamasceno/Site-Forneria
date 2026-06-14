// Authoritative catalog generator: builds the product list from the exported
// CSV and downloads each product image from the Bubble CDN into public/.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CSV = path.join(
  ROOT,
  "cssSiteAntigo/img/cardapio/export_All-produtos-modified--_2026-06-14_01-27-12.csv",
);
const PUBLIC = path.join(ROOT, "public", "img", "cardapio");

function parseCSV(s) {
  const rows = [];
  let row = [], cur = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

const CAT = {
  "Pizza Salgada": { key: "pizza-salgada", dir: "salgada" },
  "Pizza Doce": { key: "pizza-doce", dir: "doce" },
  "Vegana": { key: "vegana", dir: "vegana" },
  "Fornerito": { key: "fornerito", dir: "fornerito" },
};

const SMALL = new Set(["com", "de", "e", "da", "do", "das", "dos", "ao", "a", "no", "na", "sem"]);
function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => {
      if (/[&]/.test(w)) return w.toUpperCase();
      if (i > 0 && SMALL.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ")
    .trim();
}
function slugify(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const rows = parseCSV(fs.readFileSync(CSV, "utf8"));
const h = rows[0];
const iN = h.indexOf("nome"), iC = h.indexOf("categoria"), iImg = h.indexOf("imagem");
const data = rows.slice(1).filter((r) => (r[iN] || "").trim());

// ---- Ingredients (product CSV references ingredient IDs) ----
const ING_CSV = path.join(
  ROOT,
  "cssSiteAntigo/img/export_All-ingredientes-modified--_2026-06-14_03-20-15.csv",
);
const ingredientById = {};
if (fs.existsSync(ING_CSV)) {
  const ir = parseCSV(fs.readFileSync(ING_CSV, "utf8"));
  const ih = ir[0];
  const iId = ih.indexOf("unique id"), iNome = ih.indexOf("nome");
  for (const r of ir.slice(1)) {
    const id = (r[iId] || "").trim();
    if (id) ingredientById[id] = (r[iNome] || "").trim();
  }
}
const iIng = h.indexOf("ingredientes_table");
function ingredientsFor(row) {
  const ids = (row[iIng] || "").split(",").map((s) => s.trim()).filter(Boolean);
  const names = ids.map((id) => ingredientById[id]).filter(Boolean);
  return names.join(", ");
}

// ---- Nutrition table (joined by product name, preferring the 30 cm size) ----
const NUTRI_CSV = path.join(
  ROOT,
  "cssSiteAntigo/img/export_All-tabela-nutricionals-modified--_2026-06-14_03-12-38.csv",
);
const nutritionBySlug = {};
if (fs.existsSync(NUTRI_CSV)) {
  const nr = parseCSV(fs.readFileSync(NUTRI_CSV, "utf8"));
  const nh = nr[0];
  const nc = (r, n) => (r[nh.indexOf(n)] || "").trim();
  for (const r of nr.slice(1)) {
    const prod = nc(r, "produto");
    if (!prod) continue;
    const key = slugify(prod);
    const size = nc(r, "tamanho");
    const entry = {
      porcao: nc(r, "porcao"),
      carboidratos: nc(r, "carboidratos"),
      proteinas: nc(r, "proteinas"),
      gordurasTotais: nc(r, "gorduras_totais"),
      gordurasSaturadas: nc(r, "gorduras_saturadas"),
      fibras: nc(r, "fibras"),
      caloriasKcal: nc(r, "calorias_kcal"),
      gordurasTrans: nc(r, "gorduras_trans"),
      sodio: nc(r, "sodio"),
      caloriasKj: nc(r, "calorias_kj"),
    };
    // Keep the first seen, but always prefer the 30 cm size when available.
    if (!nutritionBySlug[key] || /30/.test(size)) nutritionBySlug[key] = entry;
  }
}

// Set SKIP_DOWNLOAD=1 to only regenerate the data file (keep existing images).
const SKIP = process.env.SKIP_DOWNLOAD === "1";
if (!SKIP) {
  // Reset category folders to avoid orphan files from previous runs.
  for (const { dir } of Object.values(CAT)) {
    fs.rmSync(path.join(PUBLIC, dir), { recursive: true, force: true });
    fs.mkdirSync(path.join(PUBLIC, dir), { recursive: true });
  }
}

const products = [];
const seen = new Set();
const tasks = [];

for (const r of data) {
  const catRaw = (r[iC] || "").trim();
  const cat = CAT[catRaw];
  if (!cat) { console.warn("Categoria desconhecida:", catRaw, r[iN]); continue; }
  const name = titleCase((r[iN] || "").trim());
  let slug = slugify(r[iN] || "");
  while (seen.has(slug)) slug += "-2";
  seen.add(slug);

  let url = (r[iImg] || "").trim();
  const image = `/img/cardapio/${cat.dir}/${slug}.png`;
  const nutrition = nutritionBySlug[slugify(r[iN] || "")];
  const ingredients = ingredientsFor(r);
  const product = { name, category: cat.key, slug, image };
  if (ingredients) product.ingredients = ingredients;
  if (nutrition) product.nutrition = nutrition;
  products.push(product);

  if (url) {
    if (url.startsWith("//")) url = "https:" + url;
    tasks.push({ url, dest: path.join(PUBLIC, cat.dir, `${slug}.png`), name });
  } else {
    console.warn("Sem imagem:", name);
  }
}

// Download with limited concurrency.
async function run() {
  if (SKIP) { console.log("SKIP_DOWNLOAD=1 — mantendo imagens existentes"); return; }
  let i = 0, ok = 0, fail = 0;
  const CONC = 8;
  async function worker() {
    while (i < tasks.length) {
      const t = tasks[i++];
      try {
        const res = await fetch(t.url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(t.dest, buf);
        ok++;
      } catch (e) {
        fail++;
        console.warn("FALHOU:", t.name, e.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log(`Imagens: ${ok} ok, ${fail} falhas`);
}

await run();

products.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
const header = `// AUTO-GENERATED by scripts/gen-cardapio-csv.mjs from the exported product CSV.
// Re-run the script to regenerate. Do not edit by hand.
import type { Product } from "./data";

export const products: Product[] = [
`;
const body = products.map((p) => `  ${JSON.stringify(p)},`).join("\n");
fs.writeFileSync(path.join(ROOT, "src", "lib", "products.data.ts"), header + body + "\n];\n");

const counts = products.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
console.log("Total:", products.length, counts);
