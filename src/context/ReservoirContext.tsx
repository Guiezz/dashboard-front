"use client";

import { config } from "@/config"; // Importa a config centralizada
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Reservatorio } from "@/lib/types";

// --- INTERFACES ---
interface ReservoirContextType {
  reservatorios: Reservatorio[];
  selectedReservoir: Reservatorio | null;
  setSelectedReservoir: (reservoir: Reservatorio | null) => void;
  isLoading: boolean;
  error: string | null;
}

// --- CONTEXTO ---
const ReservoirContext = createContext<ReservoirContextType | undefined>(
  undefined,
);

export function ReservoirProvider({ children }: { children: ReactNode }) {
  const [reservatorios, setReservatorios] = useState<Reservatorio[]>([]);
  const [selectedReservoir, setSelectedReservoir] =
    useState<Reservatorio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservoirs() {
      try {
        setIsLoading(true);
        setError(null);

        // CORREÇÃO: Usa config.apiBaseUrl (que já vem do config/index.ts)
        const res = await fetch(`${config.apiBaseUrl}/reservatorios`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Falha ao buscar a lista de reservatórios: ${res.status} ${res.statusText} - ${errorText}`,
          );
        }

        const data: Reservatorio[] = await res.json();
        setReservatorios(data);

        if (data.length > 0) {
          setSelectedReservoir(data[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReservoirs();
  }, []);

  return (
    <ReservoirContext.Provider
      value={{
        reservatorios,
        selectedReservoir,
        setSelectedReservoir,
        isLoading,
        error,
      }}
    >
      {children}
    </ReservoirContext.Provider>
  );
}

// --- HOOK DE ACESSO FÁCIL ---
export function useReservoir() {
  const context = useContext(ReservoirContext);
  if (context === undefined) {
    throw new Error("useReservoir must be used within a ReservoirProvider");
  }
  return context;
}
