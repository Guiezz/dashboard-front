// src/app/page.tsx

"use client"; // 1. Converter para Client Component para usar hooks

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 2. Importar o hook do nosso contexto
import { IdentificationData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, Loader2 } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";
import Image from "next/image";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

export default function IdentificationPage() {
  // 3. Usar o contexto para saber qual reservatório está selecionado
  const { selectedReservoir } = useReservoir();

  // 4. Gerenciar o estado dos dados, carregamento e erros para esta página
  const [data, setData] = useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Efeito que busca os dados sempre que o reservatório selecionado mudar
  useEffect(() => {
    if (!selectedReservoir) {
      // Se nenhum reservatório estiver selecionado ainda, apenas aguarde.
      setIsLoading(true);
      return;
    }

    const getIdentificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // A URL agora é dinâmica, usando o ID do reservatório selecionado
        const res = await fetch(`${API_BASE_URL}/${selectedReservoir.id}/identification`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Falha ao buscar dados de identificação");
        }
        const fetchedData: IdentificationData = await res.json();
        setData(fetchedData);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };

    getIdentificationData();
  }, [selectedReservoir]); // A dependência garante que esta função rode novamente se o reservatório mudar

  // 6. Renderizar estado de carregamento
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Carregando dados do reservatório...</p>
        </div>
      </main>
    );
  }

  // 7. Renderizar estado de erro
  if (error || !data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>{error || "Verifique se a API está em execução e tente novamente."}</p>
        </div>
      </main>
    );
  }

  // O resto do seu JSX permanece o mesmo, usando a variável de estado `data`
  const paragraphs = data.descricao.split("\n").filter((p) => p.trim() !== "");
  
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl mb-2">
        Identificação: {data.nome} {/* Título dinâmico */}
      </h1>
      
      {/* MAPA GRANDE */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização: {data.municipio} {/* Localização dinâmica */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <IdentificationMapWrapper lat={data.lat} lon={data.long} />
          </div>
        </CardContent>
      </Card>

      {/* LINHA COM TEXTO E IMAGEM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Texto */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sobre o Reservatório
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none text-justify flex-1">
            {paragraphs.map((paragraph, index) => (
              <p key={`p-${index}`}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        {/* Imagem */}
        <Card className="h-full flex flex-col overflow-hidden">
          <CardHeader>
              <CardTitle>Vista do Reservatório</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {data.url_imagem ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={data.url_imagem}
                  alt={`Vista do reservatório ${data.nome}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
                <p className="text-muted-foreground">Imagem não disponível.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
