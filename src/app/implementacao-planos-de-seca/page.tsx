"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";

import {
  DashboardSummary,
  PlanoAcao,
  HistoryEntry,
  ChartDataPoint,
} from "@/lib/types";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableMedidas } from "@/components/dashboard/PaginatedTableMedidas";
import { ActionStatusTabs } from "@/components/dashboard/ActionStatusTabs";
import { GaugeThresholds } from "@/components/dashboard/DroughtGauge";
import { Loader2 } from "lucide-react";
import { EmptyReservoirState } from "@/components/dashboard/EmptyReservoirState";

// Função auxiliar para converter strings de data
function parseDate(dateStr: string): Date {
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

export default function ImplementacaoPlanosPage() {
  const { selectedReservoir, isLoading: isReservoirLoading } = useReservoir();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ongoingActions, setOngoingActions] = useState<PlanoAcao[]>([]);
  const [completedActions, setCompletedActions] = useState<PlanoAcao[]>([]);

  // Estado para armazenar os dados do gráfico
  const [chart, setChart] = useState<ChartDataPoint[]>([]);

  // Estado para passar as metas calculadas para o Card
  const [currentThresholds, setCurrentThresholds] = useState<
    GaugeThresholds | undefined
  >(undefined);

  // Estados para o cálculo de tempo
  const [daysInState, setDaysInState] = useState<number>(0);
  const [sinceDate, setSinceDate] = useState<string>("");

  useEffect(() => {
    // Se não houver reservatório, paramos o loading para mostrar o EmptyState
    if (!selectedReservoir) {
      setIsLoadingPage(false);
      return;
    }

    const fetchDataForReservoir = async () => {
      setIsLoadingPage(true);
      setError(null);
      const id = selectedReservoir.id;

      try {
        const [summaryRes, historyRes, ongoingRes, completedRes, chartRes] =
          await Promise.all([
            fetch(
              `${config.apiBaseUrl}/reservatorios/${id}/dashboard/summary`,
              { cache: "no-store" },
            ),
            fetch(`${config.apiBaseUrl}/reservatorios/${id}/history`, {
              cache: "no-store",
            }),
            fetch(`${config.apiBaseUrl}/reservatorios/${id}/ongoing-actions`, {
              cache: "no-store",
            }),
            fetch(
              `${config.apiBaseUrl}/reservatorios/${id}/completed-actions`,
              { cache: "no-store" },
            ),
            fetch(
              `${config.apiBaseUrl}/reservatorios/${id}/dashboard/volume-chart`,
              { cache: "no-store" },
            ),
          ]);

        if (
          !summaryRes.ok ||
          !historyRes.ok ||
          !ongoingRes.ok ||
          !completedRes.ok ||
          !chartRes.ok
        ) {
          throw new Error("Falha ao buscar os dados do reservatório.");
        }

        const summaryData = await summaryRes.json();
        const historyData: HistoryEntry[] = await historyRes.json();
        const chartData: ChartDataPoint[] = await chartRes.json();

        setSummary(summaryData);
        setOngoingActions(await ongoingRes.json());
        setCompletedActions(await completedRes.json());
        setChart(chartData);

        // --- CÁLCULO DAS METAS (GAUGE) ---
        if (chartData.length > 0) {
          const lastPoint = chartData[chartData.length - 1];
          setCurrentThresholds({
            meta1: lastPoint.meta1,
            meta2: lastPoint.meta2,
            meta3: lastPoint.meta3,
          });
        } else {
          setCurrentThresholds(undefined);
        }

        // --- LÓGICA DE CÁLCULO DO TEMPO NO ESTADO ---
        if (historyData && historyData.length > 0) {
          const sortedHistory = [...historyData];
          const currentEntry = sortedHistory[sortedHistory.length - 1];
          const currentState = currentEntry["Estado de Seca"];

          let startDate = currentEntry.Data;

          for (let i = sortedHistory.length - 1; i >= 0; i--) {
            if (sortedHistory[i]["Estado de Seca"] !== currentState) {
              break;
            }
            startDate = sortedHistory[i].Data;
          }

          const start = parseDate(startDate);
          const today = new Date();
          start.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const diffTime = Math.abs(today.getTime() - start.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          setDaysInState(diffDays);
          setSinceDate(startDate);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido.",
        );
      } finally {
        setIsLoadingPage(false);
      }
    };

    fetchDataForReservoir();
  }, [selectedReservoir]);

  // 1. ESTADO: NADA SELECIONADO
  if (!selectedReservoir) {
    return (
      <EmptyReservoirState
        title="Implementação de Planos Indisponível"
        description="Selecione um hidrossistema no topo da página para visualizar o resumo de métricas, medidas recomendadas e status das ações."
      />
    );
  }

  // 2. ESTADO: CARREGANDO
  if (isLoadingPage) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando dados da implementação...
          </p>
        </div>
      </main>
    );
  }

  // 3. ESTADO: ERRO
  if (error || !summary) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center p-6 bg-card border rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold text-destructive mb-2">
            Erro ao carregar os dados
          </h1>
          <p className="text-muted-foreground">
            {error || "Verifique se a API está em execução e tente novamente."}
          </p>
        </div>
      </main>
    );
  }

  // 4. ESTADO: SUCESSO
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Implementação nos planos de seca do reservatório:{" "}
          <span className="text-primary">{selectedReservoir.nome}</span>
        </h1>
      </div>

      <MetricCards
        summary={summary}
        calculatedDays={daysInState}
        sinceDate={sinceDate}
        thresholds={currentThresholds}
      />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <PaginatedTableMedidas
          data={summary.medidasRecomendadas}
          estado={summary.estadoAtualSeca}
        />
        <ActionStatusTabs
          ongoing={ongoingActions}
          completed={completedActions}
        />
      </div>
    </main>
  );
}
