import Image from "next/image";
import type { Unit } from "@/lib/data";

/** Card for a single store location on the Unidades page. */
export default function UnitCard({ unit }: { unit: Unit }) {
  const hours = unit.hours
    ? unit.hours.split(/[|\n]/).map((h) => h.trim()).filter(Boolean)
    : [];

  const destination = [unit.address, unit.city, unit.state]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-forneria-red/40 bg-white transition hover:shadow-lg">
      <div className="relative aspect-[3/2] w-full bg-forneria-gray">
        <Image
          src={unit.image}
          alt={unit.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-forneria-black">
          {unit.name}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver ${unit.name} no Google Maps`}
            title="Ver no Google Maps"
            className="text-forneria-red transition hover:text-forneria-red-dark"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M15 5.1 9 3 3 5v16l6-2.1 6 2.1 6-2V3l-6 2.1zm0 0v13.8M9 3v13.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </a>
        </h3>

        <p className="flex items-start gap-1.5 text-sm text-forneria-black/70">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-forneria-red" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span>
            {unit.address}
            {unit.city ? ` — ${unit.city}` : ""}
          </span>
        </p>

        {unit.phone && (
          <a
            href={`tel:${unit.phone.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forneria-red"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z" />
            </svg>
            {unit.phone}
          </a>
        )}

        {hours.length > 0 && (
          <div className="mt-auto flex items-start gap-1.5 pt-1 text-xs text-forneria-black/60">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-forneria-red" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.5V7h-2v6.5l5 3 1-1.7-4-2.3z" />
            </svg>
            <span className="flex flex-col gap-0.5">
              {hours.map((h, i) => (
                <span key={i}>{h}</span>
              ))}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
