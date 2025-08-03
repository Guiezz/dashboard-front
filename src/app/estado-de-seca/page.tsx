// src/app/dashboard/page.tsx

import { DashboardSummary, HistoryEntry, ChartDataPoint } from "@/lib/types";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// A função de buscar dados continua aqui, pois é específica desta página
async function getDashboardData() {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const [summaryRes, historyRes, chartRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/dashboard/summary`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/api/history`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/api/chart/volume-data`, { cache: "no-store" }),
    ]);
    if (!summaryRes.ok || !historyRes.ok || !chartRes.ok) throw new Error("Falha ao buscar dados");
    const summary: DashboardSummary = await summaryRes.json();
    const history: HistoryEntry[] = await historyRes.json();
    const chart: ChartDataPoint[] = await chartRes.json();
    return { summary, history, chart };
  } catch (error) {
    console.error(error);
    return { summary: null, history: null, chart: null };
  }
}

export default async function DashboardPage() {
  const { summary, history, chart } = await getDashboardData();

  if (!summary || !history || !chart) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-red-500">Erro ao carregar os dados.</h1>
          <p>Verifique se a API Python está em execução.</p>
        </div>
      </main>
    );
  }

  const recentHistory = history.slice(0, 5);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard de Monitoramento</h1>
      </div>
      
      <MetricCards summary={summary} />

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <VolumeChart data={chart} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
            <CardDescription>Os 5 registros mais recentes do sistema.</CardDescription>
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
                {recentHistory.map((entry) => (
                  <TableRow key={entry.Data}>
                    <TableCell>{entry.Data}</TableCell>
                    <TableCell><Badge variant="outline">{entry["Estado de Seca"]}</Badge></TableCell>
                    <TableCell className="text-right">{entry["Volume (Hm³)"]}</TableCell>
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
