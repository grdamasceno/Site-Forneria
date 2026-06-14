// Static data layer for Phase 1 (no database yet).
// Keeping all fixed content here makes it easy to swap for a CMS/API later.

// Full product catalog, auto-generated from the original cardápio images
// (see scripts/gen-cardapio.mjs). Re-exported so consumers import from here.
import { products } from "./products.data";
export { products };
import { posts } from "./posts.data";
export { posts };

export type NavItem = { label: string; href: string; external?: boolean };

export const FRANQUIA_URL = "https://franquia.forneriaoriginal.com/seja-um-franqueado/";

export const navItems: NavItem[] = [
  { label: "A Forneria Original", href: "/a-forneria-original" },
  { label: "Cardápio", href: "/cardapio" },
  { label: "Unidades", href: "/unidades" },
  { label: "Seja um franqueado", href: FRANQUIA_URL, external: true },
  { label: "Nossas Marcas", href: "/nossas-marcas" },
  { label: "Novidades", href: "/novidades" },
  { label: "Sac", href: "/sac" },
];

export type City = { name: string; phone: string };

export const cities: City[] = [
  { name: "Belo Horizonte", phone: "(31) 2342-2424" },
  { name: "Brasília", phone: "0800 333 5555" },
  { name: "Cabo Frio", phone: "(22) 3199-4499" },
  { name: "Curitiba", phone: "0800 333 5555" },
  { name: "Espírito Santo", phone: "(27) 2464-2020" },
  { name: "Goiânia", phone: "(62) 3142-9222" },
  { name: "Juiz de Fora", phone: "(32) 3142-0888" },
  { name: "Recife", phone: "0800 333 5555" },
  { name: "Região Serrana RJ", phone: "0800 333 5555" },
  { name: "Rio de Janeiro", phone: "(21) 4063-5555" },
  { name: "São Paulo", phone: "0800 333 5555" },
  { name: "Volta Redonda", phone: "(24) 3512-7443" },
];

export const defaultCity = cities.find((c) => c.name === "Rio de Janeiro")!;

// ---- Footer ----

export const footerDepartments: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "A Forneria Original", href: "/a-forneria-original" },
  { label: "Cardápio", href: "/cardapio" },
  { label: "Unidades", href: "/unidades" },
  { label: "SAC", href: "/sac" },
  { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  { label: "Seja um Franqueado", href: FRANQUIA_URL, external: true },
  { label: "Nossas Marcas", href: "/nossas-marcas" },
  { label: "Novidades", href: "/novidades" },
  { label: "Fornelover", href: "/fornelover" },
  { label: "Dúvidas Frequentes", href: "/duvidas-frequentes" },
  { label: "Programa de Fidelidade", href: "/programa-fidelidade" },
];

export const footerPolicies: NavItem[] = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Política de Cookie", href: "/politica-de-cookie" },
  { label: "Política de LGPD", href: "/politica-de-lgpd" },
];

export type SocialLink = { label: string; href: string; icon: SocialIcon };
export type SocialIcon = "facebook" | "instagram" | "tiktok" | "youtube" | "x";

export const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "https://www.facebook.com/forneriaoriginaloficial", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/forneriaoriginaloficial/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@forneriaoriginaloficial", icon: "tiktok" },
  { label: "YouTube", href: "https://www.youtube.com/@forneriaoriginal", icon: "youtube" },
  { label: "X", href: "https://x.com/forneriaoficial", icon: "x" },
];

// ---- Cardápio ----

export type ProductCategory =
  | "vegana"
  | "pizza-doce"
  | "pizza-salgada"
  | "fornerito";

export type Nutrition = {
  porcao?: string;
  carboidratos?: string;
  proteinas?: string;
  gordurasTotais?: string;
  gordurasSaturadas?: string;
  fibras?: string;
  caloriasKcal?: string;
  gordurasTrans?: string;
  sodio?: string;
  caloriasKj?: string;
};

export type Product = {
  name: string;
  category: ProductCategory;
  image: string;
  /** Unique slug (names can repeat across categories). */
  slug?: string;
  /** Comma-separated ingredients (from the product CSV). */
  ingredients?: string;
  /** Nutritional table values (from the product CSV). */
  nutrition?: Nutrition;
};

/** Unique URL slug for a product (falls back to the slugified name). */
export function productSlug(p: Product): string {
  return p.slug ?? slugify(p.name);
}

