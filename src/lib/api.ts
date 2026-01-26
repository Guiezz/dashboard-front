import {
  Reservatorio,
  IdentificationData,
  DashboardSummary,
  ChartDataPoint,
  HistoryEntry,
  PlanoAcao,
  ActionPlanFilterOptions,
  StaticWaterBalanceCharts,
  UsoAgua,
  Responsavel,
  SimAcude,
  SimulacaoRequest,
  SimulacaoResponse,
} from "./types";
import { config } from "@/config";

// Define a URL base. Se não houver variável de ambiente, usa o localhost do Docker/Go
const API_BASE_URL = config.apiBaseUrl;

/**
 * Função genérica para fazer as chamadas (Fetch Wrapper)
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    // O Next.js faz cache por padrão. 'no-store' garante dados frescos.
    cache: "no-store",
  });

  if (!res.ok) {
    // Tenta ler o erro que vem do Go
    let errorMessage = `Erro na API: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch (e) {
      // Ignora erro de parse se não for JSON
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export const api = {
  // --- RESERVATÓRIOS (Geral) ---
  getReservatorios: () => fetchAPI<Reservatorio[]>("/reservatorios"),

  // --- IDENTIFICAÇÃO ---
  getIdentification: (id: number) =>
    fetchAPI<IdentificationData>(`/reservatorios/${id}/identification`),

  // --- DASHBOARD (Resumo e Gráficos) ---
  getDashboardSummary: (id: number) =>
    fetchAPI<DashboardSummary>(`/reservatorios/${id}/dashboard/summary`),

  getVolumeChartData: (id: number) =>
    fetchAPI<ChartDataPoint[]>(`/reservatorios/${id}/dashboard/volume-chart`),

  getHistory: (id: number) =>
    fetchAPI<HistoryEntry[]>(`/reservatorios/${id}/history`),

  // --- PLANOS DE AÇÃO (Novas rotas separadas) ---
  getOngoingActions: (id: number) =>
    fetchAPI<PlanoAcao[]>(`/reservatorios/${id}/ongoing-actions`),

  getCompletedActions: (id: number) =>
    fetchAPI<PlanoAcao[]>(`/reservatorios/${id}/completed-actions`),

  // Busca planos com filtros (para a página dedicada de Planos)
  getActionPlans: (
    id: number,
    filters?: {
      estado?: string;
      impacto?: string;
      problema?: string;
      acao?: string;
    },
  ) => {
    const params = new URLSearchParams();
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.impacto) params.append("impacto", filters.impacto);
    if (filters?.problema) params.append("problema", filters.problema);
    if (filters?.acao) params.append("acao", filters.acao);

    return fetchAPI<PlanoAcao[]>(
      `/reservatorios/${id}/action-plans?${params.toString()}`,
    );
  },

  getActionPlanFilters: (id: number) =>
    fetchAPI<ActionPlanFilterOptions>(
      `/reservatorios/${id}/action-plans/filters`,
    ),

  // --- BALANÇO HÍDRICO ---
  getWaterBalance: (id: number) =>
    fetchAPI<StaticWaterBalanceCharts>(`/reservatorios/${id}/water-balance`),

  // --- CADASTROS AUXILIARES ---
  getUsosAgua: (id: number) =>
    fetchAPI<UsoAgua[]>(`/reservatorios/${id}/water-uses`),

  getResponsaveis: (id: number) =>
    fetchAPI<Responsavel[]>(`/reservatorios/${id}/responsibles`),

  // --- SIMULAÇÃO (Novo) ---

  // Lista os açudes disponíveis para simular (vem da tabela sim_acudes)
  getSimulacaoAcudes: () => fetchAPI<SimAcude[]>("/simulacao/acudes"),

  // Executa a simulação enviando os parâmetros
  runSimulacao: (params: SimulacaoRequest) =>
    fetchAPI<SimulacaoResponse>("/simulacao/run", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};
