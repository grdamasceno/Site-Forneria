"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/data";

/**
 * "Satisfação de quem comprou" home section: a row of review cards (5 on
 * desktop, fewer on smaller screens) where the centered card is highlighted in
 * red. The window auto-rotates one at a time to cycle through every review.
 * Pauses on hover.
 */
export default function Testimonials() {
  const count = testimonials.length;
  const [visible, setVisible] = useState(5);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive number of visible cards (always odd, so there's a clear center).
  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const update = () => setVisible(mqLg.matches ? 5 : mqMd.matches ? 3 : 1);
    update();
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (paused || count <= visible) return;
    const id = setInterval(() => setStart((s) => (s + 1) % count), 4500);
    return () => clearInterval(id);
  }, [paused, count, visible]);

  const window_ = Array.from({ length: Math.min(visible, count) }, (_, k) => ({
    item: testimonials[(start + k) % count],
    pos: k,
  }));
  const center = Math.floor(Math.min(visible, count) / 2);

  return (
    <section className="bg-white py-14">
      <div className="container-fc">
        {/* Title with side lines */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
          <h2 className="whitespace-nowrap text-center text-2xl font-black uppercase tracking-wide md:text-4xl">
            <span className="text-forneria-gray-text">Satisfação de </span>
            <span className="font-normal text-[#f35b5b]">Quem Comprou</span>
          </h2>
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
        </div>

        {/* Cards row — podium: center is tallest, then the neighbours, then
            the outermost cards, all aligned along the bottom. */}
        <div
          className="flex items-end justify-center gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {window_.map(({ item, pos }) => {
            const highlight = pos === center;
            const distance = Math.abs(pos - center);
            // 0 = center (tallest), 1 = neighbour, 2 = outermost (shortest).
            const heightByTier = ["min-h-[440px]", "min-h-[370px]", "min-h-[310px]"];
            const tier = heightByTier[distance] ?? heightByTier[2];
            return (
              <article
                key={`${start}-${pos}`}
                className={`flex flex-1 animate-[fadeIn_0.6s_ease] flex-col items-center justify-center rounded-2xl px-6 py-8 text-center shadow-sm transition ${tier} ${
                  highlight
                    ? "bg-forneria-red text-white shadow-lg"
                    : "border border-forneria-red/30 bg-white text-forneria-black/80"
                }`}
              >
                <div
                  className="text-xl text-forneria-gold"
                  aria-label="5 estrelas"
                >
                  ★★★★★
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed">
                  {item.text}
                </p>
                <p
                  className={`mt-6 font-bold ${
                    highlight ? "text-white" : "text-forneria-black"
                  }`}
                >
                  {item.name}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
