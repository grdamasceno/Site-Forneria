// Seeds the "Sugestão da Semana": uploads the round artworks as destaque
// images and flags the products as semana=true.
import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}
const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

const items = [
  { slug: "a-moda", file: "a-moda.png" },
  { slug: "calabresa", file: "calabresa.png" },
  { slug: "catuperoni", file: "catuperoni.png" },
];

for (const it of items) {
  const local = path.join(process.cwd(), "public/img/home/carrosel-pizzas-destaque", it.file);
  if (!fs.existsSync(local)) { console.warn("sem arquivo", it.file); continue; }
  const objPath = `destaque/${it.slug}.png`;
  const up = await fetch(`${URL}/storage/v1/object/cardapio/${objPath}`, {
    method: "POST",
    headers: { ...H, "Content-Type": "image/png", "x-upsert": "true" },
    body: fs.readFileSync(local),
  });
  const url = `${URL}/storage/v1/object/public/cardapio/${objPath}`;
  const patch = await fetch(`${URL}/rest/v1/produtos?slug=eq.${it.slug}`, {
    method: "PATCH",
    headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ semana: true, destaque_imagem: url }),
  });
  console.log(`${it.slug}: upload ${up.status}, update ${patch.status}`);
}
