import type { Nutrition } from "@/lib/data";

const NUTRITION_FIELDS: { key: keyof Nutrition; label: string }[] = [
  { key: "porcao", label: "Porção" },
  { key: "carboidratos", label: "Carboidratos" },
  { key: "proteinas", label: "Proteínas" },
  { key: "gordurasTotais", label: "Gorduras Totais" },
  { key: "gordurasSaturadas", label: "Gorduras Saturadas" },
  { key: "fibras", label: "Fibras" },
  { key: "caloriasKcal", label: "Calorias Kcal" },
  { key: "gordurasTrans", label: "Gorduras Trans" },
  { key: "sodio", label: "Sódio" },
  { key: "caloriasKj", label: "Calorias KJ" },
];

export default function NutritionTables({ list }: { list: Nutrition[] }) {
  if (list.length === 0) return null;

  return (
    <div>
      <h3 className="mt-8 flex items-center gap-1 font-bold text-forneria-black">
        Tabela Nutricional <span className="text-forneria-red">›</span>
      </h3>

      <div className={`mt-3 grid gap-4 ${list.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {list.map((n, i) => (
          <div key={i} className="rounded-lg border-2 border-forneria-red/60 p-5">
            {n.tamanho && (
              <p className="mb-3 border-b border-forneria-red/20 pb-2 text-center font-bold uppercase text-forneria-red">
                {n.tamanho}
              </p>
            )}
            <ul className="space-y-1.5">
              {NUTRITION_FIELDS.map(({ key, label }) => (
                <li key={key} className="flex justify-between gap-3 text-sm">
                  <span className="font-semibold text-forneria-black">{label}:</span>
                  <span className="text-forneria-red">{n[key] ?? "—"}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
