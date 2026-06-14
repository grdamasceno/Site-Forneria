"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { productSlug, type Product, type ProductCategory } from "@/lib/data";

type Filter = ProductCategory | "todos";

export type CardapioFilter = { key: Filter; label: string; count: number };

const filterIcons: Record<Filter, React.ReactNode> = {
  todos: <PizzaIcon />,
  vegana: <SliceIcon />,
  "pizza-doce": <SliceIcon />,
  "pizza-salgada": <SliceIcon />,
  fornerito: <BoxIcon />,
};

export default function CardapioClient({
  products,
  categoryFilters,
}: {
  products: Product[];
  categoryFilters: CardapioFilter[];
}) {
  const [active, setActive] = useState<Filter>("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = active === "todos" || p.category === active;
      const matchesQuery = p.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [active, query, products]);

  return (
    <div className="container-fc py-10">
      <h2 className="mb-6 text-3xl font-light text-forneria-black">Filtro</h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-lg border border-forneria-red/40 p-4">
          <div className="relative mb-5">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procure pela sua pizza..."
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-forneria-red"
            />
          </div>

          <ul className="space-y-1">
            {categoryFilters.map((filter) => {
              const isActive = active === filter.key;
              return (
                <li key={filter.key}>
                  <button
                    type="button"
                    onClick={() => setActive(filter.key)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left transition ${
                      isActive ? "bg-forneria-red/5" : "hover:bg-forneria-gray"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-forneria-black/70">
                        {filterIcons[filter.key]}
                      </span>
                      <span className="font-medium text-forneria-black">
                        {filter.label}
                      </span>
                    </span>
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-forneria-red px-2 text-xs font-bold text-white">
                      {filter.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Product grid */}
        <div>
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-forneria-black/60">
              Nenhuma pizza encontrada para “{query}”.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={productSlug(product)}
                  name={product.name}
                  image={product.image}
                  slug={productSlug(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PizzaIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="14" cy="9" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

function SliceIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path d="M3 7l9 13 9-13z" />
      <circle cx="10" cy="9" r="1" fill="currentColor" />
      <circle cx="13" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <path d="M3 11h18" />
    </svg>
  );
}
