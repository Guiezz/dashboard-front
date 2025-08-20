// src/app/responsaveis/page.tsx

"use client"; // 1. Converter para Client Component

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 2. Importar o hook do contexto
import { Responsavel } from "@/lib/types"; // 3. Usar o tipo global
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";
import { Parceiros } from "@/components/responsaveis/Parceiros";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

export default function ResponsaveisPage() {
  // 4. Usar o contexto para obter o reservatório selecionado
  const { selectedReservoir } = useReservoir();

  // 5. Gerenciar o estado dos dados, carregamento e erro
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 6. Efeito que busca os dados quando o reservatório muda
  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }

    const getResponsaveisData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/${selectedReservoir.id}/responsaveis`);
        if (!res.ok) {
          throw new Error(`A API respondeu com status: ${res.status}`);
        }
        setResponsaveis(await res.json());
      } catch (err) {
        console.error("Erro ao buscar dados dos responsáveis:", err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };

    getResponsaveisData();
  }, [selectedReservoir]);

  // 7. Renderizar estados de carregamento e erro
  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados dos responsáveis...</p>
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

  // A lógica de agrupar os responsáveis permanece a mesma
  const equipas: { [key: string]: string[] } = {};
  responsaveis.forEach((r) => {
    if (!equipas[r.equipa]) {
      equipas[r.equipa] = [];
    }
    equipas[r.equipa].push(r.nome);
  });

  const ordemDasEquipas = [
    "COORDENAÇÃO GERAL",
    "FUNCAP/UFC",
    "COGERH",
    "FUNCEME",
    "Equipe de Desenvolvimento do Sistema",
    "Equipe de Elaboração do Plano",
  ];

  return (
    <main className="p-4 md:p-8 lg:p-10 space-y-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Equipes e Responsáveis pelo Projeto
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {ordemDasEquipas.map((nomeEquipa) => {
          const membros = equipas[nomeEquipa];
          if (membros && membros.length > 0) {
            return (
              <Card key={nomeEquipa}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{nomeEquipa}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {membros.map((nomeMembro) => (
                      <li key={nomeMembro}>{nomeMembro}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          }
          // Opcional: Renderizar um card vazio se não houver membros para aquela equipe
          return (
             <Card key={nomeEquipa} className="border-dashed">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{nomeEquipa}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Nenhum responsável listado para este reservatório.</p>
                </CardContent>
              </Card>
          );
        })}
      </div>

      <div className="pt-4">
        <Parceiros />
      </div>
    </main>
  );
}
