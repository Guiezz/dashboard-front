// src/app/impactos/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Leaf, BarChart3, Users, AlertTriangle } from "lucide-react";
import { IdentificationData } from "@/lib/types";
import Link from "next/link";

// Função para buscar os dados de identificação (nome do reservatório e município)
async function getIdentificationData(): Promise<IdentificationData | null> {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/identification`, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar dados de identificação");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// O componente do "gráfico" visual de impactos
function ImpactCircle() {
  const impacts = [
    { name: "Provisão de Água", icon: <Droplets className="h-6 w-6" />, color: "text-blue-400" },
    { name: "Impactos Econômicos", icon: <BarChart3 className="h-6 w-6" />, color: "text-yellow-400" },
    { name: "Desafios Sociais", icon: <Users className="h-6 w-6" />, color: "text-red-400" },
    { name: "Consequências Ambientais", icon: <Leaf className="h-6 w-6" />, color: "text-green-400" },
  ];

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Círculo central */}
      <div className="absolute w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-primary" />
      </div>
      {/* Ícones em órbita */}
      {impacts.map((impact, index) => {
        const angle = (index / impacts.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * 96; // 96 é o raio da órbita
        const y = Math.sin(angle) * 96;
        return (
          <div
            key={impact.name}
            className="absolute flex flex-col items-center text-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <div className={`p-2 bg-background rounded-full ${impact.color}`}>
              {impact.icon}
            </div>
            <span className="text-xs mt-1 font-medium max-w-[80px]">{impact.name}</span>
          </div>
        );
      })}
    </div>
  );
}


export default async function ImpactosPage() {
  const identificationData = await getIdentificationData();
  
  // Nomes dinâmicos com valores padrão em caso de falha na API
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
                As perguntas formuladas neste questionário procuram obter informações sobre a percepção pessoal do impacto das secas no cotidiano individual, familiar e no trabalho dos participantes.
              </p>
              <p>
                A sua participação é de grande importância para podermos identificar e avaliar os impactos das secas em suas mais diversas dimensões.
              </p>
              <p className="font-semibold text-foreground">
                Conte a sua história adicionando fotográficas, textos e documentos que apresentem evidências dos impactos relatados. Esses registros serão fundamentais para a descrição adequada do impacto das secas.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle>O Contexto Local</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-muted-foreground">
                <p>
                    O <span className="font-bold text-foreground">{nomeReservatorio}</span>, no município de <span className="font-bold text-foreground">{nomeMunicipio}</span> (CE), enfrenta 
                    desafios significativos durante períodos de seca prolongada, com 
                    impactos que afetam a provisão de água, a economia, o bem-estar social e
                    o meio ambiente.
                </p>
                <p>
                    A vulnerabilidade do sistema reflete a necessidade de políticas 
                    integradas que promovam a convivência sustentável com a seca, garantindo
                    segurança hídrica e qualidade de vida para a população.
                </p>
             </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Gráfico e Botão */}
        <div className="flex flex-col items-center justify-center gap-8 p-4">
            <h2 className="text-xl font-semibold">Principais Impactos</h2>
            <ImpactCircle />
            <Button size="lg" asChild className="mt-8 w-full max-w-xs">
                <Link href="https://cepas.ufc.br/pt_br/avaliacao-de-impacto-das-secas/" target="_blank"> 
                    Acesse o formulário aqui
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
