// Popula destaque_imagem (do CSV, Bubble CDN) e imagem_mobile (= principal)
// dos produtos. Mobile não existe no export, então usamos a imagem principal.
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

function parseCSV(s) {
  const R = []; let r = [], c = "", Q = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (Q) { if (ch === '"') { if (s[i + 1] === '"') { c += '"'; i++; } else Q = false; } else c += ch; }
    else { if (ch === '"') Q = true; else if (ch === ",") { r.push(c); c = ""; } else if (ch === "\n") { r.push(c); R.push(r); r = []; c = ""; } else if (ch === "\r") {} else c += ch; }
  }
  if (c.length || r.length) { r.push(c); R.push(r); }
  return R;
}
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// destaque do CSV
const rows = parseCSV(fs.readFileSync("cssSiteAntigo/img/cardapio/export_All-produtos-modified--_2026-06-14_01-27-12.csv", "utf8"));
const h = rows[0];
const col = (r, n) => (r[h.indexOf(n)] || "").trim();
const destBySlug = {};
for (const r of rows.slice(1)) {
  const nome = col(r, "nome"); if (!nome) continue;
  const d = col(r, "destaque_imagem");
  if (d) destBySlug[slugify(nome)] = d.startsWith("//") ? "https:" + d : d;
}

// produtos do banco
const dbRes = await fetch(`${URL}/rest/v1/produtos?select=id,slug,imagem,imagem_mobile,destaque_imagem`, { headers: H });
const produtos = await dbRes.json();

let destOk = 0, mobOk = 0;
for (const p of produtos) {
  // destaque
  const url = destBySlug[p.slug];
  if (url) {
    const res = await fetch(url);
    if (res.ok) {
      const ext = (url.split("/").pop().split("?")[0].split(".").pop() || "png").toLowerCase();
      const obj = `destaque/${p.slug}.${ext}`;
      await fetch(`${URL}/storage/v1/object/cardapio/${obj}`, {
        method: "POST",
        headers: { ...H, "Content-Type": res.headers.get("content-type") || "image/png", "x-upsert": "true" },
        body: Buffer.from(await res.arrayBuffer()),
      });
      const pub = `${URL}/storage/v1/object/public/cardapio/${obj}`;
      await fetch(`${URL}/rest/v1/produtos?id=eq.${p.id}`, {
        method: "PATCH", headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ destaque_imagem: pub }),
      });
      destOk++;
    }
  }
  // mobile = principal (se ainda não tiver)
  if (!p.imagem_mobile && p.imagem) {
    await fetch(`${URL}/rest/v1/produtos?id=eq.${p.id}`, {
      method: "PATCH", headers: { ...H, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ imagem_mobile: p.imagem }),
    });
    mobOk++;
  }
}
console.log(`destaque atualizados: ${destOk} | mobile preenchidos: ${mobOk}`);
