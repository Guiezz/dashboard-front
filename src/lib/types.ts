// src/lib/types.ts (VERSÃO COMPLETA E CORRIGIDA)

// --- TIPOS DE DADOS GERAIS ---

// Para o seletor de reservatórios no Header
export interface ReservatorioSelecao {
  id: number;
  nome: string;
}

// Para a página de Identificação
export interface IdentificationData {
  descricao: string;
  lat: number;
  long: number;
  nome: string;
  municipio: string;
  url_imagem: string;
  url_imagem_usos: string | null;
}


// --- TIPOS PARA O DASHBOARD (PÁGINA ESTADO DE SECA) ---

// Para os cards de métricas no topo do Dashboard
export interface DashboardSummary {
  volumeAtualHm3: number;
  volumePercentual: number;      // <-- CORRIGIDO
  estadoAtualSeca: string;
  dataUltimaMedicao: string;     // <-- CORRIGIDO
  diasDesdeUltimaMudanca: number;
  medidasRecomendadas: MedidaRecomendada[];
}

// Para a tabela de medidas recomendadas no Dashboard
export interface MedidaRecomendada {
  Ação: string;
  Descrição: string;
  Responsáveis: string;          // <-- CORRIGIDO
}

// Para a tabela de histórico no Dashboard
export interface HistoryEntry {
  Data: string;
  "Estado de Seca": string;
  "Volume (Hm³)": number;
}

// Para o gráfico de volume no Dashboard
export interface ChartDataPoint {
  Data: string;
  volume: number;
  meta1: number;
  meta2: number;
  meta3: number;
}

// Para as abas de ações em andamento/concluídas no Dashboard
export interface ActionStatus {     // <-- ESTE É O TIPO CORRETO E RENOMEADO
  AÇÕES: string;
  RESPONSÁVEIS: string;
  SITUAÇÃO: string;
}


// --- TIPOS PARA A PÁGINA DE PLANOS DE AÇÃO ---

// NOVO: Para os filtros da página de planos de ação
export interface ActionPlanFilterOptions {
  estados: string[];
  impactos: string[];
  problemas: string[];
  acoes: string[];
}

// NOVO: Para a tabela principal de planos de ação
export interface ActionPlan {
  "DESCRIÇÃO DA AÇÃO": string;
  "CLASSES DE AÇÃO": string;
  "RESPONSÁVEIS": string;
}


// --- TIPOS PARA A PÁGINA DE BALANÇO HÍDRICO ---

// NOVO: Estrutura principal do retorno do endpoint /water-balance/static-charts
export interface StaticWaterBalanceCharts {
  balancoMensal: BalancoMensal[];
  composicaoDemanda: ComposicaoDemanda[];
  ofertaDemanda: OfertaDemanda[];
}

// NOVO: Para o gráfico de balanço mensal
export interface BalancoMensal {
  "Mês": string;
  "Afluência (m³/s)": number;
  "Demanda (m³/s)": number;
  "Balanço (m³/s)": number;
  "Evaporação (m³/s)": number;
}

// NOVO: Para o gráfico de composição da demanda
export interface ComposicaoDemanda {
  "Uso": string;
  "Vazão (L/s)": number;
}

// NOVO: Para o gráfico de oferta vs. demanda
export interface OfertaDemanda {
  "Cenário": string;
  "Oferta (L/s)": number;
  "Demanda (L/s)": number;
}


// --- TIPOS ADICIONAIS ---

// NOVO: Para a página de Usos da Água
export interface UsoAgua {
  uso: string;
  vazao_normal: number;
  vazao_escassez: number;
}

// NOVO: Para a página de Responsáveis
export interface Responsavel {
  // Ajuste os campos conforme o seu schema do banco de dados (models.Responsavel)
  id: number;
  orgao: string;
  nome_contato: string;
  email: string;
  telefone: string;
}
