// src/components/layout/Header.tsx
"use client"; 
import Link from "next/link";
import { Menu, Droplets, Home, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle"; // 1. Importamos o nosso novo componente

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Menu Mobile (Sheet) - Sem alterações aqui */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Droplets className="h-6 w-6" />
              <span>Monitoramento</span>
            </Link>
            <Link href="/" className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="#" className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
              <Scale className="h-5 w-5" />
              Balanço Hídrico
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* 2. Div que empurra o botão de tema para a direita */}
      <div className="w-full flex-1"></div>

      {/* 3. Adicionamos o botão de tema aqui */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
