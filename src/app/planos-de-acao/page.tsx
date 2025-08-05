// src/app/planos-de-acao/page.tsx
import ActionPlanClient from "@/components/plans/ActionPlanClient";

// Função para buscar as opções dos filtros no servidor
async function getFilterOptions() {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/action-plans/filters`, {
      cache: "no-store",
    });
    // Adicionamos a mesma verificação aqui
    if (!res.ok) throw new Error("Falha ao buscar opções de filtro");
    return await res.json();
  } catch (error) {
    console.error(error);
    return {
      estados_de_seca: [],
      tipos_de_impacto: [],
      problemas: [],
      acoes: [],
    };
  }
}

export default async function ActionPlansPage() {
  const filterOptions = await getFilterOptions();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Planos de Ação</h1>
      </div>
      <ActionPlanClient filterOptions={filterOptions} />
    </main>
  );
}
