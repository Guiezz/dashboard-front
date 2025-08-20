"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { Responsavel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";
import { Parceiros } from "@/components/responsaveis/Parceiros";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

// Componente auxiliar para renderizar uma lista de membros
const MemberList = ({ members }: { members: string[] | undefined }) => {
  if (!members || members.length === 0) {
    return <p className="text-sm text-muted-foreground">-</p>;
  }
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      {members.map((nomeMembro) => (
        <li key={nomeMembro}>{nomeMembro}</li>
      ))}
    </ul>
  );
};

export default function ResponsaveisPage() {
  const { selectedReservoir } = useReservoir();
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }
    const getResponsaveisData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/${selectedReservoir.id}/responsaveis`
        );
        if (!res.ok) {
          throw new Error(`A API respondeu com status: ${res.status}`);
        }
        setResponsaveis(await res.json());
      } catch (err) {
        console.error("Erro ao buscar dados dos responsáveis:", err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
      } finally {
        setIsLoading(false);
      }
    };
    getResponsaveisData();
  }, [selectedReservoir]);

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">
            Carregando dados dos responsáveis...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  // A lógica de agrupar os responsáveis por equipe permanece a mesma
  const equipas: { [key: string]: string[] } = {};
  responsaveis.forEach((r) => {
    if (!equipas[r.equipa]) {
      equipas[r.equipa] = [];
    }
    equipas[r.equipa].push(r.nome);
  });

  return (
    <main className="p-4 md:p-8 lg:p-10 space-y-12">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Equipes e Responsáveis pelo Projeto
        </h1>
      </div>

      {/* 1. GRANDE CARD PARA A EQUIPE DO PROJETO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipe do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Usando grid para dividir em duas colunas em telas médias e maiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Coluna 1 */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  COORDENAÇÃO GERAL
                </h3>
                <MemberList members={equipas["COORDENAÇÃO GERAL"]} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">FUNCAP/UFC</h3>
                <MemberList members={equipas["FUNCAP/UFC"]} />
              </div>
            </div>
            {/* Coluna 2 */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm mb-2">COGERH</h3>
                <MemberList members={equipas["COGERH"]} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">FUNCEME</h3>
                <MemberList members={equipas["FUNCEME"]} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. CARD PARA A EQUIPE DE DESENVOLVIMENTO */}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Equipe de Desenvolvimento do Sistema de Apoio à Decisão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList
            members={equipas["Equipe de Desenvolvimento do Sistema"]}
          />
        </CardContent>
      </Card>

      {/* 2. SEÇÃO DE FINANCIAMENTO E REALIZAÇÃO */}
      <div className="space-y-4">
        <Parceiros />
      </div>
    </main>
  );
}
