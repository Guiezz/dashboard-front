"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { IdentificationData } from "@/lib/types";
import { EmptyReservoirState } from "@/components/dashboard/EmptyReservoirState";
import Image from "next/image";
import Link from "next/link";

export default function ImpactosPage() {
  const { selectedReservoir } = useReservoir();

  const [identificationData, setIdentificationData] =
    useState<IdentificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se não houver reservatório, paramos o loading para exibir o EmptyState
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

        const data = await res.json();
        setIdentificationData(data);
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

  // 1. ESTADO: NADA SELECIONADO
  if (!selectedReservoir) {
    return (
      <EmptyReservoirState
        title="Impactos da Seca Indisponíveis"
        description="Por favor, selecione um hidrossistema no topo da página para visualizar o contexto local e acessar o formulário de percepção de impactos."
      />
    );
  }

  // 2. ESTADO: CARREGANDO
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando dados de impacto...
          </p>
        </div>
      </main>
    );
  }

  // 3. ESTADO: ERRO
  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center p-6 bg-card border rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold text-destructive mb-2">
            Erro ao carregar os dados.
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  const nomeReservatorio = identificationData?.nome || "O Hidrossistema";
  const nomeMunicipio = identificationData?.municipio || "na região";

  // 4. ESTADO: SUCESSO
  return (
    <main className="flex flex-1 flex-col gap-8 p-4 lg:p-8 bg-background">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl text-foreground">
          Impactos da Seca e Participação Social
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Coluna da Esquerda: Textos e Botão */}
        <div className="flex flex-col gap-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Formulário de Percepção de Impactos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Este formulário tem o objetivo de obter informações sobre a
                percepção pessoal do impacto das secas no cotidiano individual,
                familiar e no trabalho dos participantes.
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

          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader>
              <CardTitle>O Contexto Local</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
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
        <div className="flex flex-col items-center justify-center gap-8 p-4 bg-card rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">
            Principais Impactos
          </h2>
          <div className="relative w-full h-full max-w-md aspect-square">
            <Image
              src="/infografico/infografico.png"
              alt="Infográfico dos Principais Impactos"
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <Button size="lg" asChild className="mt-8 w-full max-w-xs shadow-md">
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
