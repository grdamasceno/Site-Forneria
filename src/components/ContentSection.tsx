import Image from "next/image";

type ContentSectionProps = {
  title: string;
  text: string;
  image: string;
  /** When true, the image is placed on the left and text on the right. */
  imageLeft?: boolean;
  /** Alternating light/white background like the original sections. */
  shaded?: boolean;
};

/**
 * Generic two-column section: image on one side, text on the other.
 * Reused by the Home page content blocks and the Nossas Marcas page.
 */
export default function ContentSection({
  title,
  text,
  image,
  imageLeft = false,
  shaded = false,
}: ContentSectionProps) {
  return (
    <section className={shaded ? "bg-forneria-gray" : "bg-white"}>
      <div className="container-fc grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-2 md:gap-12">
        <div className={imageLeft ? "md:order-1" : "md:order-2"}>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-black/5">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className={imageLeft ? "md:order-2" : "md:order-1"}>
          <h2 className="text-3xl font-extrabold text-forneria-red md:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-forneria-black/80">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
