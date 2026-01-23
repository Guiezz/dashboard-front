"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";

import {
  DashboardSummary,
  PlanoAcao,
  HistoryEntry,
  ChartDataPoint, // <--- 1. Importar o tipo do gráfico
} from "@/lib/types";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableMedidas } from "@/components/dashboard/PaginatedTableMedidas";
import { ActionStatusTabs } from "@/components/dashboard/ActionStatusTabs";
import { GaugeThresholds } from "@/components/dashboard/DroughtGauge";

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

  // 2. Estado para armazenar os dados do gráfico (necessário para pegar as metas atuais)
  const [chart, setChart] = useState<ChartDataPoint[]>([]);

  // Estado para passar as metas calculadas para o Card
  const [currentThresholds, setCurrentThresholds] = useState<
    GaugeThresholds | undefined
  >(undefined);

  // Estados para o cálculo de tempo
  const [daysInState, setDaysInState] = useState<number>(0);
  const [sinceDate, setSinceDate] = useState<string>("");

  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoadingPage(isReservoirLoading);
      return;
    }

    const fetchDataForReservoir = async () => {
      setIsLoadingPage(true);
      setError(null);
      const id = selectedReservoir.id;

      try {
        // 3. Adicionado o fetch do 'volume-chart' para obter as metas mais recentes
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

        // --- 4. CÁLCULO DAS METAS (GAUGE) ---
        if (chartData.length > 0) {
          const lastPoint = chartData[chartData.length - 1];

          // CORREÇÃO: Usar os valores diretos (0.104), sem dividir pela capacidade.
          // O componente DroughtGauge já espera decimais e multiplica por 100.
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
        // ---------------------------------------------------------
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
  }, [selectedReservoir, isReservoirLoading]);

  if (isLoadingPage) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Carregando dados do reservatório...
          </h1>
        </div>
      </main>
    );
  }

  if (error || !summary) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>
            {error || "Verifique se a API está em execução e tente novamente."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Implementação nos planos de seca do reservatório:{" "}
          {selectedReservoir?.nome}
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
