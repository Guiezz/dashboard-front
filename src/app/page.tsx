// src/app/page.tsx
import { IdentificationData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";
import Image from "next/image"; // Importamos o componente de imagem otimizado

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

  const paragraphs = data.descricao.split("\n").filter((p) => p.trim() !== "");
  const middleIndex = Math.ceil(paragraphs.length / 2);
  const firstHalf = paragraphs.slice(0, middleIndex);
  const secondHalf = paragraphs.slice(middleIndex);

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl mb-2">
        Identificação do Reservatório
      </h1>

      {/* MAPA GRANDE */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <IdentificationMapWrapper lat={data.lat} lon={data.long} />
          </div>
        </CardContent>
      </Card>

      {/* LINHA COM TEXTO E IMAGEM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Texto */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sobre o Hidrossistema Patu
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none text-justify flex-1">
            {firstHalf.map((paragraph, index) => (
              <p key={`first-${index}`}>{paragraph}</p>
            ))}
          </CardContent>
          {/*<CardContent className="prose max-w-none text-justify flex-1 pt-0">
            {secondHalf.map((paragraph, index) => (
              <p key={`second-${index}`}>{paragraph}</p>
            ))}
          </CardContent>*/}
        </Card>

        <Card className="h-full flex flex-col overflow-hidden">
          {data.url_imagem && (
            <div className="relative w-full aspect-video p-4 pt-0">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={data.url_imagem}
                  alt={`Vista do açude ${data.descricao.split(" ")[0]}`}
                  fill
                  className="object-fit"
                />
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
