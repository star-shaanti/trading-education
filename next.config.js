/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
        ],
      },
    ];
  },
};

module.exports = nextConfig;