/** Slugify a string for use in URLs (removes accents, spaces, symbols). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Filter tabs with live counts derived from the catalog.
const FILTER_DEFS: { key: ProductCategory | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "vegana", label: "Vegana" },
  { key: "pizza-doce", label: "Pizza Doce" },
  { key: "pizza-salgada", label: "Pizza Salgada" },
  { key: "fornerito", label: "Fornerito" },
];

export const categoryFilters = FILTER_DEFS.map((f) => ({
  ...f,
  count:
    f.key === "todos"
      ? products.length
      : products.filter((p) => p.category === f.key).length,
}));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => productSlug(p) === slug);
}

// Round artwork for the home "Sugestão da Semana" / "Mais Pedidos" sections.
// Names match catalog entries so the cards link to their product pages.
export const weeklySuggestions: Product[] = [
  { name: "A Moda", category: "pizza-salgada", slug: "a-moda", image: "/img/home/carrosel-pizzas-destaque/a-moda.png" },
  { name: "Calabresa", category: "pizza-salgada", slug: "calabresa", image: "/img/home/carrosel-pizzas-destaque/calabresa.png" },
  { name: "Catuperoni", category: "pizza-salgada", slug: "catuperoni", image: "/img/home/carrosel-pizzas-destaque/catuperoni.png" },
];

export const mostOrdered: Product[] = weeklySuggestions;

// ---- Unidades ----

export type Unit = {
  name: string;
  state: string;
  city: string;
  address: string;
  hours: string;
  /** Phone linked to the unit's region. */
  phone: string;
  region: string;
  image: string;
};

export const unitStates = [
  "Rio de Janeiro",
  "Espírito Santo",
  "Goiás",
  "Brasília",
  "Minas Gerais",
  "São Paulo",
  "Pernambuco",
  "Paraná",
];

// Full units list, auto-generated from the exported CSV (see
// scripts/gen-unidades-csv.mjs).
export { units } from "./units.data";

// ---- Nossas Marcas ----

export type Brand = {
  name: string;
  description: string;
  image: string;
};

export const brands: Brand[] = [
  {
    name: "Condado",
    description:
      "Bem-vindo ao Condado Burger 'n' Sandwich, onde nossa paixão por hambúrgueres e sanduíches artesanais é a nossa prioridade. Condado é para quem tem fome de viver, experimentar novos sabores e comer sanduíches como se fosse a primeira vez. Aqui, cada mordida é uma jornada de sabor, preparada com ingredientes frescos e de alta qualidade. Nosso objetivo é proporcionar uma experiência autêntica, combinando tradição e inovação em cada prato. Se você está em busca de um clássico ou de uma opção gourmet, no Condado você encontra o melhor dos dois mundos. Aquele clássico que nunca sai de moda. O vintage moderno. O sabor inconfundível de ser Original. Sinta-se à vontade e prepare-se para descobrir o sabor que fará do Condado seu novo destino favorito.",
    image: "/img/nossas-marcas/condado.png",
  },
  {
    name: "Poke Moon",
    description:
      "Bem-vindo ao Poke Moon, onde a tradição havaiana se une à frescura dos ingredientes mais selecionados. Cada tigela é meticulosamente preparada, combinando sabores autênticos e nutritivos para proporcionar uma refeição leve, saborosa e energizante. O poke refrescante, leve com muito sabor. A clássica receita havaiana, com inspirações contemporâneas, transformando tudo em um novo sabor totalmente Original. Nosso objetivo é oferecer o melhor do poke, com opções personalizáveis que atendem a diversos gostos e estilos de vida. Se você busca uma deliciosa refeição rápida ou um momento para saborear com calma, o Poke Moon é o lugar onde sabor e saúde se encontram em perfeita harmonia.",
    image: "/img/nossas-marcas/pokemoon.png",
  },
  {
    name: "Rio Roots Açaí",
    description:
      "Bem-vindo ao Rio Roots Açaí, onde a alma do Rio de Janeiro se reflete em cada tigela. No Rio Roots, celebramos o autêntico sabor do açaí, trazendo uma receita que destaca a pureza e a qualidade dos ingredientes, com aquele toque vibrante dos anos 80 e a energia da praia carioca. Nossa missão é oferecer uma experiência genuína, trazendo a vitalidade e o frescor do açaí amazônico diretamente para você. Seja para um lanche rápido ou uma refeição nutritiva, o Rio Roots Açaí é o local ideal para quem busca sabor, saúde e um pedacinho da essência brasileira. Venha saborear o melhor do açaí e sinta a vibração do Rio em cada colherada.",
    image: "/img/nossas-marcas/rio-roots.png",
  },
  {
    name: "Woodstock",
    description:
      "Bem-vindo ao Woodstock by Forneria Original, o seu novo destino para os melhores doces americanos entregues diretamente na sua porta. A sua nova sobremesa favorita. Inspirados pela autenticidade e pelo espírito vibrante de Woodstock, oferecemos uma seleção irresistível de sobremesas clássicas dos Estados Unidos. De cookies e brownies, ou uma surpreendente e deliciosa combinação dos dois, a cheesecakes e outras delícias, nosso delivery garante a você o sabor genuíno dos doces americanos, preparados com carinho e qualidade. No Woodstock by Forneria Original, cada pedido é uma experiência doce e inesquecível.",
    image: "/img/nossas-marcas/wood-stock.png",
  },
  {
    name: "Forneria Original Massas",
    description:
      "Bem-vindo à Forneria Original Massas, onde a tradição das massas artesanais é exaltada em cada prato. Aqui, respeitamos as receitas clássicas e as reinventamos com um toque especial, utilizando ingredientes frescos e selecionados para criar massas que encantam o paladar. Cada prato é uma viagem a um pedacinho da Itália, sem você precisar sair de casa. Nossa paixão é proporcionar uma experiência autêntica, com sabores que capturam a essência da verdadeira cozinha italiana. Nossas receitas são um tributo à arte de preparar massas com alma e um sabor inigualável.",
    image: "/img/nossas-marcas/forneria-massas-V2.png",
  },
  {
    name: "Forneria Original Vegana",
    description:
      "Bem-vindo à Forneria Original Vegana, onde o sabor encontra a sustentabilidade. Aqui, oferecemos uma deliciosa variedade de pratos veganos, preparados com ingredientes frescos e de alta qualidade. Nosso compromisso é proporcionar uma experiência gastronômica que respeita tanto o paladar quanto o meio ambiente. Desde pizzas e massas até opções inovadoras, cada prato é feito com cuidado e criatividade para oferecer o melhor da culinária vegana.",
    image: "/img/nossas-marcas/forneria-vegana.png",
  },
];

