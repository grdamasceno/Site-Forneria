import fs from "node:fs";
const file = "cssSiteAntigo/img/cardapio/export_All-produtos-modified--_2026-06-14_01-27-12.csv";
const text = fs.readFileSync(file, "utf8");
// Simple CSV parser handling quotes and embedded commas/newlines
function parseCSV(s){
  const rows=[]; let row=[],cur="",q=false;
  for(let i=0;i<s.length;i++){const c=s[i];
    if(q){ if(c=='"'){ if(s[i+1]=='"'){cur+='"';i++;} else q=false;} else cur+=c; }
    else { if(c=='"')q=true; else if(c==',' ){row.push(cur);cur="";} else if(c=='\n'){row.push(cur);rows.push(row);row=[];cur="";} else if(c=='\r'){} else cur+=c; }
  }
  if(cur.length||row.length){row.push(cur);rows.push(row);}
  return rows;
}
const rows=parseCSV(text);
const head=rows[0];
const idxNome=head.indexOf("nome"), idxCat=head.indexOf("categoria"), idxAtivo=head.indexOf("ativo");
const data=rows.slice(1).filter(r=>r.length>=head.length && (r[idxNome]||"").trim());
console.log("Total CSV produtos:", data.length);
const catCount={};
for(const r of data){const c=(r[idxCat]||"").trim(); catCount[c]=(catCount[c]||0)+1;}
console.log("Categorias:", JSON.stringify(catCount,null,2));
// list names by category
const byCat={};
for(const r of data){const c=(r[idxCat]||"").trim(); (byCat[c]=byCat[c]||[]).push((r[idxNome]||"").trim());}
fs.writeFileSync("scripts/_csv-names.json", JSON.stringify(byCat,null,2));
console.log("nomes salvos em scripts/_csv-names.json");
