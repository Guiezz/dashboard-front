// src/components/layout/Header.tsx
"use client"; 
import Link from "next/link";
import { Menu, Droplets, Home, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
// 1. Importamos os componentes de Header, Title e Description do Sheet
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {/* 2. Adicionamos um cabeçalho para acessibilidade */}
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Droplets className="h-6 w-6" />
              <span>Monitoramento</span>
            </SheetTitle>
            <SheetDescription>
              Navegação principal do sistema.
            </SheetDescription>
          </SheetHeader>

          {/* O seu menu de navegação continua aqui */}
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
              Identificação
            </Link>
            <Link href="/estado-de-seca" className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
              <Scale className="h-5 w-5" />
              Estado de Seca
            </Link>
            {/* Outros links do menu mobile */}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1"></div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
