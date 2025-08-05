// src/components/dashboard/PaginatedTableAcoes.tsx
"use client";

import { PaginatedTableCard } from "./PaginatedTableCard";
import { OngoingAction } from "@/lib/types";
import { ListChecks } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // 1. Importamos o Badge

interface Props {
  data: OngoingAction[];
}

export function PaginatedTableAcoes({ data }: Props) {
  return (
    <PaginatedTableCard<OngoingAction>
      icon={<ListChecks className="h-5 w-5 text-primary" />}
      title="Ações em Andamento"
      data={data}
      headers={["Ação", "Responsáveis", "Situação"]}
      renderRow={(action, index) => (
        <TableRow key={index}>
          <TableCell className="font-medium whitespace-normal break-all align-top py-4">{action['AÇÕES']}</TableCell>
          <TableCell className="whitespace-normal break-all align-top py-4">{action['RESPONSÁVEIS']}</TableCell>
          <TableCell className="whitespace-normal break-all align-top py-4">
            <Badge variant="outline">{action['SITUAÇÃO']}</Badge>
          </TableCell>
        </TableRow>
      )}
    />
  );
}
