"use client";

import { ChartDataPoint } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";

interface VolumeChartProps {
  data: ChartDataPoint[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  // Pega um ponto válido para extrair os valores das metas
  const metas = data.find((p) => p.meta1 !== undefined && p.meta2 !== undefined && p.meta3 !== undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Volume (Hm³) comparado com Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e5e5" />
              <XAxis
                dataKey="Data"
                angle={-45}
                textAnchor="end"
                height={60}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return format(date, "d 'de' MMM.", { locale: ptBR });
                }}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={50}
                domain={[0, "auto"]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderColor: "#ccc" }}
                formatter={(value: number, name: string) => [`${value.toFixed(1)} Hm³`, name]}
                labelFormatter={(label) =>
                  `Data: ${format(new Date(label), "dd/MM/yyyy", { locale: ptBR })}`
                }
              />
              
              {/* Linhas horizontais fixas para as metas */}
              {metas && (
                <>
                  <ReferenceLine y={metas.meta1} stroke="#991b1b" strokeWidth={2} strokeDasharray="4 4" label={{ value: "Meta1", position: "insideRight", fill: "#991b1b", fontSize: 12 }} />
                  <ReferenceLine y={metas.meta2} stroke="#b45309" strokeWidth={2} strokeDasharray="4 4" label={{ value: "Meta2", position: "insideRight", fill: "#b45309", fontSize: 12 }} />
                  <ReferenceLine y={metas.meta3} stroke="#ca8a04" strokeWidth={2} strokeDasharray="4 4" label={{ value: "Meta3", position: "insideRight", fill: "#ca8a04", fontSize: 12 }} />
                </>
              )}

              {/* Linha do volume */}
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#3f1d0f"
                strokeWidth={3}
                dot={false}
                name="Volume (Hm³)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
