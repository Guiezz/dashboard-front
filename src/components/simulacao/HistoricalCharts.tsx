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
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
} from "recharts";
import { formatDate } from "./helpers";
import { SimulacaoResultadoPonto } from "@/lib/types";

interface HistoricalChartsProps {
  data: SimulacaoResultadoPonto[];
}

export function HistoricalCharts({ data }: HistoricalChartsProps) {
  return (
    <div className="space-y-6">
      {/* GRÁFICO 1: Vazão Histórica */}
      <Card>
        <CardHeader>
          <CardTitle>Série Histórica de Vazão</CardTitle>
          <CardDescription>
            Histórico de entrada de água no reservatório (Vazão Afluente).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="data"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  minTickGap={45}
                />
                <YAxis
                  label={{
                    value: "Vazão (hm³)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#16a34a" },
                  }}
                  tick={{ fontSize: 12, fill: "#16a34a" }}
                />
                <Tooltip
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number) => [
                    `${value.toFixed(2)} hm³`,
                    "Vazão",
                  ]}
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />
                <Bar
                  dataKey="afluencia_hm3"
                  name="Vazão"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
                {/* Brush para navegar no tempo */}
                <Brush
                  dataKey="data"
                  height={30}
                  stroke="#16a34a"
                  tickFormatter={formatDate}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* GRÁFICO 2: Evaporação */}
      <Card>
        <CardHeader>
          <CardTitle>Série de Evaporação</CardTitle>
          <CardDescription>
            Volume perdido por evaporação mês a mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="data"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  minTickGap={45}
                />
                <YAxis
                  label={{
                    value: "Evaporação (hm³)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#ea580c" },
                  }}
                  tick={{ fontSize: 12, fill: "#ea580c" }}
                />
                <Tooltip
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value: number) => [
                    `${value.toFixed(2)} hm³`,
                    "Evaporação",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="evaporacao_hm3"
                  name="Evaporação"
                  fill="#ea580c"
                  stroke="#c2410c"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
