// src/app/planos-de-acao/page.tsx

import ActionPlanClient from "@/components/plans/ActionPlanClient";

// A página agora é um componente simples que não busca dados.
// Sua única responsabilidade é renderizar o layout e o componente cliente.
export default function ActionPlansPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Planos de Ação</h1>
      </div>
      
      {/* O componente cliente é renderizado SEM props e cuidará de tudo */}
      <ActionPlanClient />
    </main>
  );
}
