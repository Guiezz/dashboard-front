// src/components/dashboard/InteractiveMap.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- INÍCIO DA CORREÇÃO DO ÍCONE ---

// 1. Importa os ficheiros de imagem diretamente.
// O Next.js vai processá-los e dar-nos o caminho correto.
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// 2. Apaga a configuração antiga e cria um novo ícone padrão.
// Isto garante que o Leaflet use os caminhos corretos que importámos.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
// --- FIM DA CORREÇÃO DO ÍCONE ---

type Props = {
  lat: number;
  lon: number;
};

export default function InteractiveMap({ lat, lon }: Props) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-[300px] w-full rounded-md border"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[lat, lon]}>
        <Popup>
          Açude Patu<br />[{lat.toFixed(4)}, {lon.toFixed(4)}]
        </Popup>
      </Marker>
    </MapContainer>
  );
}
