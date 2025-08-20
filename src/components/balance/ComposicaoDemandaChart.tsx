"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ComposicaoDemanda } from "@/lib/types";

interface Props {
  data: ComposicaoDemanda[];
}

const COLORS = [
  "#60a5fa",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#f87171",
  "#facc15",
];

export function ComposicaoDemandaChart({ data }: Props) {
  const totalVazao = data.reduce((sum, item) => sum + item["Vazão (L/s)"], 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Composição da Demanda</CardTitle>
        <CardDescription>
          Percentual de uso da água por setor em condições de normalidade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="Vazão (L/s)"
                nameKey="Uso"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  (percent ?? 0) > 0.004
                    ? `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`
                    : ""
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} L/s`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderColor: "#e5e7eb",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
