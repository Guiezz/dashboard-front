"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ReservatorioSelecao } from '@/lib/types'; // Certifique-se que este tipo corresponde à sua API

// --- INTERFACES ---
interface ReservoirContextType {
  reservatorios: ReservatorioSelecao[];
  selectedReservoir: ReservatorioSelecao | null;
  setSelectedReservoir: (reservoir: ReservatorioSelecao | null) => void;
  isLoading: boolean;
  error: string | null; // Adicionado para melhor feedback de erros
}

// --- CONTEXTO ---
const ReservoirContext = createContext<ReservoirContextType | undefined>(undefined);

// --- LÓGICA PRINCIPAL ---

// CORREÇÃO: A URL base é lida da variável de ambiente, permitindo deploy.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export function ReservoirProvider({ children }: { children: ReactNode }) {
  const [reservatorios, setReservatorios] = useState<ReservatorioSelecao[]>([]);
  const [selectedReservoir, setSelectedReservoir] = useState<ReservatorioSelecao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Estado para guardar mensagens de erro

  useEffect(() => {
    async function fetchReservoirs() {
      try {
        setIsLoading(true);
        setError(null);

        // CORREÇÃO: Usa a variável API_BASE_URL para construir o URL completo.
        const res = await fetch(`${API_BASE_URL}/api/reservatorios`, { cache: "no-store" });

        if (!res.ok) {
          // Captura o texto do erro da API para uma mensagem mais clara
          const errorText = await res.text();
          throw new Error(`Falha ao buscar a lista de reservatórios: ${res.status} ${res.statusText} - ${errorText}`);
        }

        const data: ReservatorioSelecao[] = await res.json();
        setReservatorios(data);

        if (data.length > 0) {
          setSelectedReservoir(data[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message); // Guarda a mensagem de erro no estado
      } finally {
        setIsLoading(false);
      }
    }
    fetchReservoirs();
  }, []); // O array vazio assegura que esta função só corre uma vez

  return (
    <ReservoirContext.Provider value={{ reservatorios, selectedReservoir, setSelectedReservoir, isLoading, error }}>
      {children}
    </ReservoirContext.Provider>
  );
}

// --- HOOK DE ACESSO FÁCIL ---
export function useReservoir() {
  const context = useContext(ReservoirContext);
  if (context === undefined) {
    throw new Error('useReservoir must be used within a ReservoirProvider');
  }
  return context;
}
