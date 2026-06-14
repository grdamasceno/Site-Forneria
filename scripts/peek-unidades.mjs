import fs from "node:fs";
const text = fs.readFileSync(
  "cssSiteAntigo/img/export_All-unidades-modified--_2026-06-14_01-54-51.csv",
  "utf8",
);
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
const rows = parseCSV(text);
const h = rows[0];
const data = rows.slice(1).filter((r) => (r[h.indexOf("nome")] || "").trim());
const col = (r, n) => r[h.indexOf(n)] || "";

// distribution by estado / UF
const est = {};
for (const r of data) { const e = col(r, "estado").trim() || col(r, "UF").trim(); est[e] = (est[e] || 0) + 1; }
console.log("Total:", data.length);
console.log("Por estado:", JSON.stringify(est, null, 2));

console.log("\n=== amostra (3) ===");
for (const r of data.slice(0, 3)) {
  console.log("nome:", col(r, "nome").trim());
  console.log("  estado/UF:", col(r, "estado"), "/", col(r, "UF"));
  console.log("  cidade/bairro:", col(r, "cidade"), "/", col(r, "bairro"));
  console.log("  logradouro/numero:", col(r, "logradouro"), col(r, "numero"));
  console.log("  funcionamento:", col(r, "funcionamento").slice(0, 80));
  console.log("  fachada:", col(r, "fachada").slice(0, 90));
  console.log("  ativo:", col(r, "ativo"));
}
