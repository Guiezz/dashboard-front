"use client";

import { useState, useEffect, useCallback } from "react";
import { useReservoir } from "@/context/ReservoirContext";

// Importe seus tipos e componentes como antes
import {
  DashboardSummary,
  HistoryEntry,
  ChartDataPoint,
} from "@/lib/types";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { MetricCards } from "@/components/dashboard/MetricCards";
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

// CORREÇÃO: A URL base agora vem da variável de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function EstadoDeSecaPage() {
  const { selectedReservoir, isLoading: isReservoirLoading } = useReservoir();

  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [chart, setChart] = useState<ChartDataPoint[]>([]);

  // 1. Extraímos a lógica de fetch para uma função usando useCallback para poder reutilizá-la
  const fetchData = useCallback(async () => {
    if (!selectedReservoir) return;

    // Opcional: Se não quiser que a tela pisque com "Carregando..." durante o refresh,
    // você pode criar um estado separado para "isRefreshing" ou remover o setIsLoadingPage(true) daqui.
    // Por enquanto, mantivemos para garantir que o usuário saiba que algo está acontecendo.
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
      setHistory(await historyRes.json());
      setChart(await chartRes.json());

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoadingPage(false);
    }
  }, [selectedReservoir]); // Recria a função se o reservatório mudar

  // 2. O useEffect agora apenas chama essa função
  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoadingPage(isReservoirLoading);
      return;
    }

    fetchData();
  }, [selectedReservoir, isReservoirLoading, fetchData]);

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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Monitoramento do Estado de Seca do reservatório {selectedReservoir?.nome}
        </h1>
      </div>
      <MetricCards summary={summary} />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* 3. Passamos a função fetchData para o componente */}
          <VolumeChart
            data={chart}
            reservatorioId={selectedReservoir?.id}
            onRefresh={fetchData}
          />
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
    </main>
  );
}