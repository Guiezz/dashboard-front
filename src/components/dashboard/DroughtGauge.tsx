"use client";

import React from "react";

export interface GaugeThresholds {
  meta1: number;
  meta2: number;
  meta3: number;
}

interface DroughtGaugeProps {
  percentage: number;
  currentState: string;
  thresholds?: GaugeThresholds;
}

// --- Funções Auxiliares SVG ---
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  var angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  // Se os ângulos forem iguais, não desenha nada
  if (startAngle >= endAngle) return "";

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}
// ------------------------------

export function DroughtGauge({
  percentage,
  currentState,
  thresholds,
}: DroughtGaugeProps) {
  const value = Math.min(Math.max(percentage, 0), 100);

  // Configurações Visuais
  const radius = 80;
  const strokeWidth = 25;
  const cx = 100;
  const cy = 100;
  const startAngle = 180; // 9 horas
  const totalAngle = 180; // Semicírculo

  // 1. Definição das Metas (Com proteção contra zeros)
  let m1 = thresholds?.meta1 ?? 0;
  let m2 = thresholds?.meta2 ?? 0;
  let m3 = thresholds?.meta3 ?? 0;

  // SE todas forem zero (dado inválido), força um padrão visual
  if (m1 <= 0.1 && m2 <= 0.1 && m3 <= 0.1) {
    m1 = 20;
    m2 = 40;
    m3 = 60;
  }

  // Garante a ordem crescente para o empilhamento funcionar (m1 < m2 < m3)
  m1 = Math.max(0, m1);
  m2 = Math.max(m1, m2);
  m3 = Math.max(m2, m3);

  // 2. Cálculo dos Ângulos Finais de cada faixa
  const angleRed = startAngle + (m1 / 100) * totalAngle;
  const angleOrange = startAngle + (m2 / 100) * totalAngle;
  const angleYellow = startAngle + (m3 / 100) * totalAngle;
  const angleGreen = startAngle + totalAngle; // Vai até o fim (100%)

  // Rotação da Agulha
  const needleAngle = startAngle + (value / 100) * totalAngle;

  // Cor do Texto
  const normalizedState = currentState ? currentState.toLowerCase() : "";
  let stateColor = "#64748b";
  if (
    normalizedState.includes("normal") ||
    normalizedState.includes("conforto")
  )
    stateColor = "#15803d";
  else if (normalizedState.includes("alerta")) stateColor = "#a16207";
  else if (
    normalizedState.includes("seca") &&
    !normalizedState.includes("severa")
  )
    stateColor = "#c2410c";
  else if (
    normalizedState.includes("severa") ||
    normalizedState.includes("crítico")
  )
    stateColor = "#b91c1c";

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg
        width="240"
        height="140"
        viewBox="0 20 200 120"
        className="overflow-visible"
      >
        {/* ESTRATÉGIA DE EMPILHAMENTO (LAYERING) */}
        {/* Desenhamos do MAIOR para o MENOR. O menor fica por cima. */}

        {/* 1. Base: Verde (Conforto) - Vai do início até o fim (ou começa na M3 se preferir segmento, mas empilhado é mais seguro) */}
        {/* Aqui desenhamos o arco completo de 0 a 100 como base verde? Não, desenhamos o segmento verde de M3 a 100. */}
        {/* Mas para corrigir o bug visual, vamos desenhar o verde APENAS se houver espaço para ele */}
        <path
          d={describeArc(cx, cy, radius, angleYellow, angleGreen)}
          fill="none"
          stroke="#22c55e"
          strokeWidth={strokeWidth}
        />

        {/* 2. Amarelo (Alerta) - Desenhamos de 0 até M3? Não, de M2 até M3. */}
        {/* Se usarmos segmentos exatos (Start->End) agora com os dados corrigidos (defaults), não haverá sobreposição errada. */}
        <path
          d={describeArc(cx, cy, radius, angleOrange, angleYellow)}
          fill="none"
          stroke="#eab308"
          strokeWidth={strokeWidth}
        />

        {/* 3. Laranja (Seca) - De M1 até M2 */}
        <path
          d={describeArc(cx, cy, radius, angleRed, angleOrange)}
          fill="none"
          stroke="#f97316"
          strokeWidth={strokeWidth}
        />

        {/* 4. Vermelho (Crítico) - De 0 até M1. Desenhado por último, garante prioridade visual. */}
        <path
          d={describeArc(cx, cy, radius, startAngle, angleRed)}
          fill="none"
          stroke="#ef4444"
          strokeWidth={strokeWidth}
        />

        {/* Agulha */}
        <g
          transform={`rotate(${needleAngle} ${cx} ${cy})`}
          style={{ transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)" }}
        >
          {/* Linha da agulha */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + radius - 5}
            y2={cy}
            stroke="#334155"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Círculo da base */}
          <circle cx={cx} cy={cy} r="6" fill="#334155" />
        </g>

        {/* Marcadores 0% e 100% */}
        <text x="10" y="110" className="text-[10px] fill-slate-400 font-bold">
          0%
        </text>
        <text x="170" y="110" className="text-[10px] fill-slate-400 font-bold">
          100%
        </text>
      </svg>

      <div className="mt-[-20px] flex flex-col items-center text-center z-10">
        <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
          {value.toFixed(1)}%
        </span>
        <span
          className="text-sm font-semibold uppercase"
          style={{ color: stateColor }}
        >
          {currentState}
        </span>
      </div>
    </div>
  );
}
