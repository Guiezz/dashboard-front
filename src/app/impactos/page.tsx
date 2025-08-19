// src/app/impactos/page.tsx

"use client"; // 1. Converter para Client Component

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 2. Importar o hook do contexto
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { IdentificationData } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

export default function ImpactosPage() {
  // 3. Usar o contexto para obter o reservatório selecionado
  const { selectedReservoir } = useReservoir();

  // 4. Gerenciar o estado dos dados, carregamento e erro
  const [identificationData, setIdentificationData] = useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 5. Efeito que busca os dados quando o reservatório muda
  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }

    const getIdentificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/${selectedReservoir.id}/identification`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Falha ao buscar dados de identificação");
        setIdentificationData(await res.json());
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };

    getIdentificationData();
  }, [selectedReservoir]);

  // 6. Renderizar estados de carregamento e erro
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
        <main className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500">Erro ao carregar os dados.</h1>
                <p>{error}</p>
            </div>
        </main>
    );
  }

  // 7. Usar os dados do estado para preencher o texto dinâmico
  const nomeReservatorio = identificationData?.nome || "O Hidrossistema";
  const nomeMunicipio = identificationData?.municipio || "na região";

  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Impactos da Seca e Participação Social
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Coluna da Esquerda: Textos e Botão */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Formulário de Percepção de Impactos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                As perguntas formuladas neste questionário procuram obter
                informações sobre a percepção pessoal do impacto das secas no
                cotidiano individual, familiar e no trabalho dos participantes.
              </p>
              <p>
                A sua participação é de grande importância para podermos
                identificar e avaliar os impactos das secas em suas mais
                diversas dimensões.
              </p>
              <p className="font-semibold text-foreground">
                Conte a sua história adicionando fotográficas, textos e
                documentos que apresentem evidências dos impactos relatados.
                Esses registros serão fundamentais para a descrição adequada do
                impacto das secas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>O Contexto Local</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                O{" "}
                <span className="font-bold text-foreground">
                  {nomeReservatorio}
                </span>
                , no município de{" "}
                <span className="font-bold text-foreground">
                  {nomeMunicipio}
                </span>{" "}
                (CE), enfrenta desafios significativos durante períodos de seca
                prolongada, com impactos que afetam a provisão de água, a
                economia, o bem-estar social e o meio ambiente.
              </p>
              <p>
                A vulnerabilidade do sistema reflete a necessidade de políticas
                integradas que promovam a convivência sustentável com a seca,
                garantindo segurança hídrica e qualidade de vida para a
                população.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Gráfico e Botão */}
        <div className="flex flex-col items-center justify-center gap-8 p-4">
          <h2 className="text-xl font-semibold">Principais Impactos</h2>
          <div className="relative w-full h-full max-w-md aspect-square">
            <Image
              src="/infografico/infografico.png"
              alt="Infográfico dos Principais Impactos"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <Button size="lg" asChild className="mt-8 w-full max-w-xs">
            <Link
              href="https://cepas.ufc.br/pt_br/avaliacao-de-impacto-das-secas/"
              target="_blank"
            >
              Acesse o formulário aqui
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
