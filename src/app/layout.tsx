// src/app/layout.tsx
"use client"; // Transformando em um Client Component para usar o useState

import { useState } from "react"; // Importando o useState
import "./globals.css";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Estado para controlar se a sidebar está recolhida ou não
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {/* O grid agora se ajusta dinamicamente com base no estado 'isCollapsed' */}
        <div
          className={`grid min-h-screen w-full transition-all duration-300 ease-in-out 
          ${isCollapsed 
            ? 'md:grid-cols-[80px_1fr]' // Largura quando recolhido
            : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]' // Largura quando expandido
          }`}
        >
          {/* Passamos o estado e a função para alterar o estado para a Sidebar */}
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
          <div className="flex flex-col">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
