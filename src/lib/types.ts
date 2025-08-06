// src/lib/types.ts

export interface DashboardSummary {
  volumeAtualHm3: number;
  estadoAtualSeca: string;
  diasDesdeUltimaMudanca: number;
  dataUltimaMudanca: string;
  medidasRecomendadas: Medida[];
}

export interface Medida {
  Ação: string;
  Descrição: string;
}

export interface HistoryEntry {
  Data: string;
  "Estado de Seca": string;
  "Volume (%)": number;
  "Volume (Hm³)": number;
}

export interface ChartDataPoint {
  Data: string;
  volume: number;
  meta1: number;
  meta2: number;
  meta3: number;
}

export interface IdentificationData {
  identification_text: string;
  location_data: {
    lat: number;
    lon: number;
  }[];
}

export interface OngoingAction {
  'AÇÕES': string;
  'RESPONSÁVEIS': string;
  'SITUAÇÃO': string;
}

export interface WaterBalanceSummary {
  afluencia_m3s: number;
  defluencia_m3s: number;
  balanco_m3s: number;
}

export interface HistoricalDataPoint {
  Data: string;
  volume_percentual: number;
}

export interface TriggerData {
  'Mês': string;
  'Gatilho para ALERTA (Abaixo de)': number;
  'Gatilho para SECA (Abaixo de)': number;
  'Gatilho para SECA SEVERA (Abaixo de)': number;
}

export interface UsageAnalysisItem {
  uso: string;
  meta_l_s: number;
  real_l_s: number;
}

export interface WaterUsageAnalysis {
  estado_atual: string;
  analise_de_uso: UsageAnalysisItem[];
}

