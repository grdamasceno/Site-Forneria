import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Body font (matches the original site's Roboto).
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

// Heading font — the brand's own GothamPro (Medium → 400, Bold → 700).
const gotham = localFont({
  src: [
    { path: "../fonts/GothamPro-Medium.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GothamPro-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forneria Original — Pizzas, original como deve ser",
  description:
    "A Forneria Original oferece uma experiência única em pizzas desde 2016, com receitas inovadoras, sabores exclusivos e muito recheio. Mais de 54 unidades em todo o Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} ${gotham.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
