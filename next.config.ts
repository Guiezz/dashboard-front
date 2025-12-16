import type { NextConfig } from "next";

const config: NextConfig = {
  // Adicione esta secção eslint
  eslint: {
    // Atenção: Isto permite que builds de produção sejam concluídos
    // mesmo que o seu projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard-production-dc4f.up.railway.app",
        port: "",
        pathname: "/static/images/**",
      },
      // ADICIONE ESTE BLOCO ABAIXO:
      {
        protocol: "https",
        hostname: "drought-plan-dashboard-api.onrender.com",
        port: "",
        pathname: "/static/images/**", // Ajustei para bater com o caminho do erro
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/images/**", // Ajustei para bater com o caminho do erro
      },
    ],
  },
};

export default config;
