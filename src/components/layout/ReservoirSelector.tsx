"use client";

import { useReservoir } from "@/context/ReservoirContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReservoirSelectorProps {
  fullWidth?: boolean;
}

export function ReservoirSelector({
  fullWidth = false,
}: ReservoirSelectorProps) {
  const { reservatorios, selectedReservoir, setSelectedReservoir, isLoading } =
    useReservoir();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>;
  }

  const handleSelectChange = (reservoirId: string) => {
    const reservoir =
      reservatorios.find((r) => r.id === parseInt(reservoirId, 10)) || null;
    setSelectedReservoir(reservoir);
  };

  return (
    <div className={`flex items-center gap-2 ${fullWidth ? "w-full" : ""}`}>
      {!fullWidth && (
        <p className="hidden md:block text-sm font-medium whitespace-nowrap">
          Hidrossistema:
        </p>
      )}

      <Select
        onValueChange={handleSelectChange}
        value={selectedReservoir ? String(selectedReservoir.id) : ""}
      >
        <SelectTrigger
          className={fullWidth ? "w-full h-11 text-base" : "w-[280px]"}
        >
          <SelectValue placeholder="Selecione o hidrossistema" />
        </SelectTrigger>
        <SelectContent>
          {reservatorios.map((reservoir) => (
            <SelectItem key={reservoir.id} value={String(reservoir.id)}>
              {reservoir.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
