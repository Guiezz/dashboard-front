"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { UsoAgua, IdentificationData } from "@/lib/types";
import { UsoAguaChart } from "@/components/usos/UsoAguaChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// CORREÇÃO: A URL base agora vem da variável de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function UsosAguaPage() {
  const { selectedReservoir } = useReservoir();

  const [chartData, setChartData] = useState<UsoAgua[]>([]);
  const [identificationData, setIdentificationData] =
    useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const id = selectedReservoir.id;
        // CORREÇÃO: As URLs são construídas dinamicamente com a base correta.
        const [usosRes, idRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/usos-agua`),
          fetch(`${API_BASE_URL}/api/reservatorios/${id}/identification`),
        ]);

        if (!usosRes.ok || !idRes.ok) {
          throw new Error(
            "Falha ao buscar os dados da página de Usos da Água."
          );
        }

        const usosData: UsoAgua[] = await usosRes.json();
        const idData: IdentificationData = await idRes.json();

        setChartData(usosData);
        setIdentificationData(idData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
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
          <p className="text-muted-foreground">
            Carregando dados de usos da água...
          </p>
        </div>
      </main>
    );
  }

  if (error || !chartData || !identificationData) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados da página.
          </h1>
          <p>{error || "Verifique o console para mais detalhes."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8 lg:p-10">
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">
          Análise de Uso da Água: {identificationData.nome}
        </h1>
      </div>

      <div>
        <div className="">
          <Card className="w-full shadow-lg mb-5">
            <CardHeader>
              <CardTitle className="text-lg">Diagrama de Usos</CardTitle>
              <CardDescription>
                Representação visual dos principais usos da água no
                hidrossistema {identificationData.nome}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {identificationData.url_imagem_usos ? (
                <div className="relative w-full h-[500px]"> {/* Altura fixa para consistência */}
                  <Image
                    src={identificationData.url_imagem_usos}
                    alt={`Diagrama de usos da água do açude ${identificationData.nome}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Imagem do diagrama de usos não encontrada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <UsoAguaChart data={chartData} />
      </div>
    </main>
  );
}
