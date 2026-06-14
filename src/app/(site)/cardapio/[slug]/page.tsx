import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Nutrition, ProductCategory } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  vegana: "Vegana",
  "pizza-doce": "Pizza Doce",
  "pizza-salgada": "Pizza Salgada",
  fornerito: "Fornerito",
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug ?? "" }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} — Forneria Original` : "Produto não encontrado",
  };
}

const NUTRITION_ROWS: { key: keyof Nutrition; label: string }[][] = [
  [
    { key: "porcao", label: "Porção" },
    { key: "carboidratos", label: "Carboidratos" },
    { key: "proteinas", label: "Proteínas" },
    { key: "gordurasTotais", label: "Gorduras Totais" },
    { key: "gordurasSaturadas", label: "Gorduras Saturadas" },
  ],
  [
    { key: "fibras", label: "Fibras" },
    { key: "caloriasKcal", label: "Calorias Kcal" },
    { key: "gordurasTrans", label: "Gorduras Trans" },
    { key: "sodio", label: "Sódio" },
    { key: "caloriasKj", label: "Calorias KJ" },
  ],
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryLabel = CATEGORY_LABEL[product.category] ?? "Pizza";
  const nutrition = product.nutrition ?? {};

  return (
    <>
      {/* Banner with the floating pizza */}
      <section className="relative w-full overflow-hidden bg-forneria-black">
        <Image
          src="/img/cardapio/bg-pizza.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="container-fc relative flex min-h-[420px] flex-col justify-center py-12 md:min-h-[680px]">
          <div className="max-w-xl text-white">
            <span className="inline-block text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Pizza
            </span>
            <span className="mt-1 block h-1.5 w-20 bg-forneria-red" />

            <h1 className="mt-3 font-sans text-4xl font-black uppercase leading-[1.02] md:text-[3.7rem]">
              {product.name}
            </h1>

            {product.ingredients && (
              <p className="mt-5 max-w-lg text-base md:text-lg">
                <strong>INGREDIENTES:</strong> {product.ingredients}
              </p>
            )}

            <a
              href="#detalhes"
              className="mt-8 inline-flex items-center gap-2 rounded-[20px] bg-forneria-red px-6 py-2.5 font-bold text-white transition hover:bg-forneria-red-dark"
            >
              Mais detalhes
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </div>

          {/* Pizza — large, on the right (desktop). Centering lives on the
              wrapper so it doesn't conflict with the float transform. */}
          <div className="pointer-events-none absolute right-0 top-1/2 hidden w-[48%] max-w-[640px] -translate-y-1/2 md:block">
            <Image
              src={product.image}
              alt={product.name}
              width={718}
              height={718}
              priority
              sizes="48vw"
              className="animate-float h-auto w-full drop-shadow-2xl"
            />
          </div>

          {/* Pizza — mobile (stacked) */}
          <Image
            src={product.image}
            alt=""
            width={500}
            height={500}
            sizes="80vw"
            aria-hidden
            className="animate-float mx-auto mt-8 h-auto w-4/5 max-w-sm drop-shadow-2xl md:hidden"
          />
        </div>
      </section>

      {/* Details + nutrition */}
      <div id="detalhes" className="container-fc py-12">
        <nav className="mb-8 text-sm text-forneria-black/60">
          <Link href="/" className="text-forneria-red hover:underline">Home</Link>
          <span> / </span>
          <Link href="/cardapio" className="text-forneria-red hover:underline">Cardápio</Link>
          <span> / </span>
          <span className="uppercase">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, 448px"
              className="object-contain"
            />
          </div>

          <div>
            <span className="w-fit rounded-full bg-forneria-red/10 px-3 py-1 text-xs font-semibold uppercase text-forneria-red">
              {categoryLabel}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold uppercase text-forneria-black md:text-4xl">
              {product.name}
            </h2>

            {/* Stars */}
            <div className="mt-2 flex text-2xl text-yellow-400" aria-label="5 estrelas">
              {"★★★★★"}
            </div>

            <p className="mt-5 text-base leading-relaxed text-forneria-black/80">
              {product.ingredients ? (
                <>
                  <strong>INGREDIENTES:</strong> {product.ingredients}
                </>
              ) : (
                "Uma das nossas deliciosas opções, preparada com ingredientes selecionados e muito recheio — original como deve ser."
              )}
            </p>

            {/* Nutrition table */}
            <h3 className="mt-8 flex items-center gap-1 font-bold text-forneria-black">
              Tabela Nutricional <span className="text-forneria-red">›</span>
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 rounded-lg border-2 border-forneria-red/60 p-5 sm:grid-cols-2">
              {NUTRITION_ROWS.map((column, ci) => (
                <ul key={ci} className="space-y-1.5">
                  {column.map(({ key, label }) => (
                    <li key={key} className="flex justify-between gap-3 text-sm">
                      <span className="font-semibold text-forneria-black">{label}:</span>
                      <span className="text-forneria-red">{nutrition[key] ?? "—"}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <a
              href="https://deliverydireto.com.br/forneria-original"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full bg-forneria-red px-8 py-3 font-bold text-white transition hover:bg-forneria-red-dark"
            >
              Peça pelo delivery
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
