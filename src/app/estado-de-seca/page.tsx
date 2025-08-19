"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";

// Importe seus tipos e componentes como antes
import {
  DashboardSummary,
  HistoryEntry,
  ChartDataPoint,
  ActionStatus,
} from "@/lib/types";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableMedidas } from "@/components/dashboard/PaginatedTableMedidas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActionStatusTabs } from "@/components/dashboard/ActionStatusTabs";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

export default function EstadoDeSecaPage() {
  // 3. Usar o contexto para obter o reservatório selecionado
  const { selectedReservoir, isLoading: isReservoirLoading } = useReservoir();

  // 4. Gerenciar o estado dos dados da página (loading, data, error)
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [chart, setChart] = useState<ChartDataPoint[]>([]);
const [ongoingActions, setOngoingActions] = useState<ActionStatus[]>([]);
const [completedActions, setCompletedActions] = useState<ActionStatus[]>([]);

  // 5. Efeito que busca os dados sempre que o reservatório selecionado mudar
  useEffect(() => {
    // Se não houver reservatório selecionado, não faz nada
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
          fetch(`${API_BASE_URL}/${id}/dashboard/summary`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/${id}/history`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/${id}/chart/volume-data`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/${id}/ongoing-actions`, { cache: "no-store" }),
          fetch(`${API_BASE_URL}/${id}/completed-actions`, { cache: "no-store" }),
        ]);

        if (!summaryRes.ok || !historyRes.ok || !chartRes.ok || !ongoingRes.ok || !completedRes.ok) {
          throw new Error("Falha ao buscar os dados do reservatório.");
        }

        // Atualiza os estados com os novos dados
        setSummary(await summaryRes.json());
        setHistory(await historyRes.json());
        setChart(await chartRes.json());
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
  }, [selectedReservoir]); // A mágica acontece aqui: o hook re-executa quando `selectedReservoir` muda

  // 6. Renderizar estados de loading e erro
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
  
  const recentHistory = history.slice(0, 8);

  // 7. Renderizar o conteúdo da página com os dados do estado
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          {/* Título dinâmico com o nome do reservatório */}
          Dashboard: {selectedReservoir?.nome}
        </h1>
      </div>
      <MetricCards summary={summary} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <VolumeChart data={chart} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
            <CardDescription>
              Os 8 registros mais recentes do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Volume (hm³)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.map((entry, index) => (
                  <TableRow key={`${entry.Data}-${index}`}>
                    <TableCell>{entry.Data}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry["Estado de Seca"]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {entry["Volume (Hm³)"]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
