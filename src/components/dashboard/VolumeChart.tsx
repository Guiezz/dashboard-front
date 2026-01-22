"use client";

import { useState } from "react";
import { ChartDataPoint } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Importar Button
import { config } from "@/config"; // Importar config
import { RefreshCw, Info } from "lucide-react"; // Importar ícone
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
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface VolumeChartProps {
  data: ChartDataPoint[];
  reservatorioId?: number; // Novo prop necessário para a API
  onRefresh?: () => void; // Callback para recarregar os dados após o update
}

export function VolumeChart({
  data,
  reservatorioId,
  onRefresh,
}: VolumeChartProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Converte as metas para a escala de porcentagem (0-100)
  const chartData = data.map((point) => ({
    ...point,
    meta1: point.meta1 * 100,
    meta2: point.meta2 * 100,
    meta3: point.meta3 * 100,
  }));

  // Função para chamar a rota POST da FUNCEME
  const handleUpdateData = async () => {
    if (!reservatorioId) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/reservatorios/${reservatorioId}/funceme-update`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao atualizar dados.");
      }

      const result = await response.json();
      alert(result.status || "Dados atualizados com sucesso!"); // Pode substituir por um Toast se tiver configurado

      // Chama a função do pai para recarregar o gráfico
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar novos dados da FUNCEME.");
    } finally {
      setIsUpdating(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          <p className="font-bold text-gray-800">{`Data: ${format(new Date(label), "dd/MM/yyyy", { locale: ptBR })}`}</p>
          <p
            style={{ color: "#3f1d0f" }}
          >{`Volume: ${dataPoint.volume.toFixed(2)} Hm³`}</p>
          <p
            style={{ color: "#991b1b" }}
          >{`Meta 1: ${dataPoint.meta1.toFixed(1)}%`}</p>
          <p
            style={{ color: "#b45309" }}
          >{`Meta 2: ${dataPoint.meta2.toFixed(1)}%`}</p>
          <p
            style={{ color: "#ca8a04" }}
          >{`Meta 3: ${dataPoint.meta3.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>📈 Volume (Hm³) comparado com Metas</CardTitle>

        <TooltipProvider>
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[280px]">
              <p>
                As **Metas** representam os volumes esperados (em porcentagem da
                capacidade total) para diferentes cenários de operação e
                planejamento hídrico.
              </p>
            </TooltipContent>
          </ShadcnTooltip>
        </TooltipProvider>

        {/* Renderiza o botão apenas se o reservatorioId for passado */}
        {reservatorioId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateData}
            disabled={isUpdating}
            title="Buscar dados mais recentes da FUNCEME"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            {isUpdating ? "Atualizando..." : "Atualizar Dados"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="2 4" stroke="#e5e5e5" />
              <XAxis
                dataKey="Data"
                angle={-45}
                textAnchor="end"
                height={60}
                tickFormatter={(str) => {
                  try {
                    const date = new Date(str);
                    return date
                      .toLocaleDateString("pt-BR", {
                        month: "short",
                        year: "numeric",
                      })
                      .replace(". de ", "/");
                  } catch (e) {
                    return str;
                  }
                }}
                tick={{ fontSize: 11, fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={50}
                domain={[0, "auto"]}
                label={{
                  value: "Volume (Hm³)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#6b7280",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={50}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                label={{
                  value: "Metas (%)",
                  angle: 90,
                  position: "insideRight",
                  fill: "#6b7280",
                }}
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
        <div className="bg-muted/30 p-4 rounded-lg border border-border/50 text-sm space-y-2">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Info className="h-4 w-4" />
            <span>OBS: Entenda as Metas</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            As linhas tracejadas representam o planejamento de volume para o
            reservatório:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#991b1b] mt-1 shrink-0" />
              <span>
                <strong>Meta 1 (Crítico):</strong> Nível de escassez severa;
                requer medidas de contingenciamento.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b45309] mt-1 shrink-0" />
              <span>
                <strong>Meta 2 (Atenção):</strong> Limite de alerta; pode
                indicar necessidade de restrição parcial.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ca8a04] mt-1 shrink-0" />
              <span>
                <strong>Meta 3 (Operação):</strong>
                Volume ideal para garantir o pleno atendimento às demandas.
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
