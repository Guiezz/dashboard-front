// src/components/responsaveis/Parceiros.tsx

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Organização por linhas para respeitar hierarquia da imagem
const parceiros = [
  [
    { nome: "CEPAS", logo: "/logos/cepas.png" },
    { nome: "UFC", logo: "/logos/ufc-v.png" },
    { nome: "Cientista Chefe", logo: "/logos/cientista-chefe.png" },
    { nome: "FUNCAP", logo: "/logos/funcap.png", apoio: true },
    { nome: "SECITECE", logo: "/logos/secitece-v.png", destaque: true },
  ],
  [
    { nome: "FUNCEME", logo: "/logos/funceme.png" },
    { nome: "COGERH", logo: "/logos/cogerh.png" },
    { nome: "SRH", logo: "/logos/srh-h.png", destaque: true },
  ],
];

export function Parceiros() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instituições Parceiras</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6">
        {parceiros.map((linha, idx) => (
          <div key={idx} className="flex flex-wrap justify-center items-center gap-8">
            {linha.map((parceiro) => (
              <div
                key={parceiro.nome}
                className="flex flex-col items-start"
              >
                {parceiro.apoio && (
                  <span className="text-sm text-gray-600 font-medium mb-1">
                    Apoio:
                  </span>
                )}
                <div
                  className={`relative ${
                    parceiro.destaque ? "h-28 w-60" : "h-20 w-40"
                  }`}
                  title={parceiro.nome}
                >
                  <Image
                    src={parceiro.logo}
                    alt={`Logo da ${parceiro.nome}`}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
