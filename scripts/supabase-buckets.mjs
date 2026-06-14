// Creates the public storage buckets in Supabase (idempotent).
// Reads credentials from .env.local.
import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKETS = ["cardapio", "unidades", "blog", "marcas", "banners", "paginas"];

for (const id of BUCKETS) {
  const res = await fetch(`${URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name: id, public: true }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) console.log(`✓ bucket criado: ${id}`);
  else if (body?.error === "Duplicate" || /already exists/i.test(body?.message || ""))
    console.log(`• bucket já existia: ${id}`);
  else console.warn(`✗ falha em ${id}:`, res.status, body);
}

// List final state
const list = await fetch(`${URL}/storage/v1/bucket`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});
console.log("Buckets:", (await list.json()).map((b) => `${b.name}${b.public ? " (público)" : ""}`).join(", "));