// ---- Novidades (Blog) ----

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Full article text (may contain line breaks). */
  text?: string;
  date: string;
  image: string;
};

// Blog posts come from posts.data (re-exported at the top of this file).
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// ---- Home: round brand logos (carousel) ----

export type HomeBrand = {
  name: string;
  /** Round brand logo image. */
  image: string;
  href: string;
};

export const homeBrands: HomeBrand[] = [
  { name: "Forneria Original Vegana", image: "/img/home/carrosel-marcas/forneria-vegana.png", href: "/cardapio" },
  { name: "Condado", image: "/img/home/carrosel-marcas/condado.png", href: "/nossas-marcas" },
  { name: "Pokemoon", image: "/img/home/carrosel-marcas/pokemoon.png", href: "/nossas-marcas" },
  { name: "Rio Roots", image: "/img/home/carrosel-marcas/rio-roots.png", href: "/nossas-marcas" },
  { name: "Wood Stock", image: "/img/home/carrosel-marcas/wood-stock.png", href: "/nossas-marcas" },
  { name: "Forneria Massas", image: "/img/home/carrosel-marcas/forneria-massas-V2.png", href: "/nossas-marcas" },
];

// ---- Home: "Satisfação de quem comprou" testimonials ----

export type Testimonial = {
  name: string;
  text: string;
};

export const testimonials: Testimonial[] = [
  { name: "Flávio", text: "A pizza é fenomenal. melhor ainda é o carinho pelo chat quando precisa de alguma atenção. sou fã de carteirinha." },
  { name: "Gabriel", text: "P* P, a pizza mais gostosa que já comi, sem exagero nenhum, fora que não deu tempo nem de aperta aquele e já chegou.. amei" },
  { name: "Filipe", text: "A verdadeira experiência 5 estrelas, que vai além da pizza que é deliciosa. A entrega é a mais rápida que ja vi. Já pedi algumas vezes e agora a brincadeira em casa é cronometrar, porque é realmente impressionante. Chega sempre em menos de 15 minutos e bem quentinha. Recomendo. Virei cliente fiel." },
  { name: "Fabiana", text: "Merece não apenas cinco estrelas, e sim muito mais! Pizza super bem preparada, muito recheio, massa leve, entrega rápida... perfeita demais! Até o entregador é bom kkk super cuidadoso e gente boa!" },
  { name: "Filipe", text: "Simplesmente magnífico, pizzaria com mentalidade de satisfação ao cliente, pizza maravilhosa, feita e entregue em 30 minutos, quente e extremante saborosa" },
  { name: "Luana", text: "Chega muuuito rápido!! Hoje chegou em 10min kkkk foi só O tempo de botar a mesa. Deliciosa, como sempre! Recomendo." },
  { name: "Alicia", text: "Gente, que pizza incrível!! Veio tão quentinha e saborosa estou apaixonada e pedirei mais vezes!" },
];

// ---- Home banners ----

export type Banner = {
  /** Accessible description of the banner. */
  alt: string;
  /** Desktop image (full-width landscape). */
  image: string;
  imageWidth: number;
  imageHeight: number;
  /** Optional mobile (portrait) image. */
  imageMobile?: string;
  imageMobileWidth?: number;
  imageMobileHeight?: number;
  /** Optional link the banner points to. */
  href?: string;
};

export const banners: Banner[] = [
  {
    alt: "Forneria Original — Prêmio iFood de super restaurantes, culinária pizza nacional",
    image: "/img/home/banner-principal/banner-site-premio-D.jpg",
    imageWidth: 1920,
    imageHeight: 660,
    imageMobile: "/img/home/banner-principal/banner-site-premio-M.jpg",
    imageMobileWidth: 700,
    imageMobileHeight: 1300,
  },
];
