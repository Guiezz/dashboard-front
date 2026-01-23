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
    <div className="flex items-center gap-2">
      {/* Opcional: Se quiser manter o label "Hidrossistema:" fora, deixe aqui.
          Se quiser só o dropdown, pode remover o <p> */}
      <p className="hidden md:block text-sm font-medium">Hidrossistema:</p>

      <Select
        onValueChange={handleSelectChange}
        // Se for null, passa string vazia "" para mostrar o placeholder
        value={selectedReservoir ? String(selectedReservoir.id) : ""}
      >
        <SelectTrigger className="w-[280px]">
          {/* Aqui mudamos o texto padrão quando nada está selecionado */}
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
