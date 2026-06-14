import Image from "next/image";

/**
 * Route-transition loader for the public site. Next.js shows this automatically
 * while the next page (server-rendered, force-dynamic) is loading. A red octagon
 * spins around the centered Forneria Original logo on a full-screen white sheet.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <div className="relative flex h-44 w-44 items-center justify-center">
        {/* Spinning octagon ring */}
        <svg
          className="absolute inset-0 h-full w-full animate-[spin_2.2s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          <polygon
            points="30.95,4 69.05,4 96,30.95 96,69.05 69.05,96 30.95,96 4,69.05 4,30.95"
            stroke="#df1b2d"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>

        {/* Static centered logo */}
        <Image
          src="/img/logo.png"
          alt="Forneria Original"
          width={110}
          height={64}
          priority
          className="relative h-auto w-[58%]"
        />
      </div>
    </div>
  );
}
