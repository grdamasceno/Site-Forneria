"use client";

import { useEffect, useRef, useState } from "react";
import { cities, defaultCity, type City } from "@/lib/data";

type CityDropdownProps = {
  onCityChange?: (city: City) => void;
};

/**
 * "Selecione sua cidade" dropdown shown in the header. In Phase 1 it only
 * tracks local state; later it can drive the displayed phone number globally.
 */
export default function CityDropdown({ onCityChange }: CityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<City>(defaultCity);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(city: City) {
    setSelected(city);
    setOpen(false);
    onCityChange?.(city);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-semibold text-forneria-black/80 sm:inline">
          Selecione sua cidade:
        </span>
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex w-44 items-center justify-between rounded-full border border-forneria-red px-4 py-1.5 text-sm font-medium text-forneria-black transition hover:bg-forneria-red/5"
          >
            <span className="truncate">{selected.name}</span>
            <svg
              className={`h-4 w-4 shrink-0 text-forneria-red transition-transform ${open ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute right-0 z-50 mt-2 max-h-72 w-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
            >
              {cities.map((city) => (
                <li key={city.name} role="option" aria-selected={city.name === selected.name}>
                  <button
                    type="button"
                    onClick={() => select(city)}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-forneria-gray ${
                      city.name === selected.name
                        ? "font-semibold text-forneria-red"
                        : "text-forneria-black"
                    }`}
                  >
                    {city.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <a
        href={`tel:${selected.phone.replace(/\D/g, "")}`}
        className="text-xl font-extrabold text-forneria-red md:text-2xl"
      >
        {selected.phone}
      </a>
    </div>
  );
}
