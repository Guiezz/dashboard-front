"use client";

import { useReservoir } from "@/context/ReservoirContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReservoirSelector() {
  const { reservatorios, selectedReservoir, setSelectedReservoir, isLoading } =
    useReservoir();

  if (isLoading) {
    return <div className="text-white text-sm">Carregando...</div>;
  }

  const handleSelectChange = (reservoirId: string) => {
    const reservoir =
      reservatorios.find((r) => r.id === parseInt(reservoirId, 10)) || null;
    setSelectedReservoir(reservoir);
  };

  return (
    <Select
      onValueChange={handleSelectChange}
      value={selectedReservoir ? String(selectedReservoir.id) : ""}
    >
      <p>Hidrossistema: </p>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Selecione um reservatório" />
      </SelectTrigger>
      <SelectContent>
        {reservatorios.map((reservoir) => (
          <SelectItem key={reservoir.id} value={String(reservoir.id)}>
            {reservoir.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
