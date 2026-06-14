import WeeklyCarousel from "@/components/WeeklyCarousel";
import { getWeeklySuggestions } from "@/lib/queries";

/**
 * "Sugestão da Semana" home band: a red gradient section with a dripping wavy
 * top edge, a gold/white title, and round pizzas (products flagged "semana")
 * that rotate gently. Each pizza links to its product page.
 */
export default async function WeeklySuggestion() {
  const weeklySuggestions = await getWeeklySuggestions();
  if (weeklySuggestions.length === 0) return null;
  return (
    <section className="relative bg-white">
      {/* Red band (brand gradient) */}
      <div className="bg-grad-dark relative">
        {/* Dripping wavy top edge — original bg-curve.svg, rotated 180deg */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-[100px] w-full md:h-[135px]"
          style={{
            backgroundImage: "url(/img/home/bg-curve.svg)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "1900px",
            transform: "rotate(180deg)",
          }}
        />

        <div className="container-fc relative px-4 pb-16 pt-28 md:pt-36">
          {/* Title */}
          <div className="mb-12 flex items-center justify-center gap-4">
            <span className="hidden h-px max-w-[180px] flex-1 bg-white sm:block" />
            <h2 className="whitespace-nowrap text-2xl font-extrabold uppercase tracking-wide md:text-3xl">
              <span className="text-white">Sugestão </span>
              <span className="text-forneria-gold">da Semana</span>
            </h2>
            <span className="hidden h-px max-w-[180px] flex-1 bg-white sm:block" />
          </div>

        </div>

        {/* Pizzas — shows 3 at a time, auto-rotating through the rest */}
        <WeeklyCarousel products={weeklySuggestions} />
      </div>
    </section>
  );
}
