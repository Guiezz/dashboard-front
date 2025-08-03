// src/components/IdentificationMapWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/dashboard/InteractiveMap"), {
  ssr: false,
});

type Props = {
  lat: number;
  lon: number;
};

export default function IdentificationMapWrapper({ lat, lon }: Props) {
  return <InteractiveMap lat={lat} lon={lon} />;
}
