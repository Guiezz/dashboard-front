// src/config/index.ts
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida.");
}

export const config = {
  apiBaseUrl,
};
