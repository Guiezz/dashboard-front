"use client";

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

interface BalancoMensalData {
  Mês: string;
  "Afluência (m³/s)": number;
  "Evaporação (m³/s)": number;
  "Demanda (m³/s)": number;
}

interface Props {
  data: BalancoMensalData[];
}

export function BalancoHidricoChart({ data }: Props) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Afluência Mensal</CardTitle>
        <CardDescription>
          Vazão de água mensal que chega ao reservatório em determinado mês.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Mês" fontSize={12} tick={{ fill: "#4B5563" }} />
              <YAxis
                label={{
                  value: "m³/s",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#4B5563",
                  fontSize: 12,
                }}
                tick={{ fill: "#4B5563" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(225,225, 225, 1)",
                  borderColor: "#e5e7eb",
                  fontSize: 12,
                  borderRadius: 8,
                  color: "#111827",
                }}
                formatter={(value: number) => `${value.toFixed(2)} m³/s`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="Afluência (m³/s)"
                stackId="a"
                fill="#60a5fa"
                name="Afluência (Entrada)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
