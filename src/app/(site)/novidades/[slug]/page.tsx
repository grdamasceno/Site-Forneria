import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroBanner from "@/components/HeroBanner";
import { getPostBySlug, getPosts } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? `${post.title} — Forneria Original` : "Novidade" };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = (post.text ?? post.excerpt)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const posts = await getPosts();
  const recent = posts.filter((p) => p.slug !== post.slug).slice(0, 5);

  return (
    <>
      <HeroBanner title="Novidades" />

      <div className="container-fc py-10">
        <nav className="mb-8 text-sm text-forneria-black/60">
          <Link href="/" className="text-forneria-red hover:underline">Home</Link>
          <span> / </span>
          <Link href="/novidades" className="text-forneria-red hover:underline">Novidades</Link>
          <span> / </span>
          <span>{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
          <article>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forneria-gray">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-forneria-black/50">{post.date}</p>
            <h1 className="mt-2 text-2xl font-extrabold text-forneria-black md:text-3xl">
              {post.title}
            </h1>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-forneria-black/80">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>

          <aside>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <h2 className="bg-forneria-red px-5 py-4 text-lg font-bold text-white">
                Posts Recentes
              </h2>
              <ul className="divide-y divide-gray-100">
                {recent.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/novidades/${p.slug}`}
                      className="block px-5 py-4 text-sm font-medium text-forneria-black/80 underline-offset-2 transition hover:text-forneria-red hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
