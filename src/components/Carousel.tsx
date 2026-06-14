"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/data";

/**
 * Home hero slider: full-width banner images (text is baked into the artwork),
 * with desktop/mobile variants, lateral navigation arrows, dots and
 * auto-advance. Arrows/dots only show when there is more than one banner.
 */
export default function Carousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const count = banners.length;
  const multiple = count > 1;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (!multiple) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, multiple]);

  const banner = banners[index];

  const content = (
    <>
      {/* Desktop */}
      <Image
        src={banner.image}
        alt={banner.alt}
        width={banner.imageWidth}
        height={banner.imageHeight}
        priority
        sizes="100vw"
        className={`h-auto w-full ${banner.imageMobile ? "hidden md:block" : "block"}`}
      />
      {/* Mobile */}
      {banner.imageMobile && (
        <Image
          src={banner.imageMobile}
          alt={banner.alt}
          width={banner.imageMobileWidth ?? banner.imageWidth}
          height={banner.imageMobileHeight ?? banner.imageHeight}
          priority
          sizes="100vw"
          className="block h-auto w-full md:hidden"
        />
      )}
    </>
  );

  return (
    <section className="relative w-full bg-white">
      {banner.href ? (
        <Link href={banner.href} aria-label={banner.alt}>
          {content}
        </Link>
      ) : (
        content
      )}

      {multiple && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Banner anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-forneria-black shadow transition hover:bg-white md:left-4"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próximo banner"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-forneria-black shadow transition hover:bg-white md:right-4"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para o banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-sm transition-all ${
                  i === index ? "w-7 bg-forneria-red-bright" : "w-5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
