import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Resolve o problema do fuso horário criando a data ao meio-dia
export const parseDataLocal = (dateStr: string) => {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, 1, 12, 0, 0);
};

export const formatDate = (dateStr: string) => {
  const date = parseDataLocal(dateStr);
  return format(date, "MMM/yyyy", { locale: ptBR });
};
