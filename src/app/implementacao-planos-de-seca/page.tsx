"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";

// Adicionado HistoryEntry aos imports
import { DashboardSummary, PlanoAcao, HistoryEntry } from "@/lib/types";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableMedidas } from "@/components/dashboard/PaginatedTableMedidas";
import { ActionStatusTabs } from "@/components/dashboard/ActionStatusTabs";

// Função auxiliar para converter strings de data (igual à outra página)
function parseDate(dateStr: string): Date {
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
}

export default function EstadoDeSecaPage() {
  const { selectedReservoir, isLoading: isReservoirLoading } = useReservoir();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ongoingActions, setOngoingActions] = useState<PlanoAcao[]>([]);
  const [completedActions, setCompletedActions] = useState<PlanoAcao[]>([]);

  // Novos estados para o cálculo de tempo (Adicionado)
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
        // Adicionada a busca do histórico (historyRes)
        const [summaryRes, historyRes, ongoingRes, completedRes] =
          await Promise.all([
            fetch(
              `${config.apiBaseUrl}/reservatorios/${id}/dashboard/summary`,
              {
                cache: "no-store",
              },
            ),
            fetch(`${config.apiBaseUrl}/reservatorios/${id}/history`, {
              cache: "no-store",
            }),
            fetch(`${config.apiBaseUrl}/reservatorios/${id}/ongoing-actions`, {
              cache: "no-store",
            }),
            fetch(
              `${config.apiBaseUrl}/reservatorios/${id}/completed-actions`,
              {
                cache: "no-store",
              },
            ),
          ]);

        if (
          !summaryRes.ok ||
          !historyRes.ok ||
          !ongoingRes.ok ||
          !completedRes.ok
        ) {
          throw new Error("Falha ao buscar os dados do reservatório.");
        }

        const summaryData = await summaryRes.json();
        const historyData: HistoryEntry[] = await historyRes.json();

        setSummary(summaryData);
        setOngoingActions(await ongoingRes.json());
        setCompletedActions(await completedRes.json());

        // --- LÓGICA DE CÁLCULO DO TEMPO NO ESTADO (Adicionada) ---
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

      {/* Adicionado as props calculatedDays e sinceDate */}
      <MetricCards
        summary={summary}
        calculatedDays={daysInState}
        sinceDate={sinceDate}
      />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
        {/* Placeholder para conteúdo futuro se necessário */}
      </div>
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
