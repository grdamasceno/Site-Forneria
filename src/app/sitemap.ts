import type { MetadataRoute } from "next";
import { SITE_URL, productSlug, unitSlug } from "@/lib/data";
import { getProducts, getPosts, getUnits } from "@/lib/queries";

// Static routes that aren't driven by dynamic data.
const STATIC_ROUTES = [
  "",
  "/a-forneria-original",
  "/cardapio",
  "/unidades",
  "/marcas",
  "/novidades",
  "/fornelover",
  "/duvidas-frequentes",
  "/programa-fidelidade",
  "/contact",
  "/trabalhe-conosco",
  "/politica-de-privacidade",
  "/politica-de-cookie",
  "/politica-lgpd",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, units] = await Promise.all([getProducts(), getPosts(), getUnits()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/cardapio/${productSlug(p)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/novidades/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const unitEntries: MetadataRoute.Sitemap = units.map((u) => ({
    url: `${SITE_URL}/unidades/${unitSlug(u)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...postEntries, ...unitEntries];
}
