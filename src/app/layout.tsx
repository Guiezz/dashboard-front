// src/app/layout.tsx
"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ReservoirProvider } from "@/context/ReservoirContext";

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
        <ReservoirProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar isCollapsed={isCollapsed} />

            <div className="flex flex-1 flex-col">
              <Header
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
              <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-4">
                {children}
              </main>
            </div>
          </div>
        </ReservoirProvider>
      </body>
    </html>
  );
}
