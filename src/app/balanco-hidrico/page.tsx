"use client";

import { useEffect, useState } from "react";
import { BalancoHidricoChart } from "@/components/balance/BalancoHidricoChart";
import { ComposicaoDemandaChart } from "@/components/balance/ComposicaoDemandaChart";
import { OfertaDemandaChart } from "@/components/balance/OfertaDemandaChart";

// Defina os tipos de dados esperados da API
interface StaticChartData {
  balancoMensal: any[];
  composicaoDemanda: any[];
  ofertaDemanda: any[];
}

export default function BalancoHidricoPage() {
  const [chartData, setChartData] = useState<StaticChartData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Use a URL completa da sua API se necessário
        const response = await fetch(
          "http://127.0.0.1:8000/api/water-balance/static-charts"
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setChartData(data);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 p-4">Erro ao carregar dados: {error}</div>
    );
  }

  if (!chartData) {
    return <div>Carregando dados dos gráficos...</div>;
  }

  return (
    <div className="space-y-4">
      <BalancoHidricoChart data={chartData.balancoMensal} />
      <div className="grid gap-4 md:grid-cols-2">
        <ComposicaoDemandaChart data={chartData.composicaoDemanda} />
        <OfertaDemandaChart data={chartData.ofertaDemanda} />
      </div>
    </div>
  );
}
