// src/context/ReservoirContext.tsx
"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ReservatorioSelecao } from '@/lib/types'; // Vamos criar este tipo a seguir

interface ReservoirContextType {
  reservatorios: ReservatorioSelecao[];
  selectedReservoir: ReservatorioSelecao | null;
  setSelectedReservoir: (reservoir: ReservatorioSelecao | null) => void;
  isLoading: boolean;
}

const ReservoirContext = createContext<ReservoirContextType | undefined>(undefined);

export function ReservoirProvider({ children }: { children: ReactNode }) {
  const [reservatorios, setReservatorios] = useState<ReservatorioSelecao[]>([]);
  const [selectedReservoir, setSelectedReservoir] = useState<ReservatorioSelecao | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReservoirs() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/reservatorios", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao buscar a lista de reservatórios");
        const data: ReservatorioSelecao[] = await res.json();
        setReservatorios(data);
        // Seleciona o primeiro reservatório da lista como padrão
        if (data.length > 0) {
          setSelectedReservoir(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReservoirs();
  }, []);

  return (
    <ReservoirContext.Provider value={{ reservatorios, selectedReservoir, setSelectedReservoir, isLoading }}>
      {children}
    </ReservoirContext.Provider>
  );
}

export function useReservoir() {
  const context = useContext(ReservoirContext);
  if (context === undefined) {
    throw new Error('useReservoir must be used within a ReservoirProvider');
  }
  return context;
}
