import Image from "next/image";
import Link from "next/link";
import { getPosts } from "@/lib/queries";

/**
 * Home "Novidades" section: dark photographic background with a white scalloped
 * (bg-curve) top edge that overlaps the previous section, a title and the most
 * recent blog posts as cards.
 */
export default async function HomeNews() {
  const posts = (await getPosts()).slice(0, 4);
  return (
    <section className="relative bg-forneria-black">
      {/* Dark background image */}
      <Image
        src="/img/home/blog/bg-blog-V2.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* White scalloped top edge (bg-curve, rotated) overlapping this section */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-[60px] w-full md:h-[90px]"
        style={{
          backgroundImage: "url(/img/home/bg-curve.svg)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "1900px",
          transform: "rotate(180deg)",
        }}
      />

      <div className="container-fc relative z-20 pb-20 pt-28 md:pt-36">
        {/* Title */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
          <h2 className="whitespace-nowrap text-3xl font-extrabold uppercase tracking-wide text-white md:text-4xl">
            Novidades
          </h2>
          <span className="hidden h-px flex-1 bg-forneria-red sm:block" />
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col text-white">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-white bg-black/20">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <p className="mt-3 text-sm font-semibold">Forneria Original</p>
              <p className="mb-2 flex items-center gap-1.5 text-xs text-gray-300">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm12 7v10H5V9h14z" />
                </svg>
                {post.date}
              </p>

              <h3 className="text-sm font-bold leading-snug">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-200">
                {post.excerpt}
              </p>

              <Link
                href={`/novidades/${post.slug}`}
                className="mt-4 w-fit rounded bg-forneria-red px-5 py-2 text-sm font-semibold text-white transition hover:bg-forneria-red-dark"
              >
                Saiba mais
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
