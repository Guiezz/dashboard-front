/** @type {import('next').NextConfig} */
const nextConfig = {
  // Adicione esta secção de 'images'
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/static/images/**", // Opcional, mas bom para segurança
      },
    ],
  },
};

export default nextConfig;
