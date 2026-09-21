/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Sortie autonome requise par le Dockerfile (image d'exécution légère sur Coolify)
  output: "standalone",
  experimental: {
    // Prisma et bcryptjs doivent rester des modules Node (pas de bundling)
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
    // Le moteur Prisma n'est pas tracé automatiquement par le build standalone
    outputFileTracingIncludes: {
      "/**": ["./node_modules/.prisma/client/**/*"],
    },
  },
  // Autoriser les scripts externes pour les widgets
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

