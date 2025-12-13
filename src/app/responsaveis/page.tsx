"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config"; // <--- Import config
import { Responsavel } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Parceiros } from "@/components/responsaveis/Parceiros";

// Tipo para a estrutura de dados agrupada
type GroupedData = {
  [grupo: string]: {
    [organizacao: string]: Responsavel[];
  };
};

const MemberList = ({ members }: { members: Responsavel[] | undefined }) => {
  if (!members || members.length === 0) {
    return <p className="text-sm text-muted-foreground">-</p>;
  }
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      {members.map((membro) => (
        <li key={membro.nome}>
          {membro.nome}
          {membro.cargo && (
            <span className="ml-2 text-xs text-gray-500">({membro.cargo})</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default function ResponsaveisPage() {
  const { selectedReservoir } = useReservoir();
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const grupoDisplayOrder: string[] = [
    "EQUIPE DO PROJETO",
    "Comitê da Bacia Hidrográfica da Região Metropolitana de Fortaleza",
    "COMISSÃO GESTORA DO AÇUDE ACARAPE DO MEIO",
    "SECRETARIA-EXECUTIVA",
    "OUTROS ATORES PARTICIPANTES (COGERH)",
    "Equipe de Desenvolvimento do Sistema de Apoio à Decisão",
    "EQUIPE DE DESENVOLVIMENTO",
  ];

  const organizacaoOrder: { [key: string]: string[] } = {
    "EQUIPE DO PROJETO": [
      "COORDENAÇÃO GERAL",
      "COORDENAÇÃO DAS EQUIPES DE ELABORAÇÃO",
      "COGERH",
      "FUNCEME",
      "EQUIPE DE ELABORAÇÃO",
      "COMUNICAÇÃO VISUAL",
    ],
  };

  useEffect(() => {
    if (!selectedReservoir) {
      setIsLoading(true);
      return;
    }
    const getResponsaveisData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // CORREÇÃO: Usando config.apiBaseUrl. Rota: /reservatorios/{id}/responsibles (confirmado no routes.go)
        const res = await fetch(
          `${config.apiBaseUrl}/reservatorios/${selectedReservoir.id}/responsibles`,
        );
        if (!res.ok)
          throw new Error(`A API respondeu com status: ${res.status}`);

        const data: Responsavel[] = await res.json();

        const grouped = data.reduce<GroupedData>((acc, responsavel) => {
          const grupo = responsavel.grupo || "Outros Grupos";
          const organizacao = responsavel.organizacao || "Geral";
          if (!acc[grupo]) acc[grupo] = {};
          if (!acc[grupo][organizacao]) acc[grupo][organizacao] = [];
          acc[grupo][organizacao].push(responsavel);
          return acc;
        }, {});

        setGroupedData(grouped);
      } catch (err) {
        console.error("Erro ao buscar dados dos responsáveis:", err);
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    getResponsaveisData();
  }, [selectedReservoir]);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando responsáveis...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">Erro: {error}</div>;
  }

  const sortedGrupos = Object.keys(groupedData).sort((a, b) => {
    const indexA = grupoDisplayOrder.indexOf(a);
    const indexB = grupoDisplayOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <main className="p-4 md:p-8 lg:p-10 space-y-12">
      {sortedGrupos.map((grupo) => {
        const organizacoes = groupedData[grupo];
        const organizacaoOrderList = organizacaoOrder[grupo] || null;

        const sortedOrganizacoes = Object.keys(organizacoes).sort((a, b) => {
          if (!organizacaoOrderList) return a.localeCompare(b);
          const indexA = organizacaoOrderList.indexOf(a);
          const indexB = organizacaoOrderList.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        const numeroTitulo = grupoDisplayOrder.indexOf(grupo) + 1;
        const titulo =
          numeroTitulo > 0 && numeroTitulo < 3
            ? `${numeroTitulo}. ${grupo}`
            : grupo;

        return (
          <div key={grupo}>
            <h2 className="text-lg font-semibold md:text-2xl mb-4">{titulo}</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {sortedOrganizacoes.map((organizacao) => (
                    <div key={organizacao}>
                      <h3 className="font-semibold text-sm mb-2 uppercase">
                        {organizacao}
                      </h3>
                      <MemberList members={organizacoes[organizacao]} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      <div>
        <h2 className="text-lg font-semibold md:text-2xl mb-4">
          4. Financiamento e Realização
        </h2>
        <Card>
          <CardContent className="pt-6">
            <Parceiros />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
