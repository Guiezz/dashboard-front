// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useReservoir } from "@/context/ReservoirContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Droplets,
  Scale,
  AlertTriangle,
  ListChecks,
  ArrowRight,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { ReservoirSelector } from "@/components/layout/ReservoirSelector";

export default function HomePage() {
  const { reservatorios, setSelectedReservoir } = useReservoir();

  return (
    <main className="flex flex-col gap-12 p-4 lg:p-8 bg-background animate-fade-in">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 py-4 md:py-5">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Sistema de Apoio à Decisão de Gestão de Secas em Hidrossistemas
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-justify">
            Uma plataforma integrada desenvolvida para o monitoramento,
            acompanhamento e divulgação das ações concebidas nos Planos de
            Gestão Proativa de Seca dos hidrossistemas do Ceará.
          </p>

          {/* Card do Seletor — ocupa toda a largura da coluna */}
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4 shadow-sm w-full">
            <div className="space-y-1">
              <Droplets className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                Qual hidrossistema você deseja analisar?
              </h3>
              <p className="text-sm font-semibold text-muted-foreground">
                Selecione o hidrossistema que deseja analisar para liberar os
                dados.
              </p>
              <p className="text-xs text-muted-foreground/80 italic">
                * O primeiro carregamento pode levar até 1 minuto para iniciar a
                base de dados.
              </p>
            </div>
            <div className="pt-2">
              <ReservoirSelector fullWidth />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
              <Link href="/visao-geral">
                Acessar Visão Geral
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto shadow-amber-600"
            >
              <Link href="/estado-de-seca">Ver Monitoramento</Link>
            </Button>
          </div>
        </div>

        {/* Lado Direito: Logos do Sistema e do Projeto */}
        <div className="flex-1 flex justify-center items-center w-full mt-8 md:mt-0">
          <div className="flex flex-col items-center justify-center gap-8 p-8 w-full max-w-sm">
            {/* Logo Nova (SADGS - Vertical) */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 transition-transform hover:scale-105 duration-300">
              <Image
                src="/logos/logo-sadgs.png"
                alt="Logo Sistema SADGS"
                fill
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="text-primary space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Funcionalidades do Sistema</h2>
          <p className="text-muted-foreground">
            Ferramentas essenciais para a governança hídrica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Activity className="h-8 w-8 text-primary" />}
            title="Monitoramento de Secas"
            description="Acompanhe a evolução do estado de seca (Hidrológica, Agrícola, etc.) com base em indicadores atualizados."
            href="/estado-de-seca"
          />
          <FeatureCard
            icon={<ListChecks className="h-8 w-8 text-primary" />}
            title="Planos de Ação"
            description="Consulte as ações estratégicas e emergenciais planejadas para mitigar os efeitos da escassez."
            href="/planos-de-acao"
          />
          <FeatureCard
            icon={<Scale className="h-8 w-8 text-primary" />}
            title="Balanço Hídrico"
            description="Visualize a relação entre oferta e demanda hídrica, simulações e cenários futuros."
            href="/balanco-hidrico"
          />
          <FeatureCard
            icon={<Waves className="h-8 w-8 text-primary" />}
            title="Simulador de Vazões"
            description="Realize simulações de balanço hídrico baseadas em séries históricas de vazão e evaporação (1911-2017)."
            href="/simulacao"
          />
          <FeatureCard
            icon={<AlertTriangle className="h-8 w-8 text-primary" />}
            title="Impactos"
            description="Entenda os impactos socioeconômicos e ambientais da seca na região."
            href="/impactos"
          />
          <FeatureCard
            icon={<Droplets className="h-8 w-8 text-primary" />}
            title="Usos da Água"
            description="Análise detalhada dos múltiplos usos da água e suas respectivas demandas."
            href="/usos-agua"
          />
          <FeatureCard
            icon={<ShieldCheck className="h-8 w-8 text-primary" />}
            title="Implementação"
            description="Acompanhe o status de implementação das medidas acordadas nos planos."
            href="/implementacao-planos-de-seca"
          />
        </div>
      </section>

      {/* Reservatórios Disponíveis */}
      <section className="space-y-8 py-8 border-t">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Hidrossistemas Monitorados</h2>
          <p className="text-muted-foreground">
            Atualmente, o sistema contempla os seguintes reservatórios:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reservatorios.map((res) => (
            <Card
              key={res.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedReservoir(res)}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Droplets className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{res.nome}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group-hover:border-primary/50">
        <CardHeader>
          <div className="mb-2">{icon}</div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
