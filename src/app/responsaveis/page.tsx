// src/app/responsaveis/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
// 1. Precisamos de importar o componente Parceiros para o podermos usar
import { Parceiros } from "@/components/responsaveis/Parceiros"; 

// --- Interfaces de Dados ---
interface Responsavel {
  equipa: string;
  nome: string;
}

// --- Função para Buscar Dados da API (continua igual) ---
async function getResponsaveisData(): Promise<Responsavel[] | null> {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/responsaveis", {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`A API respondeu com status: ${response.status}`);
    }
    return await response.json();
  } catch (err: any) {
    console.error("Erro ao buscar dados dos responsáveis:", err.message);
    return null;
  }
}

// --- Componente da Página (com a estrutura corrigida) ---
export default async function ResponsaveisPage() {
  const responsaveis = await getResponsaveisData();

  if (!responsaveis) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>Verifique o console para mais detalhes sobre o erro da API.</p>
        </div>
      </main>
    );
  }

  // Lógica para agrupar os responsáveis por equipa (continua igual)
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
    // Adicionado um 'space-y-8' para dar espaçamento entre os elementos
    <main className="p-4 md:p-8 lg:p-10 space-y-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Equipas e Responsáveis pelo Projeto
        </h1>
      </div>

      {/* Grelha com os cards das equipas */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {ordemDasEquipas.map((nomeEquipa) => {
          const membros = equipas[nomeEquipa];

          if (nomeEquipa === "Equipe de Elaboração do Plano" && (!membros || membros.length === 0)) {
            return (
              <Card key={nomeEquipa}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{nomeEquipa}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">-</p>
                </CardContent>
              </Card>
            )
          }

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
                {/* A chamada <Parceiros /> FOI REMOVIDA DAQUI */}
              </Card>
            );
          }
          return null;
        })}
      </div>

      {/* 2. O componente <Parceiros /> agora é chamado AQUI, depois da grelha de equipas */}
      <div className="pt-4">
        <Parceiros />
      </div>

    </main>
  );
}
