// src/app/page.tsx
import { IdentificationData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";
import IdentificationMapWrapper from "@/components/dashboard/IdentificationMapWrapper";

async function getIdentificationData(): Promise<IdentificationData | null> {
  const API_BASE_URL = "http://localhost:8000";
  try {
    const res = await fetch(`${API_BASE_URL}/api/identification`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Falha ao buscar dados de identificação");
    }
    const data: IdentificationData = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function IdentificationPage() {
  const data = await getIdentificationData();

  if (!data) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-red-500">
            Erro ao carregar os dados.
          </h1>
          <p>
            Verifique se a API Python e o endpoint de identificação estão
            funcionando.
          </p>
        </div>
      </main>
    );
  }

  const location = data.location_data[0];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Identificação do Reservatório
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Sobre o Hidrossistema Patu
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-justify">
            <p>{data.identification_text}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Localização
            </CardTitle>
            <CardDescription>Coordenadas do Açude Patu</CardDescription>
          </CardHeader>

          <IdentificationMapWrapper
            lat={location.lat}
            lon={location.lon}
          />

          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">Latitude</span>
              <span className="text-sm font-semibold">{location.lat}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">Longitude</span>
              <span className="text-sm font-semibold">{location.lon}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
