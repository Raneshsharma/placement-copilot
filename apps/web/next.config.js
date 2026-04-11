/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost", "images.unsplash.com", "picsum.photos"],
  },
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://firebase.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com; connect-src 'self' http://localhost:3001 http://localhost:3000 https://www.google-analytics.com https://firebase.googleapis.com https://*.firebaseio.com wss://localhost:*; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://picsum.photos https://*.googleusercontent.com; font-src 'self' data:; frame-ancestors 'none';",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;