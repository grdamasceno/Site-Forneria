import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-WW9DS9T7";

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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="font-sans antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
