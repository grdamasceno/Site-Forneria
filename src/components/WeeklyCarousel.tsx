"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { productSlug, type Product } from "@/lib/data";

/**
 * "Sugestão da Semana" pizzas: shows a window of 3 (responsive: 1 on mobile,
 * 2 on small, 3 on desktop) that auto-advances one product at a time, fading
 * between sets so every pizza eventually appears. Each pizza spins gently and
 * links to its product page. Pauses on hover.
 */
export default function WeeklyCarousel({ products }: { products: Product[] }) {
  const count = products.length;
  const [visible, setVisible] = useState(3);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive number of visible pizzas.
  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const update = () => setVisible(mqMd.matches ? 3 : mqSm.matches ? 2 : 1);
    update();
    mqSm.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
    };
  }, []);

  // Auto-advance one product at a time.
  useEffect(() => {
    if (paused || count <= visible) return;
    const id = setInterval(() => setStart((s) => (s + 1) % count), 3500);
    return () => clearInterval(id);
  }, [paused, count, visible]);

  const window_ = Array.from(
    { length: Math.min(visible, count) },
    (_, k) => products[(start + k) % count],
  );

  return (
    <div
      className="flex items-center justify-center gap-8 px-4 pb-16 md:gap-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {window_.map((product, i) => (
        <Link
          key={`${start}-${product.name}-${i}`}
          href={`/cardapio/${productSlug(product)}`}
          title={product.name}
          className="group block animate-[fadeIn_0.6s_ease]"
        >
          <span className="block overflow-hidden rounded-full shadow-xl ring-4 ring-white/10 transition group-hover:scale-105 group-hover:ring-white/30">
            <Image
              src={product.image}
              alt={product.name}
              width={220}
              height={220}
              sizes="(max-width: 768px) 60vw, 220px"
              className="h-32 w-32 animate-[spin_22s_linear_infinite] rounded-full object-cover group-hover:[animation-play-state:paused] md:h-40 md:w-40"
            />
          </span>
        </Link>
      ))}
    </div>
  );
}
