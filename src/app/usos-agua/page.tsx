// src/app/usos-agua/page.tsx

"use client"; // 1. Converter para Client Component

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 2. Importar o hook do contexto
import { UsoAgua, IdentificationData } from "@/lib/types"; // 3. Usar os tipos globais
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

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

// Nota: A API em /usos-agua retorna um schema que pode ser diferente do que o gráfico espera.
// Se necessário, você pode precisar transformar os dados aqui.
// Por enquanto, vamos assumir que o componente do gráfico aceita o tipo 'UsoAgua'.
// Se o seu componente 'UsoAguaChart' espera 'vazao_normal' e 'vazao_escassez',
// você deve ajustar o tipo 'UsoAgua' em lib/types.ts para incluir esses campos.

export default function UsosAguaPage() {
  // 4. Usar o contexto para obter o reservatório selecionado
  const { selectedReservoir } = useReservoir();

  // 5. Gerenciar o estado para os dois conjuntos de dados, carregamento e erro
  const [chartData, setChartData] = useState<UsoAgua[]>([]);
  const [identificationData, setIdentificationData] =
    useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 6. Efeito que busca ambos os dados em paralelo quando o reservatório muda
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
        // Busca os dois dados em paralelo para mais performance
        const [usosRes, idRes] = await Promise.all([
          fetch(`${API_BASE_URL}/${id}/usos-agua`),
          fetch(`${API_BASE_URL}/${id}/identification`),
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
  }, [selectedReservoir]); // A dependência garante a re-execução da busca

  // 7. Renderizar estado de carregamento
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

  // 8. Renderizar estado de erro
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

  // O JSX principal agora usa os dados do estado
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
                <div className="relative w-full h-120">
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
