import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CardapioClient, { type CardapioFilter } from "@/components/CardapioClient";
import { getProducts } from "@/lib/queries";
import { absoluteImageUrl, productSlug, SITE_URL, type Product, type ProductCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cardápio — Forneria Original",
  description:
    "Confira o cardápio completo da Forneria Original: pizzas salgadas, doces, veganas e fornerito, com muito recheio e ingredientes selecionados. Peça já pelo delivery.",
  alternates: { canonical: "/cardapio" },
};

export const dynamic = "force-dynamic";

const FILTERS: { key: ProductCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "vegana", label: "Vegana" },
  { key: "pizza-doce", label: "Pizza Doce" },
  { key: "pizza-salgada", label: "Pizza Salgada" },
  { key: "fornerito", label: "Fornerito" },
];

const SECTION_LABEL: Record<ProductCategory, string> = {
  vegana: "Vegana",
  "pizza-doce": "Pizza Doce",
  "pizza-salgada": "Pizza Salgada",
  fornerito: "Fornerito",
};

function menuSchema(products: Product[]) {
  const sections = (Object.keys(SECTION_LABEL) as ProductCategory[])
    .map((category) => {
      const items = products.filter((p) => p.category === category);
      if (items.length === 0) return null;
      return {
        "@type": "MenuSection",
        name: SECTION_LABEL[category],
        hasMenuItem: items.map((p) => ({
          "@type": "MenuItem",
          name: p.name,
          description: p.ingredients,
          image: absoluteImageUrl(p.image),
          url: `${SITE_URL}/cardapio/${productSlug(p)}`,
          ...(category === "vegana" && { suitableForDiet: "https://schema.org/VeganDiet" }),
        })),
      };
    })
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Cardápio Forneria Original",
    hasMenuSection: sections,
  };
}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema(products)) }}
      />

      <HeroBanner title="Cardápio" />
      <CardapioClient products={products} categoryFilters={categoryFilters} />
    </>
  );
}
