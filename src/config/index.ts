const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // Opcional: Lançar erro ou usar localhost como fallback para dev
  console.warn("API URL não definida, usando localhost");
}

export const config = {
  apiBaseUrl: API_URL || "http://localhost:8000/api",
};
