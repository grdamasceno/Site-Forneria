import fs from "node:fs";
const text = fs.readFileSync(
  "cssSiteAntigo/img/cardapio/export_All-produtos-modified--_2026-06-14_01-27-12.csv",
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
const iN = h.indexOf("nome"), iC = h.indexOf("categoria"),
  iImg = h.indexOf("imagem"), iDest = h.indexOf("destaque_imagem");
const tail = (u) => (u || "").split("/").slice(-2).join("/");
for (const r of rows.slice(1)) {
  if ((r[iC] || "").trim() !== "Fornerito") continue;
  console.log((r[iN] || "").trim());
  console.log("   img :", tail(r[iImg]));
  console.log("   dest:", tail(r[iDest]));
}
