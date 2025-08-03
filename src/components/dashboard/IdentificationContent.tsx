// src/components/dashboard/IdentificationContent.tsx
'use client'; // Esta é a nossa "ponte" para o lado do cliente

import { IdentificationData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";
import dynamic from 'next/dynamic';

// A importação dinâmica AGORA acontece dentro de um Componente de Cliente, o que é permitido.
const Map = dynamic(() => import('@/components/dashboard/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-muted/40 rounded-md flex items-center justify-center">
      <p>A carregar o mapa...</p>
    </div>
  ),
});

// Este componente recebe os dados que foram buscados no servidor.
interface IdentificationContentProps {
  data: IdentificationData;
}

export default function IdentificationContent({ data }: IdentificationContentProps) {
  const location = data.location_data[0];

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <Card className="lg:col-span-3">
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

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização
          </CardTitle>
          <CardDescription>Mapa do Reservatório</CardDescription>
        </CardHeader>
        <CardContent>
          <Map lat={location.lat} lon={location.lon} />
          <div className="mt-4 grid gap-4">
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">Latitude</span>
              <span className="text-sm font-semibold">{location.lat}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">Longitude</span>
              <span className="text-sm font-semibold">{location.lon}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
