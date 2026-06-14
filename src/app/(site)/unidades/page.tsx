import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import UnidadesClient from "@/components/UnidadesClient";
import { getUnits } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Nossas Unidades — Forneria Original",
};

export const dynamic = "force-dynamic";

export default async function UnidadesPage() {
  const units = await getUnits();
  return (
    <>
      <HeroBanner title="Nossas Unidades" />
      <UnidadesClient units={units} />

      {/* Mapa geral das unidades (Google My Maps) */}
      <section className="bg-forneria-gray py-12">
        <h2 className="mb-6 text-center text-2xl font-extrabold uppercase tracking-wide md:text-3xl">
          <span className="text-forneria-gray-text">Encontre uma </span>
          <span className="text-forneria-red">unidade</span>
        </h2>
        <div className="mx-auto w-[95%] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <iframe
            title="Mapa das unidades Forneria Original"
            src="https://www.google.com/maps/d/u/0/embed?mid=1qcAed1kuklN5qbqza1BbdsfoSn-X9ao&ehbc=2E312F"
            className="h-[480px] w-full md:h-[600px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
