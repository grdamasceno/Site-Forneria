import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  name: string;
  image: string;
  slug: string;
};

/** Menu product card: photo on top, red uppercase name below. Links to the
 *  product detail page. */
export default function ProductCard({ name, image, slug }: ProductCardProps) {
  return (
    <Link
      href={`/cardapio/${slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-forneria-gray">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 items-center justify-center px-3 py-4">
        <h3 className="text-center text-sm font-bold uppercase text-forneria-pizza">
          {name}
        </h3>
      </div>
    </Link>
  );
}
