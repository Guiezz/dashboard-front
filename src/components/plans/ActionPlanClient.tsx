// src/components/plans/ActionPlanClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Tipos para os dados (sem alteração)
type FilterOptions = {
  estados_de_seca: string[];
  tipos_de_impacto: string[];
  problemas: string[];
  acoes: string[];
};

type ActionPlan = {
  'DESCRIÇÃO DA AÇÃO': string;
  'CLASSES DE AÇÃO': string;
  'RESPONSÁVEIS': string;
};

interface ActionPlanClientProps {
  filterOptions: FilterOptions;
}

export default function ActionPlanClient({ filterOptions }: ActionPlanClientProps) {
  // Estados e lógica de fetch (sem alteração)
  const [estado, setEstado] = useState<string>("");
  const [impacto, setImpacto] = useState<string>("");
  const [problema, setProblema] = useState<string>("");
  const [acao, setAcao] = useState<string>("");
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (estado) params.append("estado", estado);
    if (impacto) params.append("impacto", impacto);
    if (problema) params.append("problema", problema);
    if (acao) params.append("acao", acao);
    return params.toString();
  }, [estado, impacto, problema, acao]);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      const API_BASE_URL = "http://localhost:8000";
      try {
        const res = await fetch(`${API_BASE_URL}/api/action-plans?${queryParams}`);
        if (!res.ok) {
          throw new Error(`API error: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
          setPlans([]);
        } else {
          setPlans(data);
        }
      } catch (error) {
        console.error("Erro ao buscar planos de ação:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [queryParams]);

  const handleResetFilters = () => {
    setEstado("");
    setImpacto("");
    setProblema("");
    setAcao("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Card de Filtros (sem alteração) */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Planos de Ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Estado de Seca" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.estados_de_seca.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={impacto} onValueChange={setImpacto}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Tipo de Impacto" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.tipos_de_impacto.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={problema} onValueChange={setProblema}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Problema" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.problemas.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.acoes.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <button onClick={handleResetFilters} className="lg:col-start-5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md">
              Limpar Filtros
            </button>
          </div>
        </CardContent>
      </Card>
      
      {/* --- INÍCIO DAS ALTERAÇÕES NA TABELA DE RESULTADOS --- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resultados</h2>
        {/* 1. Adicionamos 'overflow-x-auto' ao wrapper para garantir a responsividade em telas muito pequenas */}
        <div className="border rounded-lg overflow-x-auto">
          {/* 2. Adicionamos 'table-fixed' para que a tabela obedeça às larguras que definimos */}
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                {/* 3. Definimos larguras explícitas para cada coluna */}
                <TableHead className="w-[50%]">Descrição da Ação</TableHead>
                <TableHead className="w-[25%]">Classe da Ação</TableHead>
                <TableHead className="w-[25%]">Responsáveis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">A carregar...</TableCell></TableRow>
              ) : plans.length > 0 ? (
                plans.map((plan, index) => (
                  <TableRow key={index}>
                    {/* 4. Adicionamos classes para permitir a quebra de linha e o alinhamento ao topo */}
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan['DESCRIÇÃO DA AÇÃO']}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan['CLASSES DE AÇÃO']}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan['RESPONSÁVEIS']}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center">Nenhum resultado encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
