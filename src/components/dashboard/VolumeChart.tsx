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
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface VolumeChartProps {
  data: ChartDataPoint[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  // Converte as metas para a escala de porcentagem (0-100)
  // O volume permanece na sua escala original (Hm³)
  const chartData = data.map(point => ({
    ...point,
    meta1: point.meta1 * 100,
    meta2: point.meta2 * 100,
    meta3: point.meta3 * 100,
  }));

  // Tooltip customizado para mostrar ambas as unidades
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="font-bold text-gray-800">{`Data: ${format(new Date(label), "dd/MM/yyyy", { locale: ptBR })}`}</p>
          <p style={{ color: '#3f1d0f' }}>{`Volume: ${dataPoint.volume.toFixed(2)} Hm³`}</p>
          <p style={{ color: '#991b1b' }}>{`Meta 1: ${dataPoint.meta1.toFixed(1)}%`}</p>
          <p style={{ color: '#b45309' }}>{`Meta 2: ${dataPoint.meta2.toFixed(1)}%`}</p>
          <p style={{ color: '#ca8a04' }}>{`Meta 3: ${dataPoint.meta3.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Volume (Hm³) comparado com Metas</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e5e5" />
              <XAxis
                dataKey="Data"
                angle={-45}
                textAnchor="end"
                height={60}
                tickFormatter={(str) => {
                  try {
                    const date = new Date(str);
                    return format(date, "d 'de' MMM.", { locale: ptBR });
                  } catch (e) {
                    return str;
                  }
                }}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              {/* Eixo Y da ESQUERDA para o Volume (Hm³) */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={50}
                domain={[0, "auto"]}
                label={{ value: 'Volume (Hm³)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              {/* Eixo Y da DIREITA para as Metas (%) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={50}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                label={{ value: 'Metas (%)', angle: 90, position: 'insideRight', fill: '#6b7280' }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey="volume"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={false}
                name="Volume"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="meta1"
                stroke="var(--chart-2)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Meta 1"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="meta2"
                stroke="var(--chart-3)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Meta 2"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="meta3"
                stroke="var(--chart-4)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Meta 3"
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
