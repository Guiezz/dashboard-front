"use client";

import { useEffect, useState } from "react";
import { getDaysInMonth } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Download,
  Droplets,
  BarChart3,
  LineChart,
  FileText,
  Waves,
  Sun,
} from "lucide-react";
import { api } from "@/lib/api";
import { SimAcude, SimulacaoResponse } from "@/lib/types";
import { parseDataLocal } from "@/components/simulacao/helpers";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// CONTEXTO E COMPONENTES GLOBAIS
import { useReservoir } from "@/context/ReservoirContext";
import { EmptyReservoirState } from "@/components/dashboard/EmptyReservoirState"; // Importação do aviso padrão

// COMPONENTES LOCAIS
import { ConfigForm } from "@/components/simulacao/ConfigForm";
import { KPICards } from "@/components/simulacao/KPICards";
import { MainChart } from "@/components/simulacao/MainChart";
import { ResultsTable } from "@/components/simulacao/ResultsTable";
import { HistoricalCharts } from "@/components/simulacao/HistoricalCharts";

export default function SimulacaoPage() {
  // --- CONTEXTO ---
  const { selectedReservoir } = useReservoir();

  // --- ESTADOS ---
  const [acudes, setAcudes] = useState<SimAcude[]>([]);
  const [loadingAcudes, setLoadingAcudes] = useState(true);
  const [simulating, setSimulating] = useState(false);

  // Inputs
  const [selectedAcudeId, setSelectedAcudeId] = useState<string>("");
  const [capacidadeTotal, setCapacidadeTotal] = useState<number>(0);
  const [volPercentual, setVolPercentual] = useState<string>("50");

  // Datas
  const MIN_DATE = "1911-01-01";
  const MAX_DATE = "2017-12-31";
  const [dataInicio, setDataInicio] = useState("1911-01-01");
  const [dataFim, setDataFim] = useState("1915-12-01");
  const [demanda, setDemanda] = useState<string>("0.5");

  // Resultados
  const [resultado, setResultado] = useState<SimulacaoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- CARREGAMENTO INICIAL ---
  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSimulacaoAcudes();
        setAcudes(data);
      } catch (err) {
        console.error("Erro", err);
        setError("Não foi possível carregar os dados de simulação.");
      } finally {
        setLoadingAcudes(false);
      }
    }
    load();
  }, []);

  // --- SINCRONIZAÇÃO COM O CONTEXTO ---
  useEffect(() => {
    // Reseta resultado se mudar de açude
    setResultado(null);

    if (selectedReservoir && acudes.length > 0) {
      const match = acudes.find((a) => a.codigo === selectedReservoir.id);

      if (match) {
        setSelectedAcudeId(match.codigo.toString());
        setCapacidadeTotal(match.capacidade_m3 / 1000000);
        setError(null);
      } else {
        setSelectedAcudeId("");
        setCapacidadeTotal(0);
      }
    } else {
      setSelectedAcudeId("");
    }
  }, [selectedReservoir, acudes]);

  const handleSimular = async () => {
    if (!selectedAcudeId) return;

    // Validações
    const perc = parseFloat(volPercentual);
    if (isNaN(perc) || perc < 0 || perc > 100) {
      setError("O volume deve ser entre 0% e 100%.");
      return;
    }
    if (dataInicio < MIN_DATE || dataFim > MAX_DATE) {
      setError("As datas devem estar entre 1911 e 2017.");
      return;
    }

    setSimulating(true);
    setError(null);
    setResultado(null);

    const volAbsoluto = (perc / 100) * capacidadeTotal;

    try {
      const resp = await api.runSimulacao({
        reservatorio_id: parseInt(selectedAcudeId),
        volume_inicial: volAbsoluto,
        volume_final: volAbsoluto,
        data_inicio: new Date(dataInicio).toISOString(),
        data_fim: new Date(dataFim).toISOString(),
        usar_media_historica: false,
        demandas_mensais: [parseFloat(demanda)],
      });
      setResultado(resp);
    } catch (err: any) {
      setError(err.message || "Erro ao executar a simulação.");
    } finally {
      setSimulating(false);
    }
  };

  // --- FUNÇÕES DE DOWNLOAD ---
  const downloadCSV = (
    filename: string,
    headers: string[],
    rows: (string | number)[][],
  ) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCompleto = () => {
    if (!resultado) return;
    const headers = [
      "Data",
      "Afluencia (hm3)",
      "Evaporacao (hm3)",
      "Retirada (hm3)",
      "Vertimento (hm3)",
      "Volume Inicial (hm3)",
    ];
    const rows = resultado.resultados.map((r) => [
      r.data,
      r.afluencia_hm3.toFixed(3),
      r.evaporacao_hm3.toFixed(3),
      r.retirada_hm3.toFixed(3),
      r.vertimento_hm3.toFixed(3),
      r.volume_hm3.toFixed(3),
    ]);
    downloadCSV(`simulacao_completa_${selectedAcudeId}.csv`, headers, rows);
  };

  const handleDownloadVazoes = () => {
    if (!resultado) return;
    const headers = ["Data", "Vazao (hm3)"];
    const rows = resultado.resultados.map((r) => [
      r.data,
      r.afluencia_hm3.toFixed(3),
    ]);
    downloadCSV(`serie_vazoes_${selectedAcudeId}.csv`, headers, rows);
  };

  const handleDownloadEvaporacao = () => {
    if (!resultado) return;
    const headers = ["Data", "Evaporacao (hm3)"];
    const rows = resultado.resultados.map((r) => [
      r.data,
      r.evaporacao_hm3.toFixed(3),
    ]);
    downloadCSV(`serie_evaporacao_${selectedAcudeId}.csv`, headers, rows);
  };

  // --- CÁLCULO DE FALHAS ---
  const getMesesComFalha = () => {
    if (!resultado) return [];
    const demandaM3s = parseFloat(demanda);
    return resultado.resultados.filter((item) => {
      const data = parseDataLocal(item.data);
      const diasNoMes = getDaysInMonth(data);
      const demandaEsperadaHm3 = (demandaM3s * diasNoMes * 86400) / 1e6;
      return demandaEsperadaHm3 - item.retirada_hm3 > 0.01;
    });
  };
  const mesesFalha = getMesesComFalha();

  // --- RENDERIZAÇÃO: ESTADO VAZIO PADRÃO ---
  if (!selectedReservoir) {
    return (
      <div className="container mx-auto p-6 animate-in fade-in duration-500">
        <EmptyReservoirState />
      </div>
    );
  }

  // --- RENDERIZAÇÃO: PÁGINA PRINCIPAL ---
  return (
    <div className="container mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Droplets className="h-8 w-8 text-amber-700" />
            Simulador de Balanço Hídrico
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Cenário atual: <strong>{selectedReservoir.nome}</strong>. Avalie a
            segurança hídrica considerando a série histórica (1911-2017).
          </p>
        </div>

        {resultado && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Selecione o formato</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDownloadCompleto}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 text-blue-600" /> Resultado
                Completo (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDownloadVazoes}
                className="cursor-pointer"
              >
                <Waves className="mr-2 h-4 w-4 text-green-600" /> Apenas Vazões
                (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDownloadEvaporacao}
                className="cursor-pointer"
              >
                <Sun className="mr-2 h-4 w-4 text-orange-600" /> Apenas
                Evaporação (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* === COLUNA ESQUERDA: CONFIGURAÇÃO === */}
        <div className="lg:col-span-3 space-y-6">
          <ConfigForm
            selectedReservoirName={selectedReservoir.nome}
            selectedAcudeId={selectedAcudeId}
            capacidadeTotal={capacidadeTotal}
            volPercentual={volPercentual}
            setVolPercentual={setVolPercentual}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            demanda={demanda}
            setDemanda={setDemanda}
            onSimular={handleSimular}
            simulating={simulating}
            error={error}
            minDate={MIN_DATE}
            maxDate={MAX_DATE}
          />
        </div>

        {/* === COLUNA DIREITA: RESULTADOS === */}
        <div className="lg:col-span-9 space-y-6">
          {/* Aviso se selecionou mas não tem dados (ex: açude novo sem histórico) */}
          {selectedReservoir && !selectedAcudeId && !loadingAcudes && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-200 p-8 text-center">
              <AlertCircle className="h-12 w-12 mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold text-yellow-700">
                Dados Indisponíveis
              </h3>
              <p className="max-w-md mt-2">
                O reservatório <strong>{selectedReservoir.nome}</strong> não
                possui série histórica cadastrada para simulação. Por favor,
                selecione outro reservatório no menu.
              </p>
            </div>
          )}

          {/* Estado Inicial (Pronto para simular) */}
          {!resultado && !simulating && selectedAcudeId && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-slate-50 rounded-lg border-2 border-dashed">
              <Droplets className="h-12 w-12 mb-4 opacity-20" />
              <p>
                Configure os parâmetros à esquerda e clique em{" "}
                <strong>Gerar Simulação</strong>
              </p>
            </div>
          )}

          {/* Resultados com Abas */}
          {resultado && (
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger
                  value="simulacao"
                  className="flex items-center gap-2"
                >
                  <LineChart className="h-4 w-4" />
                  Simulação
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dados Históricos
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="simulacao"
                className="space-y-6 mt-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <KPICards
                  frequenciaFalha={resultado.frequencia_nao_atendida}
                  mesesFalha={mesesFalha}
                  demandaConfigurada={parseFloat(demanda)}
                />
                <MainChart data={resultado.resultados} />
                <ResultsTable data={resultado.resultados} />
              </TabsContent>

              <TabsContent
                value="historico"
                className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <HistoricalCharts data={resultado.resultados} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
