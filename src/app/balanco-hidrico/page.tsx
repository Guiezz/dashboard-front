"use client";

import { useEffect, useState } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { StaticWaterBalanceCharts } from "@/lib/types";
import { BalancoHidricoChart } from "@/components/balance/BalancoHidricoChart";
import { ComposicaoDemandaChart } from "@/components/balance/ComposicaoDemandaChart";
import { OfertaDemandaChart } from "@/components/balance/OfertaDemandaChart";
import { Loader2 } from "lucide-react";

// CORREÇÃO: A URL base agora vem da variável de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function BalancoHidricoPage() {
  const { selectedReservoir } = useReservoir();
  const [chartData, setChartData] = useState<StaticWaterBalanceCharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedReservoir) {
      // Se não houver reservatório selecionado (ex: durante o carregamento inicial),
      // não faz sentido buscar dados. Apenas mostramos o estado de loading.
      setIsLoading(true);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // CORREÇÃO: A URL é construída dinamicamente com a base correta.
        const response = await fetch(
          `${API_BASE_URL}/api/reservatorios/${selectedReservoir.id}/water-balance/static-charts`
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
  }, [selectedReservoir]);

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
