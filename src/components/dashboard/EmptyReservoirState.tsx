"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface EmptyReservoirStateProps {
  title?: string;
  description?: string;
}

export function EmptyReservoirState({
  title = "Nenhum hidrossistema selecionado",
  description = "Para visualizar as informações detalhadas, por favor escolha um reservatório no seletor localizado no topo da página.",
}: EmptyReservoirStateProps) {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="max-w-md w-full border-dashed shadow-none bg-muted/30">
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-8 text-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
