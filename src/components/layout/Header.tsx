// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { 
  Menu, 
  Droplets, 
  Home, 
  Scale, 
  PanelLeftClose, 
  PanelRightClose 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

// Props para controle da Sidebar
interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Header({ isCollapsed, setIsCollapsed }: HeaderProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* Botão menu mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Droplets className="h-6 w-6" />
              <span>Monitoramento</span>
            </SheetTitle>
            <SheetDescription>
              Navegação principal do sistema.
            </SheetDescription>
          </SheetHeader>

          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Identificação
            </Link>
            <Link
              href="/estado-de-seca"
              className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Scale className="h-5 w-5" />
              Estado de Seca
            </Link>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Botão recolher/expandir (desktop) */}
      <Button
        variant="outline"
        size="icon"
        className="hidden h-8 w-8 md:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <PanelRightClose className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
        <span className="sr-only">Recolher/Expandir menu</span>
      </Button>

      {/* Espaço central para crescer */}
      <div className="w-full flex-1" />

      {/* Ações do lado direito */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
