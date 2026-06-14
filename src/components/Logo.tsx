import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  variant?: "color" | "white";
  className?: string;
};

/**
 * Brand logo. The "color" variant (header) uses the official red wordmark
 * image; the "white" variant (dark footer) falls back to a white text
 * wordmark since the image is red.
 */
export default function Logo({ variant = "color", className = "" }: LogoProps) {
  if (variant === "white") {
    return (
      <Link href="/" aria-label="Forneria Original - página inicial" className={className}>
        <span className="block font-heading font-extrabold uppercase leading-[0.85] tracking-tight text-white">
          <span className="block text-2xl md:text-[28px]">Forneria</span>
          <span className="block text-2xl md:text-[28px]">Original</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="Forneria Original - página inicial" className={className}>
      <Image
        src="/img/logo.png"
        alt="Forneria Original"
        width={551}
        height={323}
        priority
        className="h-auto w-[100px] md:w-[110px]"
      />
    </Link>
  );
}
