import Image from "next/image";
import Link from "next/link";
import { productSlug } from "@/lib/data";
import { getMostOrdered } from "@/lib/queries";

/**
 * Home "Mais Pedidos" section: light background, gray/red title with side lines
 * and three fixed best-sellers (Calabresa, A Moda, Catuperoni) that spin gently,
 * each linking to its product page. No carousel — just the three pizzas.
 */
export default async function MostOrdered() {
  const mostOrdered = await getMostOrdered();
  if (mostOrdered.length === 0) return null;
  return (
    <section className="bg-white pb-16 pt-14">
      <div className="container-fc">
        {/* Title */}
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
          <h2 className="whitespace-nowrap text-3xl font-black uppercase tracking-wide md:text-4xl">
            <span className="text-forneria-gray-text">Mais </span>
            <span className="font-normal text-[#f35b5b]">Pedidos</span>
          </h2>
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
        </div>

        {/* Pizzas */}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
          {mostOrdered.map((product, i) => (
            <Link
              key={product.name}
              href={`/cardapio/${productSlug(product)}`}
              title={product.name}
              className="group block"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                sizes="(max-width: 768px) 40vw, 200px"
                className="h-32 w-32 animate-[spin_22s_linear_infinite] object-contain transition group-hover:scale-105 group-hover:[animation-play-state:paused] md:h-40 md:w-40"
                style={{ animationDelay: `${i * -5}s` }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
