// src/app/estado-de-seca/page.tsx
import {
  DashboardSummary,
  HistoryEntry,
  ChartDataPoint,
  OngoingAction,
} from "@/lib/types";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { PaginatedTableAcoes } from "@/components/dashboard/PaginatedTableAcoes";
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

async function getDashboardData() {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const [summaryRes, historyRes, chartRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/dashboard/summary`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/api/history`, { cache: "no-store" }),
      fetch(`${API_BASE_URL}/api/chart/volume-data`, { cache: "no-store" }),
    ]);
    if (!summaryRes.ok || !historyRes.ok || !chartRes.ok)
      throw new Error("Falha ao buscar dados do dashboard");
    const summary: DashboardSummary = await summaryRes.json();
    const history: HistoryEntry[] = await historyRes.json();
    const chart: ChartDataPoint[] = await chartRes.json();
    return { summary, history, chart };
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getOngoingActions(): Promise<OngoingAction[] | null> {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/ongoing-actions`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Falha ao buscar ações em andamento");
    const data = await res.json();
    if (data.error) {
      console.error("API error for ongoing actions:", data.error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Adicionando a função para buscar ações concluídas
async function getCompletedActions(): Promise<OngoingAction[] | null> {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/completed-actions`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar ações concluídas");
    const data = await res.json();
    if (data.error) {
        console.error("API error for completed actions:", data.error);
        return [];
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export default async function EstadoDeSecaPage() {
  const [dashboardData, ongoingActions, completedActions] = await Promise.all([
    getDashboardData(),
    getOngoingActions(),
    getCompletedActions(),
  ]);

  const { summary, history, chart } = dashboardData || {};

  if (!summary || !history || !chart || ongoingActions === null || completedActions === null) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados da página.
          </h1>
          <p>Verifique se a API Python está em execução.</p>
        </div>
      </main>
    );
  }

  const recentHistory = history.slice(0, 5);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Dashboard de Estado de Seca
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
              Os 5 registros mais recentes do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* --- CÓDIGO DO HISTÓRICO REINSERIDO AQUI --- */}
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

      {/* Medidas e Ações com paginação */}
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
