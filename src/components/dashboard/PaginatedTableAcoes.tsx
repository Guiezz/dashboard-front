// src/components/dashboard/PaginatedTableAcoes.tsx
"use client";

import { PaginatedTableCard } from "./PaginatedTableCard";
import { PlanoAcao } from "@/lib/types";
import { ListChecks } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // 1. Importamos o Badge

interface Props {
  data: PlanoAcao[];
}

export function PaginatedTableAcoes({ data }: Props) {
  return (
    <PaginatedTableCard<PlanoAcao>
      icon={<ListChecks className="h-5 w-5 text-primary" />}
      title="Ações em Andamento"
      data={data}
      headers={["Ação", "Responsáveis", "Situação"]}
      renderRow={(action, index) => (
        <TableRow key={index}>
          <TableCell className="font-medium whitespace-normal break-all align-top py-4">
            {action.acoes}
          </TableCell>
          <TableCell className="whitespace-normal break-all align-top py-4">
            {action.responsaveis}
          </TableCell>
          <TableCell className="whitespace-normal break-all align-top py-4">
            <Badge variant="outline">{action.situacao}</Badge>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
