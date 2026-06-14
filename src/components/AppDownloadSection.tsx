"use client";

import { useEffect, useRef, useState } from "react";

type Dir = "left" | "right" | "top" | "bottom";

const HIDDEN: Record<Dir, string> = {
  left: "-translate-x-32 opacity-0",
  right: "translate-x-32 opacity-0",
  top: "-translate-y-32 opacity-0",
  bottom: "translate-y-32 opacity-0",
};

function reveal(dir: Dir, visible: boolean) {
  const base = "transition-all duration-700 ease-out";
  return visible
    ? `${base} translate-x-0 translate-y-0 opacity-100`
    : `${base} ${HIDDEN[dir]}`;
}

/**
 * Row of red blocks promoting the Forneria Original app. Each block slides into
 * place from a different direction the first time the section scrolls into view.
 */
export default function AppDownloadSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect(); // run only once
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delay = (i: number) => ({ transitionDelay: visible ? `${i * 120}ms` : "0ms" });

  return (
    <section ref={ref} className="bg-white pb-16">
      <div className="container-fc grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Intro — from left */}
        <div style={delay(0)} className={`bg-grad-app flex items-center gap-4 rounded-[20px] p-6 text-white ${reveal("left", visible)}`}>
          <PhoneIcon />
          <p className="text-lg font-bold leading-snug">
            Você já tem o app da Forneria Original?
          </p>
        </div>

        {/* Android — from top */}
        <div style={delay(1)} className={`bg-grad-app flex flex-col justify-between gap-3 rounded-[20px] p-6 text-white ${reveal("top", visible)}`}>
          <div className="flex items-center gap-3">
            <PlayIcon />
            <p className="text-lg leading-snug">
              Baixe a <strong className="font-bold">Versão Android</strong>
            </p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.delivery.forneriaOriginal&hl=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded bg-white/15 px-3 py-1 text-sm font-medium transition hover:bg-white/25"
          >
            Baixe Agora
          </a>
        </div>

        {/* iOS — from bottom */}
        <div style={delay(2)} className={`bg-grad-app flex flex-col justify-between gap-3 rounded-[20px] p-6 text-white ${reveal("bottom", visible)}`}>
          <div className="flex items-center gap-3">
            <AppleIcon />
            <p className="text-lg leading-snug">
              Baixe a <strong className="font-bold">Versão IOS</strong>
            </p>
          </div>
          <a
            href="https://apps.apple.com/br/app/forneria-original-oficial/id1357435783"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit rounded bg-white/15 px-3 py-1 text-sm font-medium transition hover:bg-white/25"
          >
            Baixe Agora
          </a>
        </div>

        {/* Benefits — from right */}
        <div style={delay(3)} className={`bg-grad-app flex items-center rounded-[20px] p-6 text-white ${reveal("right", visible)}`}>
          <p className="font-bold leading-snug">
            No nosso app você tem: Frete Grátis, Cupons, Programa de Fidelidade e
            Muito mais!
          </p>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-12 w-12 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 18H7V5h10v14zm-5 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-9 w-9 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-9 w-9 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.09l-.02-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}
