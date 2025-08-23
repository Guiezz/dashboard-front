// src/components/dashboard/PaginatedTableMedidas.tsx
"use client";

import { PaginatedTableCard } from "./PaginatedTableCard";
import { MedidaRecomendada } from "@/lib/types";
import { ShieldCheck } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface Props {
  data: MedidaRecomendada[];
  estado: string;
}

export function PaginatedTableMedidas({ data, estado }: Props) {
  return (
    <PaginatedTableCard<MedidaRecomendada>
      icon={<ShieldCheck className="h-5 w-5 text-primary" />}
      title={`Medidas Recomendadas para ${estado}`}
      data={data}
      headers={["Ação", "Descrição"]}
      renderRow={(medida, index) => (
        <TableRow key={index}>
          <TableCell className="font-medium whitespace-normal break-all align-top py-4">{medida.Ação}</TableCell>
          <TableCell className="whitespace-normal break-all align-top py-4">{medida.Descrição}</TableCell>
        </TableRow>
      )}
    />
  );
}
