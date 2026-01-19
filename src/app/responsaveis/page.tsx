"use client";
import { useState, useEffect } from "react";
import { useReservoir } from "@/context/ReservoirContext";
import { config } from "@/config";
import { Responsavel } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Parceiros } from "@/components/responsaveis/Parceiros";
import { Users2, Building2 } from "lucide-react";

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
    <div className="space-y-3">
      {members.map((membro, idx) => (
        <div
          key={`${membro.nome}-${idx}`}
          className="flex flex-col border-l-2 border-primary/20 pl-3 py-1 transition-colors hover:border-primary"
        >
          <span className="text-sm font-medium text-foreground">
            {membro.nome}
          </span>
          {membro.cargo && (
            <span className="text-xs text-muted-foreground italic">
              {membro.cargo}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default function ResponsaveisPage() {
  const { selectedReservoir } = useReservoir();
  const [groupedData, setGroupedData] = useState<GroupedData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ordem de exibição dos grupos conforme solicitado
  const grupoDisplayOrder: string[] = [
    "Créditos Institucionais",
    "Comitê da Bacia Hidrográfica da Região Metropolitana de Fortaleza",
    "Comitê da Sub-Bacia Hidrográfica do Alto Jaguaribe",
    "Comitê da Bacia Hidrográfica do Salgado",
    "COMITÊ DA BACIA HIDROGRÁFICA DOS SERTÕES DE CRATEÚS",
    "Comitê da Sub-Bacia Hidrográfica Acaraú",
    "COMITÊ DA BACIA HIDROGRÁFICA DA SERRA DA IBIAPABA",
    "COMISSÃO GESTORA DO AÇUDE ACARAPE DO MEIO",
    "COMITÊ DA BACIA HIDROGRÁFICA DO LITORAL",
    "COMISSÃO GESTORA DO AÇUDE MISSI",
    "Comitê da Sub-Bacia Hidrográfica do Rio Banabuiú",
    "SECRETARIA-EXECUTIVA",
    "OUTROS ATORES PARTICIPANTES DA ELABORAÇÃO DO PLANO",
    "Equipe de Desenvolvimento do Sistema de Apoio à Decisão",
    "Equipe de Execução",
  ];

  const organizacaoOrder: { [key: string]: string[] } = {
    "Créditos Institucionais": [
      "GOVERNADOR DO ESTADO DO CEARÁ",
      "SECRETARIA DOS RECURSOS HÍDRICOS – SRH",
      "COMPANHIA DE GESTÃO DOS RECURSOS HÍDRICOS – COGERH",
      "Fundação Cearense de Meteorologia e Recursos Hídricos",
    ],
    "Equipe de Execução": [
      "COORDENAÇÃO GERAL",
      "COORDENAÇÃO DAS EQUIPES DE ELABORAÇÃO",
      "COGERH",
      "FUNCEME",
      "EQUIPE DE ELABORAÇÃO",
      "COMUNICAÇÃO VISUAL – CEPAS/UFC/FUNCAP",
    ],
    "EQUIPE DE EXECUÇÃO": [
      "COORDENAÇÃO GERAL",
      "COORDENAÇÃO DAS EQUIPES DE ELABORAÇÃO",
      "COGERH",
      "FUNCEME",
      "EQUIPE DE ELABORAÇÃO",
      "COMUNICAÇÃO VISUAL – CEPAS/UFC/FUNCAP",
    ],

    "Equipe de Projeto": [
      "COORDENAÇÃO GERAL",
      "FUNCAP/UFC",
      "COGERH",
      "FUNCEME",
      "EQUIPE DE ELABORAÇÃO",
      "COMUNICAÇÃO VISUAL – CEPAS/UFC/FUNCAP",
    ],
    "EQUIPE DO PROJETO": [
      "COORDENAÇÃO GERAL",
      "FUNCAP/UFC",
      "COGERH",
      "FUNCEME",
      "EQUIPE DE ELABORAÇÃO",
      "COMUNICAÇÃO VISUAL – CEPAS/UFC/FUNCAP",
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
          `${config.apiBaseUrl}/reservatorios/${selectedReservoir.id}/responsibles`,
        );
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data: Responsavel[] = await res.json();

        const grouped = data.reduce<GroupedData>((acc, responsavel) => {
          const grupo = responsavel.grupo || "Outros Grupos";

          // LÓGICA CORRIGIDA: Para Comissões Gestoras, usamos APENAS o SETOR como chave
          let orgChave: string;

          // Verifica se o grupo OU a organização contém "COMISSÃO GESTORA"
          const isComissaoGestora =
            grupo.toUpperCase().includes("COMISSÃO GESTORA") ||
            (responsavel.organizacao &&
              responsavel.organizacao
                .toUpperCase()
                .includes("COMISSÃO GESTORA"));

          if (isComissaoGestora && responsavel.setor) {
            // Para comissões gestoras: usa o setor como chave principal
            orgChave = responsavel.setor;
          } else {
            // Para outros grupos: usa a organização normalmente
            orgChave = responsavel.organizacao || "Geral";
          }

          if (!acc[grupo]) acc[grupo] = {};
          if (!acc[grupo][orgChave]) acc[grupo][orgChave] = [];
          acc[grupo][orgChave].push(responsavel);
          return acc;
        }, {});

        setGroupedData(grouped);
      } catch (err) {
        console.error("Erro ao buscar responsáveis:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    getResponsaveisData();
  }, [selectedReservoir]);

  if (isLoading)
    return (
      <div className="p-12 text-center animate-pulse">
        Carregando estrutura de responsáveis...
      </div>
    );
  if (error)
    return (
      <div className="p-12 text-center text-destructive">Erro: {error}</div>
    );

  const sortedGrupos = Object.keys(groupedData).sort((a, b) => {
    const indexA = grupoDisplayOrder.indexOf(a);
    const indexB = grupoDisplayOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-10 max-w-7xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Responsáveis e Créditos
        </h1>
        <p className="text-muted-foreground">
          Estrutura institucional e equipe técnica envolvida na gestão do{" "}
          {selectedReservoir?.nome}.
        </p>
      </div>

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

        // Verifica se é uma comissão gestora para ajustar a exibição
        const isComissaoGestora = grupo
          .toUpperCase()
          .includes("COMISSÃO GESTORA");

        return (
          <section key={grupo} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Users2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold uppercase tracking-wide">
                {grupo}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedOrganizacoes.map((orgChave) => {
                const membros = organizacoes[orgChave];
                const primeiroMembro = membros[0];

                // Define o título e badge baseado no tipo
                let tituloCard = orgChave;
                let badgeTexto = null;

                if (isComissaoGestora) {
                  // Para comissões gestoras: o título é o setor
                  tituloCard = orgChave; // já é o setor
                  // Não mostra badge da organização pois é repetitiva
                } else if (
                  primeiroMembro?.setor &&
                  primeiroMembro.setor !== orgChave
                ) {
                  // Para outros casos: mostra o setor como badge se existir
                  badgeTexto = primeiroMembro.setor;
                }

                return (
                  <Card
                    key={orgChave}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="bg-muted/30 pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {tituloCard}
                          </CardTitle>
                          {badgeTexto && (
                            <Badge
                              variant="secondary"
                              className="font-normal text-[10px] py-0"
                            >
                              {badgeTexto}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <MemberList members={membros} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-center md:text-left">
          Financiamento e Realização
        </h2>
        <Card className="border-none shadow-none bg-muted/20">
          <CardContent className="pt-6">
            <Parceiros />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
