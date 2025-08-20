"use client";

import { useEffect, useState } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 1. Importar o hook do contexto
import { StaticWaterBalanceCharts } from "@/lib/types"; // 2. Usar o tipo global
import { BalancoHidricoChart } from "@/components/balance/BalancoHidricoChart";
import { ComposicaoDemandaChart } from "@/components/balance/ComposicaoDemandaChart";
import { OfertaDemandaChart } from "@/components/balance/OfertaDemandaChart";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

export default function BalancoHidricoPage() {
  // 3. Usar o contexto para obter o reservatório
  const { selectedReservoir } = useReservoir();

  // 4. Gerenciar o estado com o tipo global
  const [chartData, setChartData] = useState<StaticWaterBalanceCharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Efeito que busca os dados quando o reservatório muda
  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 6. URL agora é dinâmica
        const response = await fetch(
          `${API_BASE_URL}/${selectedReservoir.id}/water-balance/static-charts`
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API do Balanço Hídrico");
        }
        setChartData(await response.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedReservoir]); // 7. A dependência garante a re-execução

  // 8. Renderizar estados de carregamento e erro
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados do balanço hídrico...</p>
        </div>
      </main>
    );
  }

  if (error || !chartData) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-500 p-4">
        Erro ao carregar dados: {error || "Nenhum dado retornado."}
      </div>
    );
  }

  return (
    <main className="px-2 md:px-6 lg:px-8 py-8 space-y-8">
       <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Balanço Hídrico: {selectedReservoir?.nome}
        </h1>
      </div>
      <OfertaDemandaChart data={chartData.ofertaDemanda} />
      <div className="grid gap-8 md:grid-cols-2">
        <ComposicaoDemandaChart data={chartData.composicaoDemanda} />
        <BalancoHidricoChart data={chartData.balancoMensal} />
      </div>
    </main>
  );
}
