"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, AlertCircle, Database } from "lucide-react";

interface ConfigFormProps {
  selectedReservoirName?: string; // Novo: Nome vindo do contexto
  selectedAcudeId: string; // Novo: ID validado
  capacidadeTotal: number;
  volPercentual: string;
  setVolPercentual: (val: string) => void;
  dataInicio: string;
  setDataInicio: (val: string) => void;
  dataFim: string;
  setDataFim: (val: string) => void;
  demanda: string;
  setDemanda: (val: string) => void;
  onSimular: () => void;
  simulating: boolean;
  error: string | null;
  minDate: string;
  maxDate: string;
}

export function ConfigForm({
  selectedReservoirName,
  selectedAcudeId,
  capacidadeTotal,
  volPercentual,
  setVolPercentual,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  demanda,
  setDemanda,
  onSimular,
  simulating,
  error,
  minDate,
  maxDate,
}: ConfigFormProps) {
  return (
    <Card className="border-l-4 border-l-amber-500 shadow-sm h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Configuração</CardTitle>
        <CardDescription>
          Cenário para {selectedReservoirName || "..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* EXIBIÇÃO DO RESERVATÓRIO (Sem opção de troca) */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            Reservatório Selecionado
          </Label>
          <div
            className={`p-3 rounded-md border text-sm font-medium ${selectedReservoirName ? "bg-blue-50 text-amber-900 border-blue-100" : "bg-slate-100 text-slate-500"}`}
          >
            {selectedReservoirName || "Selecione no Menu Lateral"}
          </div>
          {capacidadeTotal > 0 && (
            <p className="text-xs text-muted-foreground">
              Capacidade Máx: <strong>{capacidadeTotal.toFixed(2)} hm³</strong>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Volume Inicial (%)</Label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              max="100"
              value={volPercentual}
              onChange={(e) => setVolPercentual(e.target.value)}
              className="pr-8"
              disabled={!selectedAcudeId}
            />
            <span className="absolute right-3 top-2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {capacidadeTotal > 0 && volPercentual && (
            <p className="text-xs text-amber-600-500">
              ={" "}
              {((parseFloat(volPercentual) / 100) * capacidadeTotal).toFixed(2)}{" "}
              hm³
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Período
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Início</span>
              <Input
                type="date"
                min={minDate}
                max={maxDate}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                disabled={!selectedAcudeId}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Fim</span>
              <Input
                type="date"
                min={minDate}
                max={maxDate}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                disabled={!selectedAcudeId}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Demanda (m³/s)</Label>
          <Input
            type="number"
            step="0.1"
            value={demanda}
            onChange={(e) => setDemanda(e.target.value)}
            disabled={!selectedAcudeId}
          />
        </div>

        <Button
          className="w-full bg-amber-500 hover:bg-amber-800 text-amber-50"
          onClick={onSimular}
          disabled={simulating || !selectedAcudeId}
        >
          {simulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
            </>
          ) : (
            "Gerar Simulação"
          )}
        </Button>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex gap-2 border border-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
