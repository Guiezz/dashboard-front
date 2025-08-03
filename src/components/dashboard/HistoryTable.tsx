// src/components/dashboard/HistoryTable.tsx
import { HistoryEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryTableProps {
  data: HistoryEntry[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Histórico de Seca e Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Estado de Seca</TableHead>
              <TableHead className="text-right">Volume (%)</TableHead>
              <TableHead className="text-right">Volume (Hm³)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.Data}</TableCell>
                <TableCell>{entry["Estado de Seca"]}</TableCell>
                <TableCell className="text-right">{entry["Volume (%)"]}</TableCell>
                <TableCell className="text-right">{entry["Volume (Hm³)"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
