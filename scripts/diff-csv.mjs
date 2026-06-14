import fs from "node:fs";
const byCat = JSON.parse(fs.readFileSync("scripts/_csv-names.json","utf8"));
const catMap={"Pizza Salgada":"pizza-salgada","Pizza Doce":"pizza-doce","Vegana":"vegana","Fornerito":"fornerito"};
function slug(s){return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
// load generated
const gen = fs.readFileSync("src/lib/products.data.ts","utf8");
const genItems=[...gen.matchAll(/\{ name: (".*?"), category: "(.*?)", image:/g)].map(m=>({name:JSON.parse(m[1]),category:m[2]}));
const genSlugs=new Set(genItems.map(g=>slug(g.name)));
const genByCat={};
for(const g of genItems){(genByCat[g.category]=genByCat[g.category]||new Set()).add(slug(g.name));}

for(const [csvCat,names] of Object.entries(byCat)){
  const cat=catMap[csvCat];
  console.log(`\n===== ${csvCat} (${cat}) — CSV ${names.length} =====`);
  const missing=names.filter(n=>!genSlugs.has(slug(n)));
  const wrongCat=names.filter(n=>genSlugs.has(slug(n)) && !(genByCat[cat]&&genByCat[cat].has(slug(n))));
  console.log("FALTANDO (sem imagem/produto):", missing.length);
  missing.forEach(n=>console.log("   - "+n+"  ["+slug(n)+"]"));
  if(wrongCat.length){console.log("CATEGORIA DIFERENTE no gerado:");wrongCat.forEach(n=>console.log("   ~ "+n));}
}
