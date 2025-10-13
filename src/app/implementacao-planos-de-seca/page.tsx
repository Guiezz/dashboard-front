"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";

// Importe seus tipos e componentes como antes
import {
  DashboardSummary,
  ActionStatus,
} from "@/lib/types";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableMedidas } from "@/components/dashboard/PaginatedTableMedidas";
import { ActionStatusTabs } from "@/components/dashboard/ActionStatusTabs";

// CORREÇÃO: A URL base agora vem da variável de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function EstadoDeSecaPage() {
  const { selectedReservoir, isLoading: isReservoirLoading } = useReservoir();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [ongoingActions, setOngoingActions] = useState<ActionStatus[]>([]);
  const [completedActions, setCompletedActions] = useState<ActionStatus[]>([]);

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
        const [summaryRes, historyRes, chartRes, ongoingRes, completedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/dashboard/summary`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/history`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/chart/volume-data`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/ongoing-actions`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/completed-actions`, { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !historyRes.ok || !chartRes.ok || !ongoingRes.ok || !completedRes.ok) {
          throw new Error("Falha ao buscar os dados do reservatório.");
        }

        setSummary(await summaryRes.json());
        setOngoingActions(await ongoingRes.json());
        setCompletedActions(await completedRes.json());

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
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
          <h1 className="text-2xl font-bold">Carregando dados do reservatório...</h1>
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
          <p>{error || "Verifique se a API está em execução e tente novamente."}</p>
        </div>
      </main>
    );
  }
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Implementação nos planos de seca do reservatório: {selectedReservoir?.nome}
        </h1>
      </div>
      <MetricCards summary={summary} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">


      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <PaginatedTableMedidas
          data={summary.medidasRecomendadas}
          estado={summary.estadoAtualSeca}
        />
        <ActionStatusTabs ongoing={ongoingActions} completed={completedActions} />
      </div>
    </main>
  );
}
