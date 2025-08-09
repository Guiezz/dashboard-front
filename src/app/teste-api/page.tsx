// src/app/teste-api/page.tsx

async function getTestData() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/water-balance/static-charts",
      { cache: "no-store" } // Garante que os dados são sempre frescos
    );
    if (!response.ok) {
      // Se a resposta não for OK, lança um erro com o status
      throw new Error(`A API respondeu com o status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    // Se houver um erro na busca (fetch) ou no JSON, captura-o
    return { data: null, error: err.message };
  }
}

export default async function TesteApiPage() {
  const { data, error } = await getTestData();

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Página de Teste da API</h1>
      <p className="mb-6">
        Esta página busca os dados do endpoint{" "}
        <code className="bg-gray-200 p-1 rounded">
          /api/water-balance/static-charts
        </code>{" "}
        e mostra a resposta JSON crua abaixo.
      </p>

      {/* Se houver um erro, mostre a mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Ocorreu um Erro:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {/* Se os dados forem carregados, mostre o JSON formatado */}
      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Dados Recebidos:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {/* JSON.stringify formata o objeto para ser lido como texto */}
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
