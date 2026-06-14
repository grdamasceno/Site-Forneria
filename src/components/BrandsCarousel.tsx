import Image from "next/image";
import Link from "next/link";
import { homeBrands } from "@/lib/data";

/**
 * "Nossas Marcas" home section: round brand logos in a continuous, seamless
 * marquee loop (~5 visible at a time). The track holds two copies of the list
 * and slides -50%, so it loops forever. Pauses on hover.
 */
export default function BrandsCarousel() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...homeBrands, ...homeBrands];

  return (
    <section className="bg-white py-14">
      <div className="container-fc">
        {/* Title with side lines */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
          <h2 className="whitespace-nowrap text-3xl font-black uppercase tracking-wide md:text-4xl">
            <span className="text-forneria-gray-text">Nossas </span>
            <span className="font-normal text-[#f35b5b]">Marcas</span>
          </h2>
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
        </div>
      </div>

      {/* Marquee viewport (centered, 70% of screen width) */}
      <div className="marquee-pause mx-auto w-[70%] overflow-hidden">
        <ul className="animate-marquee flex w-max items-center gap-8 px-4">
          {loop.map((brand, i) => (
            <li key={`${brand.name}-${i}`} className="shrink-0">
              <Link
                href={brand.href}
                title={brand.name}
                aria-hidden={i >= homeBrands.length}
                tabIndex={i >= homeBrands.length ? -1 : undefined}
                className="group block"
              >
                <span className="block overflow-hidden rounded-full ring-1 ring-black/5 transition duration-300 group-hover:scale-105">
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={500}
                    height={500}
                    sizes="(max-width: 768px) 45vw, 200px"
                    className="h-40 w-40 object-cover brightness-90 transition group-hover:brightness-100 md:h-48 md:w-48"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
