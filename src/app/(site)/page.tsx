import Link from "next/link";
import Carousel from "@/components/Carousel";
import BrandsCarousel from "@/components/BrandsCarousel";
import AppDownloadSection from "@/components/AppDownloadSection";
import WeeklySuggestion from "@/components/WeeklySuggestion";
import FranchiseVideo from "@/components/FranchiseVideo";
import MostOrdered from "@/components/MostOrdered";
import Testimonials from "@/components/Testimonials";
import HomeNews from "@/components/HomeNews";
import { getBanners } from "@/lib/queries";
import { SITE_URL, socialLinks } from "@/lib/data";

export const dynamic = "force-dynamic";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "Brand"],
  name: "Forneria Original",
  legalName: "Forneria Original Franquias LTDA",
  url: SITE_URL,
  logo: `${SITE_URL}/img/logo.png`,
  foundingDate: "2016",
  taxID: "34.104.005/0001-86",
  sameAs: socialLinks.map((s) => s.href),
  award: ["iFood Super Restaurantes 2024", "iFood Super Restaurantes 2025"],
};

export default async function HomePage() {
  const banners = await getBanners();
  return (
    <>
      {/* Visually hidden — the hero banner conveys the same message as an
          image, so this gives the page a real H1 without duplicating it
          on screen. */}
      <h1 className="sr-only">
        Forneria Original — Pizza com muito recheio, entregue quentinha
      </h1>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Carousel banners={banners} />

      <BrandsCarousel />
      <AppDownloadSection />
      <WeeklySuggestion />
      <FranchiseVideo />
      <MostOrdered />
      <Testimonials />
      <HomeNews />

      {/* Call to action */}
      <section className="bg-forneria-red">
        <div className="container-fc flex flex-col items-center gap-4 py-12 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Peça já a sua Forneria Original
          </h2>
          <p className="max-w-2xl text-white/90">
            Mais de 50 unidades espalhadas pelo Brasil prontas para levar o melhor
            da pizza até você.
          </p>
          <Link
            href="/cardapio"
            className="mt-2 rounded-full bg-white px-8 py-3 font-bold text-forneria-red transition hover:bg-gray-100"
          >
            Ver Cardápio
          </Link>
        </div>
      </section>
    </>
  );
}
