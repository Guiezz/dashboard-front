// src/components/layout/Sidebar.tsx
import Link from "next/link";
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
  ListChecks,
  Users,
  Droplets,
  PanelLeftClose, // Ícone para fechar
  PanelRightClose,
  User, // Ícone para abrir
} from "lucide-react";

// Definindo os tipos das propriedades que o componente receberá
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 relative">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Droplets className="h-6 w-6" />
            {!isCollapsed && <span>Monitoramento</span>}
          </Link>
        </div>
        
        {/* Envolvemos a navegação com o TooltipProvider */}
        <TooltipProvider>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/* Exemplo de Link com Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                  <Home className="h-4 w-4" />
                  {!isCollapsed && <span>Identificação</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Identificação</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="balanco-hidrico" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <Scale className="h-4 w-4" />
                  {!isCollapsed && <span>Balanço Hídrico</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Balanço Hídrico</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/estado-de-seca" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <Activity className="h-4 w-4" />
                  {!isCollapsed && <span>Estado de seca</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Estado de seca</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/planos-de-acao" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <FileText className="h-4 w-4" />
                  {!isCollapsed && <span>Planos de Ação</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Planos de Ação</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/impactos" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <AlertTriangle className="h-4 w-4" />
                  {!isCollapsed && <span>Impacto</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Impacto</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/usos" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  <User className="h-4 w-4" />
                  {!isCollapsed && <span>Usos</span>}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Usos</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>

        {/* Botão para recolher/expandir a sidebar */}
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
