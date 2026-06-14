import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CardapioClient, { type CardapioFilter } from "@/components/CardapioClient";
import { getProducts } from "@/lib/queries";
import type { ProductCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cardápio — Forneria Original",
};

export const revalidate = 60;

const FILTERS: { key: ProductCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "vegana", label: "Vegana" },
  { key: "pizza-doce", label: "Pizza Doce" },
  { key: "pizza-salgada", label: "Pizza Salgada" },
  { key: "fornerito", label: "Fornerito" },
];

export default async function CardapioPage() {
  const products = await getProducts();

  const categoryFilters: CardapioFilter[] = FILTERS.map((f) => ({
    ...f,
    count:
      f.key === "todos"
        ? products.length
        : products.filter((p) => p.category === f.key).length,
  }));

  return (
    <>
      <HeroBanner title="Cardápio" />
      <CardapioClient products={products} categoryFilters={categoryFilters} />
    </>
  );
}
