import Link from "next/link";
import Carousel from "@/components/Carousel";
import BrandsCarousel from "@/components/BrandsCarousel";
import AppDownloadSection from "@/components/AppDownloadSection";
import WeeklySuggestion from "@/components/WeeklySuggestion";
import FranchiseVideo from "@/components/FranchiseVideo";
import MostOrdered from "@/components/MostOrdered";
import HomeNews from "@/components/HomeNews";
import { getBanners } from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const banners = await getBanners();
  return (
    <>
      <Carousel banners={banners} />

      <BrandsCarousel />
      <AppDownloadSection />
      <WeeklySuggestion />
      <FranchiseVideo />
      <MostOrdered />
      <HomeNews />

      {/* Call to action */}
      <section className="bg-forneria-red">
        <div className="container-fc flex flex-col items-center gap-4 py-12 text-center text-white">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Peça já a sua Forneria Original
          </h2>
          <p className="max-w-2xl text-white/90">
            Mais de 54 unidades espalhadas pelo Brasil prontas para levar o melhor
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
