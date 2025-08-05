// src/components/layout/Sidebar.tsx
"use client"; // Necessário para usar o hook usePathname

import Link from "next/link";
import { usePathname } from "next/navigation"; // Importamos o hook
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Home,
  Scale,
  Activity,
  FileText,
  AlertTriangle,
  ListChecks, // Ícone mais apropriado para Planos de Ação
  Users,
  Droplets,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  // Usamos o hook para obter a rota atual (ex: "/", "/estado-de-seca")
  const pathname = usePathname();

  return (
    // Adicionamos z-20 para garantir que a sidebar e os tooltips fiquem por cima do mapa
    <div className="hidden border-r bg-muted/40 md:block z-20">
      <div className="flex h-full max-h-screen flex-col gap-2 relative">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Droplets className="h-6 w-6" />
            {!isCollapsed && <span>Monitoramento</span>}
          </Link>
        </div>

        <TooltipProvider>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            
            {/* A lógica de classes agora é dinâmica e correta para cada link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/"
                      ? "bg-muted text-primary" // Estilo se ativo
                      : "text-muted-foreground" // Estilo se inativo
                  }`}
                >
                  <Home className="h-4 w-4" />
                  {!isCollapsed && <span>Identificação</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Identificação</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/balanco-hidrico"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/balanco-hidrico"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Scale className="h-4 w-4" />
                  {!isCollapsed && <span>Balanço Hídrico</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Balanço Hídrico</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/estado-de-seca"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/estado-de-seca"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  {!isCollapsed && <span>Estado de seca</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Estado de seca</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/planos-de-acao"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/planos-de-acao" // Correção aqui
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <ListChecks className="h-4 w-4" />
                  {!isCollapsed && <span>Planos de Ação</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Planos de Ação</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/impactos"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/impactos" // Correção aqui
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  {!isCollapsed && <span>Impactos</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Impactos</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/usos"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/usos" // Correção aqui
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  {!isCollapsed && <span>Usos</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Usos</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>

        <div className="absolute bottom-4 right-[-20px]">
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            size="icon"
            variant="outline"
            className="rounded-full"
          >
            {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
          </Button>
        </div>
      </div>
    </div>
  );
}
