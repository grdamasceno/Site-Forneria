import Image from "next/image";
import Link from "next/link";
import { productSlug } from "@/lib/data";
import { getWeeklySuggestions } from "@/lib/queries";

/**
 * "Sugestão da Semana" home band: a red gradient section with a dripping wavy
 * top edge, a gold/white title, and round pizzas (products flagged "semana")
 * that rotate gently. Each pizza links to its product page.
 */
export default async function WeeklySuggestion() {
  const weeklySuggestions = await getWeeklySuggestions();
  if (weeklySuggestions.length === 0) return null;
  // Duplicate the list so the -50% translate loops seamlessly in one row.
  const loop = [...weeklySuggestions, ...weeklySuggestions];
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

        {/* Pizzas — single-row autoplay marquee (pauses on hover) */}
        <div className="marquee-pause relative overflow-hidden pb-16">
          <ul className="animate-marquee flex w-max items-center gap-8 px-4 md:gap-16">
            {loop.map((product, i) => (
              <li key={`${product.name}-${i}`} className="shrink-0">
                <Link
                  href={`/cardapio/${productSlug(product)}`}
                  title={product.name}
                  aria-hidden={i >= weeklySuggestions.length}
                  tabIndex={i >= weeklySuggestions.length ? -1 : undefined}
                  className="group block"
                >
                  <span className="block overflow-hidden rounded-full shadow-xl ring-4 ring-white/10 transition group-hover:scale-105 group-hover:ring-white/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={220}
                      height={220}
                      sizes="(max-width: 768px) 40vw, 220px"
                      className="h-32 w-32 animate-[spin_22s_linear_infinite] rounded-full object-cover [animation-play-state:running] group-hover:[animation-play-state:paused] md:h-40 md:w-40"
                      style={{ animationDelay: `${i * -4}s` }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
