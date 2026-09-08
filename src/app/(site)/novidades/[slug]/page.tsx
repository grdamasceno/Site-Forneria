import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroBanner from "@/components/HeroBanner";
import { absoluteImageUrl, SITE_URL } from "@/lib/data";
import { getPostBySlug, getPosts } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const PT_MONTHS: Record<string, string> = {
  janeiro: "01", fevereiro: "02", março: "03", abril: "04", maio: "05", junho: "06",
  julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
};

/** Parses "28 de março de 2026" into "2026-03-28" (ISO 8601). Returns undefined if it doesn't match. */
function toIsoDate(ptDate: string): string | undefined {
  const m = ptDate.match(/^(\d{1,2}) de (\p{L}+) de (\d{4})$/u);
  if (!m) return undefined;
  const month = PT_MONTHS[m[2].toLowerCase()];
  if (!month) return undefined;
  return `${m[3]}-${month}-${m[1].padStart(2, "0")}`;
}

function excerptFrom(text: string): string {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 155 ? `${plain.slice(0, 155)}…` : plain;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Novidade" };

  return {
    title: `${post.title} — Forneria Original`,
    description: excerptFrom(post.excerpt || post.text || post.title),
    alternates: { canonical: `/novidades/${slug}` },
    openGraph: { type: "article", images: [{ url: post.image }] },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const content = post.text ?? post.excerpt;
  const isHtml = /<(p|br|strong|b|em|i|a|ul|ol|li|h[1-6])[\s>/]/i.test(content);
  const paragraphs = content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const posts = await getPosts();
  const recent = posts.filter((p) => p.slug !== post.slug).slice(0, 5);

  const isoDate = toIsoDate(post.date);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.image ? [absoluteImageUrl(post.image)] : undefined,
    ...(isoDate && { datePublished: isoDate }),
    description: excerptFrom(post.excerpt || post.text || post.title),
    author: { "@type": "Organization", name: "Forneria Original" },
    publisher: {
      "@type": "Organization",
      name: "Forneria Original",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` },
    },
    mainEntityOfPage: `${SITE_URL}/novidades/${slug}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Novidades", item: `${SITE_URL}/novidades` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/novidades/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
            {isHtml ? (
              <div
                className="richtext mt-5 text-base leading-relaxed text-forneria-black/80"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="mt-5 space-y-4 text-base leading-relaxed text-forneria-black/80">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
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
