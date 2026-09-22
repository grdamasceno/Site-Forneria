import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitBySlug } from "@/lib/queries";
import { absoluteImageUrl, SITE_URL } from "@/lib/data";

type Params = { params: Promise<{ slug: string }> };

// Same pattern as /cardapio/[slug] and /novidades/[slug]: fully dynamic
// rather than statically generated. Next.js has a known issue where
// generateStaticParams + ISR + notFound() for a param outside that list
// serves a 200 with the not-found content instead of a real 404 (bad for
// SEO — reads as a "soft 404" to Google). force-dynamic avoids that class
// of bug entirely.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);
  if (!unit) return { title: "Unidade não encontrada" };

  const cityPart = unit.city ? ` em ${unit.city}` : "";
  return {
    title: `Forneria Original ${unit.name} — Pizzaria e Delivery`,
    description: `Forneria Original ${unit.name}${cityPart}: endereço, telefone e horário de funcionamento. Peça pizza artesanal com delivery rápido.`,
    alternates: { canonical: `/unidades/${slug}` },
    openGraph: { images: unit.image ? [{ url: unit.image }] : undefined },
  };
}

export default async function UnidadePage({ params }: Params) {
  const { slug } = await params;
  const unit = await getUnitBySlug(slug);
  if (!unit) notFound();

  const hours = unit.hours
    ? unit.hours.split(/[|\n]/).map((h) => h.trim()).filter(Boolean)
    : [];

  const destination = [unit.address, unit.city, unit.state].filter(Boolean).join(", ");
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
  const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`;

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Forneria Original ${unit.name}`,
    image: absoluteImageUrl(unit.image),
    url: `${SITE_URL}/unidades/${slug}`,
    telephone: unit.phone || undefined,
    servesCuisine: "Pizza",
    address: {
      "@type": "PostalAddress",
      streetAddress: unit.address || undefined,
      addressLocality: unit.city || undefined,
      addressRegion: unit.state || undefined,
      addressCountry: "BR",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Forneria Original",
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Unidades", item: `${SITE_URL}/unidades` },
      { "@type": "ListItem", position: 3, name: unit.name, item: `${SITE_URL}/unidades/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero using the unit's own facade photo */}
      <section className="relative h-[260px] w-full overflow-hidden md:h-[340px]">
        <Image
          src={unit.image || "/img/banner-interno.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="hero-title">Forneria Original {unit.name}</h1>
        </div>
      </section>

      <div className="container-fc py-10">
        <nav className="mb-8 text-sm text-forneria-black/60">
          <Link href="/" className="text-forneria-red hover:underline">Home</Link>
          <span> / </span>
          <Link href="/unidades" className="text-forneria-red hover:underline">Unidades</Link>
          <span> / </span>
          <span>{unit.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-forneria-black md:text-3xl">
              Forneria Original {unit.name}
            </h2>

            <p className="mt-5 flex items-start gap-2 text-base text-forneria-black/80">
              <svg className="mt-1 h-5 w-5 shrink-0 text-forneria-red" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>
                {unit.address}
                {unit.city ? ` — ${unit.city}${unit.state ? `, ${unit.state}` : ""}` : ""}
              </span>
            </p>

            {unit.phone && (
              <a
                href={`tel:${unit.phone.replace(/\D/g, "")}`}
                className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-forneria-red"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z" />
                </svg>
                {unit.phone}
              </a>
            )}

            {hours.length > 0 && (
              <div className="mt-5 flex items-start gap-2 text-sm text-forneria-black/70">
                <svg className="mt-1 h-5 w-5 shrink-0 text-forneria-red" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.5V7h-2v6.5l5 3 1-1.7-4-2.3z" />
                </svg>
                <span className="flex flex-col gap-1">
                  {hours.map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                </span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://pedidos.forneriaoriginal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-forneria-red px-8 py-3 font-bold text-white transition hover:bg-forneria-red-dark"
              >
                Peça pelo delivery
              </a>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border-2 border-forneria-red px-8 py-3 font-bold text-forneria-red transition hover:bg-forneria-red hover:text-white"
              >
                Como chegar
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <iframe
              title={`Mapa — Forneria Original ${unit.name}`}
              src={mapsEmbedUrl}
              className="h-[360px] w-full md:h-full md:min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  );
}
