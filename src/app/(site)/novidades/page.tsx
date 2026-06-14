import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { getPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Novidades — Forneria Original",
};

export const dynamic = "force-dynamic";

export default async function NovidadesPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <HeroBanner title="Novidades" />

      <div className="container-fc py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-forneria-black/60">
          <Link href="/" className="text-forneria-red hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="text-forneria-red">Novidades</span>
        </nav>

        {!featured ? (
          <p className="py-16 text-center text-forneria-black/50">
            Nenhuma novidade publicada no momento.
          </p>
        ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main post + list */}
          <div className="space-y-12">
            <article>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forneria-gray">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-sm text-forneria-black/50">{featured.date}</p>
              <h2 className="mt-2 text-2xl font-extrabold text-forneria-black md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-forneria-black/80">
                {featured.excerpt}
              </p>
              <Link
                href={`/novidades/${featured.slug}`}
                className="mt-4 inline-block font-semibold text-forneria-red hover:underline"
              >
                Continuar lendo →
              </Link>
            </article>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {rest.map((post) => (
                <article key={post.slug} className="flex flex-col">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forneria-gray">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-3 text-xs text-forneria-black/50">{post.date}</p>
                  <h3 className="mt-1 text-lg font-bold text-forneria-black">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-forneria-black/70">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <h3 className="bg-forneria-red px-5 py-4 text-lg font-bold text-white">
                Posts Recentes
              </h3>
              <ul className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/novidades/${post.slug}`}
                      className="block px-5 py-4 text-sm font-medium text-forneria-black/80 underline-offset-2 transition hover:text-forneria-red hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        )}
      </div>
    </>
  );
}
