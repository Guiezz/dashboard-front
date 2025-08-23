"use client";

import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { Responsavel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building,
  Briefcase,
  Loader2,
  Frown,
  Award,
  Handshake,
} from "lucide-react";
import { Parceiros } from "@/components/responsaveis/Parceiros";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Tipo para a estrutura de dados agrupada
type GroupedData = {
  [grupo: string]: {
    [organizacao: string]: Responsavel[];
  };
};

// Componente MemberList (sem alterações, mas incluído para o contexto)
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

  // --- HIERARQUIA E ORDEM DEFINIDAS ---
  // Array para garantir a ordem de renderização dos cards principais (grupos)
  const grupoDisplayOrder: string[] = [
    "EQUIPE DO PROJETO",
    "Comitê da Bacia Hidrográfica da Região Metropolitana de Fortaleza",
    "COMISSÃO GESTORA DO AÇUDE ACARAPE DO MEIO",
    "SECRETARIA-EXECUTIVA",
    "OUTROS ATORES PARTICIPANTES (COGERH)",
    "Equipe de Desenvolvimento do Sistema de Apoio à Decisão", // Nome padrão vindo do BD
    "EQUIPE DE DESENVOLVIMENTO", // Nome que você usou no exemplo
  ];

  // Opcional: Para ordenar as organizações dentro de um grupo específico
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
        const res = await fetch(
          `${API_BASE_URL}/api/reservatorios/${selectedReservoir.id}/responsaveis`
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
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
        );
      } finally {
        setIsLoading(false);
      }
    };
    getResponsaveisData();
  }, [selectedReservoir]);

  // Os estados de Loading e Error permanecem os mesmos...
  if (isLoading) {
    /* ...código de loading... */
  }
  if (error) {
    /* ...código de erro... */
  }

  // --- LÓGICA DE ORDENAÇÃO PARA RENDERIZAÇÃO ---
  const sortedGrupos = Object.keys(groupedData).sort((a, b) => {
    const indexA = grupoDisplayOrder.indexOf(a);
    const indexB = grupoDisplayOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b); // Alfabética para não listados
    if (indexA === -1) return 1; // Não listados vão para o final
    if (indexB === -1) return -1; // Não listados vão para o final
    return indexA - indexB; // Ordena com base na lista
  });

  return (
    <main className="p-4 md:p-8 lg:p-10 space-y-12">
      {/* 1. EQUIPE DO PROJETO */}
      {sortedGrupos.map((grupo) => {
        const organizacoes = groupedData[grupo];
        const organizacaoOrderList = organizacaoOrder[grupo] || null;

        const sortedOrganizacoes = Object.keys(organizacoes).sort((a, b) => {
          if (!organizacaoOrderList) return a.localeCompare(b); // Ordem alfabética padrão
          const indexA = organizacaoOrderList.indexOf(a);
          const indexB = organizacaoOrderList.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        // Adiciona um número ao título se o grupo for um dos principais
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

      {/* 3. EQUIPE DE DESENVOLVIMENTO (Exemplo de como tratar um grupo específico) */}
      {/* Este grupo já é renderizado pelo loop acima, mas você poderia dar um tratamento especial se quisesse */}

      {/* 4. FINANCIAMENTO E REALIZAÇÃO */}
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
