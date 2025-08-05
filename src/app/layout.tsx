// src/app/layout.tsx
"use client"; // Esta diretiva é necessária para o useState e para o ThemeProvider

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css"; // Seus estilos globais

// 1. Importe o nosso Provedor de Tema
import { ThemeProvider } from "@/components/theme-provider";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // O estado para a sua sidebar continua aqui, sem problemas
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // 2. Adicione `suppressHydrationWarning` para evitar avisos do next-themes
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 3. Envolva TUDO com o ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // A linha mais importante: define o tema escuro como padrão
          enableSystem={false} // Ignora o tema do sistema do utilizador
          disableTransitionOnChange
        >
          {/* 4. O seu layout (o "AppShell") fica aqui dentro */}
          <div
            className={`grid min-h-screen w-full transition-all duration-300 ease-in-out 
            ${isCollapsed 
              ? 'md:grid-cols-[80px_1fr]' // Largura quando recolhido
              : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]' // Largura quando expandido
            }`}
          >
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            <div className="flex flex-col">
              <Header />
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
