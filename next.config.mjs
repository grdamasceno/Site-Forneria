/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // ---- External redirects carried over from the old (Bubble) site ----
      { source: "/pedido", destination: "https://deliverydireto.com.br/forneria-original", permanent: true },
      { source: "/pedidos", destination: "https://deliverydireto.com.br/forneria-original", permanent: true },
      { source: "/sejaumfranqueado", destination: "https://franquia.forneriaoriginal.com/seja-um-franqueado/", permanent: true },

      // ---- Internal renames (keep old paths working) ----
      { source: "/nossas-marcas", destination: "/marcas", permanent: true },
      { source: "/sac", destination: "/contact", permanent: true },
      { source: "/politica-de-lgpd", destination: "/politica-lgpd", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.google.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
