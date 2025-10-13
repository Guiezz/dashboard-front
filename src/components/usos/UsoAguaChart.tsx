// src/components/usos/UsoAguaChart.tsx
"use client";

import { UsoAgua } from "@/lib/types"; // 1. Importe o tipo unificado
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: UsoAgua[];
}

export function UsoAguaChart({ data }: Props) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Análise de Uso da Água</CardTitle>
        <CardDescription>
          Comparativo de vazão por setor em cenários de Normalidade vs. Escassez Hídrica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="uso" // A nossa categoria no eixo X
                fontSize={12}
                tick={{ fill: "#4B5563" }}
                interval={0} // Garante que todos os nomes apareçam
                angle={-25} // Inclina os nomes para caberem melhor
                textAnchor="end"
                height={80} // Aumenta a altura para dar espaço aos nomes inclinados
              />
              <YAxis
                label={{
                  value: "Vazão (L/s)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4B5563",
                  fontSize: 12,
                }}
                tick={{ fill: "#4B5563" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  borderColor: "#e5e7eb",
                  fontSize: 12,
                  borderRadius: 8,
                  color: "#111827",
                }}
                formatter={(value: number) => `${value.toFixed(2)} L/s`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="vazao_normal" // Corresponde à chave do JSON da API
                fill="var(--chart-1)" // Cor primária do gráfico
                name="Vazão Normal"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="vazao_escassez" // Corresponde à chave do JSON da API
                fill="var(--chart-2)" // Cor secundária do gráfico
                name="Vazão em Escassez"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
