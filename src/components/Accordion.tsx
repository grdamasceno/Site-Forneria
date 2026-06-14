"use client";

import { useState } from "react";

export type AccordionItem = {
  question: string;
  /** Answer paragraphs (rendered one per line). */
  answer: string[];
};

/** Expandable FAQ accordion: click a header to toggle its content. */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-lg border border-forneria-red/40">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-gray-200 last:border-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition ${
                isOpen
                  ? "bg-grad-dark font-bold text-white"
                  : "font-medium text-forneria-black hover:bg-forneria-gray"
              }`}
            >
              <span>{item.question}</span>
              <svg
                className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isOpen && (
              <div className="space-y-3 px-5 py-5 text-sm leading-relaxed text-forneria-black/80">
                {item.answer.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
