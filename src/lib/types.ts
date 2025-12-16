// src/lib/types.ts

// --- TIPOS DE DADOS GERAIS ---

export interface Reservatorio {
  id: number;
  nome: string;
  municipio: string;

  bacia?: string;
  capacidade_hm3?: number;
}

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

export interface DashboardSummary {
  volumeAtualHm3: number;
  volumePercentual: number;
  estadoAtualSeca: string;
  dataUltimaMedicao: string;
  diasDesdeUltimaMudanca: number;
  medidasRecomendadas: PlanoAcaoResumo[];
}

export interface PlanoAcaoResumo {
  acao: string;
  descricao: string;
  responsaveis: string;
}

export interface HistoryEntry {
  Data: string;
  "Estado de Seca": string;
  "Volume (hm3)": number;
}

export interface ChartDataPoint {
  Data: string;
  volume: number;
  meta1: number;
  meta2: number;
  meta3: number;
}

// --- TIPOS PARA A PÁGINA DE PLANOS DE AÇÃO ---

export interface ActionPlanFilterOptions {
  estados: string[];
  impactos: string[];
  problemas: string[];
  acoes: string[];
}

export interface PlanoAcao {
  id: number;
  reservatorio_id: number;
  situacao: string;
  acoes: string;
  descricao_acao: string;
  responsaveis: string;
  classes_acao: string;
  tipo_impactos: string;
  problemas: string;
  orgaos_envolvidos: string;
  indicadores: string;
  estado_seca: string;
}

// --- TIPOS PARA A PÁGINA DE BALANÇO HÍDRICO ---

export interface StaticWaterBalanceCharts {
  balancoMensal: BalancoMensal[];
  composicaoDemanda: ComposicaoDemanda[];
  ofertaDemanda: OfertaDemanda[];
}

export interface BalancoMensal {
  Mês: string;
  "Afluência (m³/s)": number;
  "Demanda (m³/s)": number;
  "Balanço (m³/s)": number;
  "Evaporação (m³/s)": number;
}

export interface ComposicaoDemanda {
  usos: string;
  demandas_hm3: number;
}

export interface OfertaDemanda {
  cenarios: string;
  "oferta_l/s": number;
  "demanda_l/s": number;
}

// --- TIPOS ADICIONAIS ---

export interface UsoAgua {
  id: number;
  reservatorio_id: number;
  uso: string;
  vazao_normal: number;
  vazao_escassez: number;
}

export interface Responsavel {
  id: number;
  reservatorio_id: number;
  grupo: string;
  organizacao: string;
  cargo: string;
  nome: string;
}
