// src/lib/types.ts

// --- TIPOS DE DADOS GERAIS ---

export interface Reservatorio {
  id: number;
  nome: string;
  municipio: string;

  bacia?: string;
  capacidade_hm3: number;
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
  nome: string; // Agora receberá o nome corretamente
  grupo: string;
  organizacao: string;
  setor: string; // Garantir que o campo existe para exibição
  cargo: string; // Agora receberá o cargo corretamente
}

// --- SIMULAÇÃO ---
//
export interface SimAcude {
  codigo: number;
  nome: string;
  municipio: string;
  capacidade_m3: number;
}

export interface SimulacaoRequest {
  reservatorio_id: number;
  volume_inicial: number;
  data_inicio: string; // ISO Date string (YYYY-MM-DD)
  data_fim: string; // ISO Date string
  usar_media_historica: boolean;
  demandas_mensais: number[]; // Array com 1 ou 12 valores
}

export interface SimulacaoResultadoPonto {
  data: string;
  volume_hm3: number;
  afluencia_hm3: number;
  retirada_hm3: number;
  evaporacao_hm3: number;
  vertimento_hm3: number;
  alerta?: string;
}

export interface SimulacaoResponse {
  resultados: SimulacaoResultadoPonto[];
  frequencia_nao_atendida: number;
  volume_final: number;
}
