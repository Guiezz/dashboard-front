import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Activity, CalendarDays, ShieldCheck } from "lucide-react";
import type { DashboardSummary } from "@/lib/types";

interface MetricCardsProps {
  summary: DashboardSummary;
  // Novas props para corrigir o Tempo no Estado
  calculatedDays?: number;
  sinceDate?: string;
}

export function MetricCards({
  summary,
  calculatedDays,
  sinceDate,
}: MetricCardsProps) {
  // Se calculatedDays for passado, usa ele. Caso contrário, tenta usar o do summary.
  // Se ambos forem indefinidos, mostra 0.
  const diasNoEstado = calculatedDays ?? summary.diasDesdeUltimaMudanca ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Volume Atual (hm³)
          </CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.volumeAtualHm3}</div>
          <p className="text-xs text-muted-foreground">
            Última medição registrada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estado da Seca</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.estadoAtualSeca}</div>
          <p className="text-xs text-muted-foreground">
            Classificação atual do sistema
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo no Estado</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasNoEstado} dias</div>
          <p className="text-xs text-muted-foreground">
            {/* Correção: Exibe a data de início se fornecida */}
            {sinceDate ? `Desde ${sinceDate}` : "Data de início não disponível"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Medidas Ativas</CardTitle>
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.medidasRecomendadas.length}
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendações em vigor
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
