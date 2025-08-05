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
