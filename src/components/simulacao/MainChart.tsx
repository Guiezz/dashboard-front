"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Line,
} from "recharts";
import { formatDate } from "./helpers";
import { SimulacaoResultadoPonto } from "@/lib/types";

interface MainChartProps {
  data: SimulacaoResultadoPonto[];
}

export function MainChart({ data }: MainChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Simulação</CardTitle>
        <CardDescription>Volume e Afluência ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="data"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                minTickGap={30}
              />
              <YAxis
                yAxisId="vol"
                label={{
                  value: "Volume (hm³)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#2563eb" },
                }}
                tick={{ fontSize: 12, fill: "#2563eb" }}
              />
              <YAxis
                yAxisId="vazao"
                orientation="right"
                label={{
                  value: "Afluência (hm³)",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: "#16a34a" },
                }}
                tick={{ fontSize: 12, fill: "#16a34a" }}
              />
              <Tooltip
                labelFormatter={(label) => formatDate(label)}
                formatter={(value: number, name: string) => {
                  if (name === "Volume")
                    return [`${value.toFixed(2)} hm³`, name];
                  if (name === "Afluência")
                    return [`${value.toFixed(2)} hm³`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Area
                yAxisId="vol"
                type="monotone"
                dataKey="volume_hm3"
                name="Volume"
                fill="#3b82f6"
                stroke="#2563eb"
                fillOpacity={0.2}
              />
              <Line
                yAxisId="vazao"
                type="monotone"
                dataKey="afluencia_hm3"
                name="Afluência"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
