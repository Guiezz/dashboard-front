"use client";

import { useState, useEffect, useMemo } from "react";
import { useReservoir } from "@/context/ReservoirContext"; // 1. Importar o hook do contexto
import { ActionPlan, ActionPlanFilterOptions } from "@/lib/types"; // 2. Usar tipos globais
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
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/reservatorios";

// 3. Removemos a interface de props, pois o componente buscará seus próprios dados
export default function ActionPlanClient() {
  // 4. Usar o contexto para obter o reservatório selecionado
  const { selectedReservoir } = useReservoir();

  // 5. O estado dos filtros agora é gerenciado aqui, começando como nulo
  const [filterOptions, setFilterOptions] =
    useState<ActionPlanFilterOptions | null>(null);

  const [estado, setEstado] = useState<string>("");
  const [impacto, setImpacto] = useState<string>("");
  const [problema, setProblema] = useState<string>("");
  const [acao, setAcao] = useState<string>("");
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersLoading, setIsFiltersLoading] = useState(true);

  // 6. Novo useEffect para buscar as OPÇÕES DE FILTRO quando o reservatório mudar
  useEffect(() => {
    if (!selectedReservoir) return;

    const fetchFilters = async () => {
      setIsFiltersLoading(true);
      // Reseta os filtros e resultados ao trocar de reservatório
      handleResetFilters();
      setPlans([]);

      try {
        const res = await fetch(
          `${API_BASE_URL}/${selectedReservoir.id}/action-plans/filters`
        );
        if (!res.ok) throw new Error("Falha ao buscar opções de filtro");
        const data: ActionPlanFilterOptions = await res.json();
        setFilterOptions(data);
      } catch (error) {
        console.error("Erro ao buscar filtros:", error);
        setFilterOptions(null); // Em caso de erro, definimos como nulo
      } finally {
        setIsFiltersLoading(false);
      }
    };

    fetchFilters();
  }, [selectedReservoir]);

  // Lógica para construir query (sem alteração)
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (estado) params.append("estado", estado);
    if (impacto) params.append("impacto", impacto);
    if (problema) params.append("problema", problema);
    if (acao) params.append("acao", acao);
    return params.toString();
  }, [estado, impacto, problema, acao]);

  // 7. useEffect para buscar os PLANOS DE AÇÃO (agora depende também do reservatório)
  useEffect(() => {
    if (!selectedReservoir) return;

    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/${selectedReservoir.id}/action-plans?${queryParams}`
        );
        if (!res.ok) throw new Error(`API error: ${res.statusText}`);

        // --- ADICIONE ESTA LINHA DE DEPURAÇÃO ---
        const data = await res.json();
        console.log("DADOS RECEBIDOS PELA API:", data);
        // -----------------------------------------

        setPlans(data); // A linha original permanece
      } catch (error) {
        console.error("Erro ao buscar planos de ação:", error);
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [queryParams, selectedReservoir]); // Depende da query E do reservatório

  const handleResetFilters = () => {
    setEstado("");
    setImpacto("");
    setProblema("");
    setAcao("");
  };

  // 8. Renderiza um estado de carregamento principal enquanto os filtros não chegam
  if (isFiltersLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Carregando filtros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtrar Planos de Ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Verifique se todos os 'onValueChange' estão com 'C' maiúsculo */}
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-full truncate">
                {" "}
                <SelectValue placeholder="Estado de Seca" />
              </SelectTrigger>
              <SelectContent>
                {/* Altere de .estados para .estados_de_seca */}
                {filterOptions?.estados &&
                  filterOptions.estados.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={impacto} onValueChange={setImpacto}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Tipo de Impacto" />
              </SelectTrigger>
              <SelectContent>
                {/* Altere de .impactos para .tipos_de_impacto */}
                {filterOptions?.impactos &&
                  filterOptions.impactos.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select value={problema} onValueChange={setProblema}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Problema" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions?.problemas &&
                  filterOptions.problemas.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {/* --- LINHA CORRIGIDA AQUI --- */}
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Ação" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions?.acoes &&
                  filterOptions.acoes.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleResetFilters}
              className="lg:col-start-5 bg-muted text-muted-foreground hover:bg-muted/80 rounded-md text-sm"
            >
              Limpar Filtros
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resultados (sem alteração na estrutura) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Resultados</h2>
        <div className="border rounded-lg overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Descrição da Ação</TableHead>
                <TableHead className="w-[25%]">Classe da Ação</TableHead>
                <TableHead className="w-[25%]">Responsáveis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : plans.length > 0 ? (
                plans.map((plan, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan["DESCRIÇÃO DA AÇÃO"]}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan["CLASSES DE AÇÃO"]}
                    </TableCell>
                    <TableCell className="whitespace-normal break-words align-top py-4">
                      {plan["RESPONSÁVEIS"]}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
