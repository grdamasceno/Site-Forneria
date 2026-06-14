import type { Metadata } from "next";
import Image from "next/image";
import HeroBanner from "@/components/HeroBanner";
import { getBrands } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Nossas Marcas — Forneria Original",
};

export const revalidate = 60;

export default async function NossasMarcasPage() {
  const brands = await getBrands();
  return (
    <>
      <HeroBanner title="Nossas Marcas" />

      {brands.map((brand, i) => {
        // Alternate the 2/3-width block from side to side; the logo always sits
        // on the outer edge of the screen.
        const blockRight = i % 2 === 0;

        const imageCol = (
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              sizes="(max-width: 768px) 70vw, 384px"
              className="object-contain"
            />
          </div>
        );

        const textCol = (
          <div>
            <h2 className="text-3xl font-extrabold text-forneria-red md:text-5xl">
              {brand.name}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-forneria-black/80">
              {brand.description}
            </p>
          </div>
        );

        return (
          <section
            key={brand.name}
            className={`${i % 2 === 0 ? "bg-forneria-gray" : "bg-white"} ${
              i > 0 ? "border-t border-dashed border-forneria-red/40" : ""
            }`}
          >
            <div className="w-full px-4 sm:px-6 lg:px-10">
              <div
                className={`w-full py-14 md:w-2/3 ${
                  blockRight ? "md:ml-auto" : "md:mr-auto"
                }`}
              >
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
                  {blockRight ? (
                    <>
                      {textCol}
                      {imageCol}
                    </>
                  ) : (
                    <>
                      {imageCol}
                      {textCol}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
