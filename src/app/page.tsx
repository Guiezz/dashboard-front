"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { IdentificationData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, Loader2 } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";
import Image from "next/image";

// CORREÇÃO: A URL base agora vem da variável de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function IdentificationPage() {
  const { selectedReservoir } = useReservoir();

  const [data, setData] = useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }

    const getIdentificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // CORREÇÃO: A URL é construída dinamicamente com a base correta.
        const res = await fetch(`${API_BASE_URL}/api/reservatorios/${selectedReservoir.id}/identification`, {
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
  }, [selectedReservoir]);

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

  const paragraphs = data.descricao.split("\n").filter((p) => p.trim() !== "");
  
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-6">
      <h1 className="text-lg font-semibold md:text-2xl mb-2">
        Identificação: {data.nome}
      </h1>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização: {data.municipio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <IdentificationMapWrapper lat={data.lat} lon={data.long} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
