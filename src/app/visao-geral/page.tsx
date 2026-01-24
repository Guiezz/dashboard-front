"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";
import { IdentificationData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Info, MapPin, Loader2 } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";
import { EmptyReservoirState } from "@/components/dashboard/EmptyReservoirState";
import Image from "next/image";

export default function VisaoGeralPage() {
  const { selectedReservoir } = useReservoir();

  const [data, setData] = useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se não houver reservatório selecionado, paramos o loading e não fazemos o fetch
    if (!selectedReservoir) {
      setIsLoading(false);
      return;
    }

    const getIdentificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${config.apiBaseUrl}/reservatorios/${selectedReservoir.id}/identification`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("Falha ao buscar dados de identificação");

        const fetchedData: IdentificationData = await res.json();
        setData(fetchedData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    getIdentificationData();
  }, [selectedReservoir]);

  // 1. ESTADO: NADA SELECIONADO (Usando o componente reutilizável)
  if (!selectedReservoir) {
    return <EmptyReservoirState />;
  }

  // 2. ESTADO: CARREGANDO (Após selecionar um item)
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando dados do reservatório...
          </p>
        </div>
      </main>
    );
  }

  // 3. ESTADO: ERRO NA API
  if (error || !data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center p-6 bg-card border rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold text-destructive mb-2">
            Erro ao carregar os dados
          </h1>
          <p>
            {error || "Verifique se a API está em execução e tente novamente."}
          </p>
        </div>
      </main>
    );
  }

  // 4. ESTADO: SUCESSO (Renderização dos dados)
  const paragraphs = data.descricao.split("\n").filter((p) => p.trim() !== "");

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-8 bg-background">
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col text-center md:text-left flex-1">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
              Identificação do Hidrossistema: {data.nome}
            </CardTitle>
            <CardDescription className="mt-3 text-muted-foreground leading-relaxed text-justify">
              Dados gerais e localização do reservatório selecionado.
            </CardDescription>
          </div>
          <div className="relative h-24 w-48 md:h-28 md:w-56 flex-shrink-0">
            <Image
              src="/logos/hidrossistemas.png"
              alt="Logo Hidrossistemas"
              fill
              className="object-contain"
              priority
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="h-full flex flex-col border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Info className="h-5 w-5 text-muted-foreground" />
              Sobre o Reservatório
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base max-w-none text-justify flex-1">
            {paragraphs.map((paragraph, index) => (
              <p key={`p-${index}`} className="mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Vista do Reservatório
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {data.url_imagem ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={data.url_imagem}
                  alt={`Vista do reservatório ${data.nome}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Imagem não disponível.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Localização: {data.municipio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden border">
            <IdentificationMapWrapper lat={data.lat} lon={data.long} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
