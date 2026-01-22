"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Gauge, CalendarDays, ShieldCheck, Activity } from "lucide-react";
import type { DashboardSummary } from "@/lib/types";
import {
  DroughtGauge,
  GaugeThresholds,
} from "@/components/dashboard/DroughtGauge";

interface MetricCardsProps {
  summary: DashboardSummary;
  calculatedDays?: number;
  sinceDate?: string;
  thresholds?: GaugeThresholds;
}

export function MetricCards({
  summary,
  calculatedDays,
  sinceDate,
  thresholds,
}: MetricCardsProps) {
  const diasNoEstado = calculatedDays ?? summary.diasDesdeUltimaMudanca ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {/* CARD 1: VOLUME */}
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

      {/* CARD 2: GAUGE (RELÓGIO) */}
      {/* CARD 2: GAUGE (RELÓGIO) */}
      <Card className="flex flex-col justify-center overflow-hidden">
        <CardHeader className="space-y-1 pb-2">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Volume Atual (hm³)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>

          <CardDescription className="text-xs">
            Indicador de Severidade da Seca
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pb-4 pt-4 flex items-center justify-center">
          <DroughtGauge
            currentState={summary.estadoAtualSeca}
            percentage={summary.volumePercentual}
            thresholds={thresholds}
          />
        </CardContent>
      </Card>

      {/* CARD 3: TEMPO NO ESTADO */}
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
