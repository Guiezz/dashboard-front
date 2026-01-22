"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, CalendarDays, ShieldCheck } from "lucide-react";
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
      <Card className="flex flex-col justify-between">
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
      <Card className="flex flex-col justify-center overflow-hidden">
        {/* Padding ajustado para o novo SVG */}
        <CardContent className="p-0 pb-4 pt-6 flex items-center justify-center">
          <DroughtGauge
            currentState={summary.estadoAtualSeca}
            percentage={summary.volumePercentual}
            thresholds={thresholds}
          />
        </CardContent>
      </Card>

      {/* CARD 3: TEMPO NO ESTADO */}
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo no Estado</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasNoEstado} dias</div>
          <p className="text-xs text-muted-foreground">
            {sinceDate ? `Desde ${sinceDate}` : "Data não disponível"}
          </p>
        </CardContent>
      </Card>

      {/* CARD 4: MEDIDAS ATIVAS */}
      <Card className="flex flex-col justify-between">
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
