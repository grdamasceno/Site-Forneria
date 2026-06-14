"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { homeBrands } from "@/lib/data";

/**
 * "Nossas Marcas" home section: a single row of round brand logos (5 at a time
 * on desktop, fewer on smaller screens) that auto-rotates one item at a time to
 * reveal the rest. No continuous marquee — a fixed row that swaps with a fade.
 * Pauses on hover.
 */
export default function BrandsCarousel() {
  const count = homeBrands.length;
  const [visible, setVisible] = useState(5);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive number of visible logos.
  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const update = () =>
      setVisible(mqLg.matches ? 5 : mqMd.matches ? 4 : mqSm.matches ? 3 : 2);
    update();
    mqSm.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  // Auto-advance one logo at a time, only when there's something hidden.
  useEffect(() => {
    if (paused || count <= visible) return;
    const id = setInterval(() => setStart((s) => (s + 1) % count), 3500);
    return () => clearInterval(id);
  }, [paused, count, visible]);

  const window_ = Array.from(
    { length: Math.min(visible, count) },
    (_, k) => homeBrands[(start + k) % count],
  );

  return (
    <section className="bg-white py-14">
      <div className="container-fc">
        {/* Title with side lines */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
          <h2 className="whitespace-nowrap text-3xl font-black uppercase tracking-wide md:text-4xl">
            <span className="text-forneria-gray-text">Nossas </span>
            <span className="font-normal text-[#f35b5b]">Marcas</span>
          </h2>
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
        </div>

        {/* Single row of logos, auto-rotating */}
        <div
          className="flex items-center justify-center gap-6 md:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {window_.map((brand, i) => (
            <Link
              key={`${start}-${brand.name}-${i}`}
              href={brand.href}
              title={brand.name}
              className="group block animate-[fadeIn_0.6s_ease]"
            >
              <span className="block overflow-hidden rounded-full ring-1 ring-black/5 transition duration-300 group-hover:scale-105">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 30vw, 160px"
                  className="h-28 w-28 object-cover brightness-90 transition group-hover:brightness-100 md:h-40 md:w-40"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
