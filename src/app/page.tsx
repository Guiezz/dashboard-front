// src/app/page.tsx
import { IdentificationData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";

async function getIdentificationData(): Promise<IdentificationData | null> {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/identification`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Falha ao buscar dados de identificação");
    }
    const data: IdentificationData = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function IdentificationPage() {
  const data = await getIdentificationData();

  if (!data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>
            Verifique se a API Python e o endpoint de identificação estão
            funcionando.
          </p>
        </div>
      </main>
    );
  }

  const location = data.location_data[0];

  return (
    // O layout principal agora é uma coluna flexível com um espaçamento maior
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Identificação do Reservatório
        </h1>
      </div>

      {/* 1. O MAPA FICA NO TOPO, OCUPANDO A LARGURA TOTAL */}
      <div className="w-full">
        <IdentificationMapWrapper
          lat={location.lat}
          lon={location.lon}
        />
      </div>

      {/* 2. O TEXTO FICA EMBAIXO, CENTRALIZADO E COM LARGURA MÁXIMA */}
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sobre o Hidrossistema Patu
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-justify">
            {/* O texto é dividido por quebras de linha para melhor formatação */}
            {data.identification_text.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
