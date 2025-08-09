// src/app/layout.tsx
"use client"; // Necessário para usar useState e ThemeProvider

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full">
            {/* Sidebar com controle de colapso */}
            <Sidebar isCollapsed={isCollapsed} />

            <div className="flex flex-col flex-1 w-full">
              {/* Header controlando a Sidebar */}
              <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
              <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
