// src/app/usos-agua/page.tsx

import { UsoAguaChart } from "@/components/usos/UsoAguaChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image"; // Usamos o componente otimizado de imagem do Next.js

// --- Interfaces de Dados ---
interface UsoAguaData {
  uso: string;
  vazao_normal: number;
  vazao_escassez: number;
}

interface IdentificationData {
  descricao: string;
  lat: number;
  long: number;
  url_imagem: string | null;
  url_imagem_usos: string | null;
}

// --- Funções para Buscar Dados da API ---

// Função 1: Busca os dados para o gráfico
async function getUsosAguaData(): Promise<UsoAguaData[] | null> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/usos-agua", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`API de Usos respondeu com status: ${response.status}`);
    return await response.json();
  } catch (err: any) {
    console.error("Erro ao buscar dados de usos da água:", err.message);
    return null;
  }
}

// Função 2: Busca os dados de identificação (para obter o link da imagem)
async function getIdentificationData(): Promise<IdentificationData | null> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/identification", {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`API de Identificação respondeu com status: ${response.status}`);
    return await response.json();
  } catch (err: any) {
    console.error("Erro ao buscar dados de identificação:", err.message);
    return null;
  }
}


// --- Componente da Página ---

export default async function UsosAguaPage() {
  // Usamos Promise.all para buscar os dois conjuntos de dados em paralelo
  const [chartData, identificationData] = await Promise.all([
    getUsosAguaData(),
    getIdentificationData(),
  ]);

  // Se qualquer uma das buscas falhar, mostramos uma mensagem de erro
  if (!chartData || !identificationData) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados da página.
          </h1>
          <p>Verifique o terminal para mais detalhes sobre o erro da API.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8 lg:p-10">
      <div className="flex items-center mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">
          Análise de Uso da Água
        </h1>
      </div>
      
      {/* Grid para organizar o conteúdo lado a lado em telas maiores */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Coluna do Gráfico (ocupando 3/5 do espaço) */}
        <div className="lg:col-span-3">
          <UsoAguaChart data={chartData} />
        </div>

        {/* Coluna da Imagem e Descrição (ocupando 2/5 do espaço) */}
        <div className="lg:col-span-2">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Diagrama de Usos</CardTitle>
              <CardDescription>
                Representação visual dos principais usos da água no hidrossistema Patu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {identificationData.url_imagem_usos ? (
                <div className="relative w-full h-96">
                  <Image
                    src={identificationData.url_imagem_usos}
                    alt="Diagrama de usos da água do açude Patu"
                    layout="fill"
                    objectFit="contain" // Garante que a imagem caiba sem distorcer
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
      </div>
    </main>
  );
}
