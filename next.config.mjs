/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uploads (banners, fachadas, fotos de produto) vão por Server Actions.
  // O padrão é 1 MB — imagens de banner passam disso e estouravam.
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
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
      { source: "/pedido", destination: "https://pedidos.forneriaoriginal.com", permanent: true },
      { source: "/pedidos", destination: "https://pedidos.forneriaoriginal.com", permanent: true },
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
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://www.google.com https://www.googletagmanager.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
