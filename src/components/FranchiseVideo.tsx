import { FRANQUIA_URL } from "@/lib/data";

const YT_ID = "tbyneHduetc";

/**
 * Full-width "Seja um Franqueado" section with an embedded YouTube institutional
 * video as the background (autoplay/muted/looped), a dark overlay, a large
 * title and a "Saiba Mais" button linking to the external franchise site.
 */
export default function FranchiseVideo() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[560px]">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          title="Vídeo institucional Forneria Original"
          src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&playlist=${YT_ID}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h2 className="text-4xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg md:text-6xl">
          Seja um Franqueado
        </h2>
        <a
          href={FRANQUIA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 rounded-full border-2 border-white px-10 py-3 font-semibold text-white transition hover:bg-white hover:text-forneria-black"
        >
          Saiba Mais
        </a>
      </div>
    </section>
  );
}
