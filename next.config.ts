import type { NextConfig } from "next";

const config: NextConfig = {
  // Adicione esta secção eslint
  eslint: {
    // Atenção: Isto permite que builds de produção sejam concluídos
    // mesmo que o seu projeto tenha erros de ESLint.
    ignoreDuringBuilds: true,
  },
  
  // A sua configuração de imagens existente permanece aqui
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard-production-dc4f.up.railway.app",
        port: "",
        pathname: "/static/images/**",
      },
    ],
  },
};

export default config;
