// src/lib/types.ts

// --- TIPOS DE DADOS GERAIS ---

export interface Reservatorio {
  id: number;
  nome: string;
  municipio: string;
  // Campos opcionais que podem vir ou não dependendo da rota
  bacia?: string;
  capacidade_hm3?: number;
}

// Para a página de Identificação (Bate com model.ReservatorioDetalhes do Go)
export interface IdentificationData {
  id: number;
  nome: string;
  municipio: string;
  descricao: string;
  lat: number;
  long: number;
  url_imagem: string;
  url_imagem_usos: string;
}

// --- TIPOS PARA O DASHBOARD ---

// Bate com model.DashboardResumo
export interface DashboardSummary {
  volumeAtualHm3: number;
  volumePercentual: number;
  estadoAtualSeca: string;
  dataUltimaMedicao: string;
  diasDesdeUltimaMudanca: number;
  medidasRecomendadas: PlanoAcaoResumo[];
}

// Bate com model.PlanoAcaoResumo
export interface PlanoAcaoResumo {
  acao: string; // Antes era "Ação"
  descricao: string; // Antes era "Descrição"
  responsaveis: string; // Antes era "Responsáveis"
}

// Bate com model.HistoricoTabela
export interface HistoryEntry {
  Data: string; // O Go manda "Data" (Maiúsculo) para compatibilidade
  "Estado de Seca": string; // O Go manda essa string formatada
  "Volume (hm3)": number; // O Go manda assim
  // "Volume (%)" foi removido pois o novo endpoint history não manda esse campo por padrão,
  // mas você pode calcular no front se precisar: (vol / cap) * 100
}

// Bate com model.GraficoVolumeData
export interface ChartDataPoint {
  Data: string; // O Go foi configurado para mandar "Data"
  volume: number;
  meta1: number;
  meta2: number;
  meta3: number;
}

// --- TIPOS PARA A PÁGINA DE PLANOS DE AÇÃO ---

// Bate com model.FiltrosPlanoAcao
export interface ActionPlanFilterOptions {
  estados: string[];
  impactos: string[];
  problemas: string[];
  acoes: string[];
}

// Bate com model.PlanoAcao (A estrutura completa do banco)
// Substitui as interfaces antigas "ActionStatus" e "ActionPlan"
export interface PlanoAcao {
  id: number;
  reservatorio_id: number;
  situacao: string; // "Em andamento", "Concluído"
  acoes: string; // Nome da ação
  descricao_acao: string; // Descrição detalhada
  responsaveis: string;
  classes_acao: string;
  tipo_impactos: string;
  problemas: string;
  orgaos_envolvidos: string;
  indicadores: string;
  estado_seca: string;
}

// --- TIPOS PARA A PÁGINA DE BALANÇO HÍDRICO ---

// Bate com model.BalancoHidricoResumo
export interface StaticWaterBalanceCharts {
  balancoMensal: BalancoMensal[];
  composicaoDemanda: ComposicaoDemanda[];
  ofertaDemanda: OfertaDemanda[];
}

// Estes mapas continuam iguais pois o UseCase do Go monta o map[string]interface{} manualmente
export interface BalancoMensal {
  Mês: string;
  "Afluência (m³/s)": number;
  "Demanda (m³/s)": number;
  "Balanço (m³/s)": number;
  "Evaporação (m³/s)": number;
}

export interface ComposicaoDemanda {
  Uso: string;
  "Vazão (L/s)": number;
}

export interface OfertaDemanda {
  Cenário: string;
  "Oferta (L/s)": number;
  "Demanda (L/s)": number;
}

// --- TIPOS ADICIONAIS ---

// Bate com model.UsoAgua
export interface UsoAgua {
  id: number;
  reservatorio_id: number;
  uso: string;
  vazao_normal: number;
  vazao_escassez: number;
}

// Bate com model.Responsavel
export interface Responsavel {
  id: number;
  reservatorio_id: number;
  grupo: string;
  organizacao: string;
  cargo: string;
  nome: string;
}
