import Image from "next/image";

type HeroBannerProps = {
  title: string;
  image?: string;
  subtitle?: React.ReactNode;
};

/**
 * Page hero with a dark-overlaid background image and a large centered title,
 * matching the inner-page banners of the original site.
 */
export default function HeroBanner({
  title,
  image = "/img/banner-interno.jpg",
  subtitle,
}: HeroBannerProps) {
  return (
    <section className="relative h-[260px] w-full overflow-hidden md:h-[340px]">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="hero-title">{title}</h1>
        {subtitle && (
          <div className="mt-3 max-w-2xl text-sm font-medium text-white drop-shadow md:text-base">
            {subtitle}
          </div>
        )}
      </div>
    </section>
  );
}
