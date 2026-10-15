"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/i18n/client";

interface BeerWheelProps {
  /** How many numbered beers the bar has (Billie's: 10). */
  numbers: number;
  onResult: (number: number) => void;
}

const SPIN_MS = 2500;

/**
 * Billie's beer roulette (concept, café 5): every player spins once and orders
 * the beer with that number at the bar. The number is chosen first (at
 * random), then the wheel turns to it, so the animation can never disagree
 * with the result. With reduced motion the result shows at once.
 */
export function BeerWheel({ numbers, onResult }: BeerWheelProps) {
  const t = useT();
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<number | null>(null);
  const slice = 360 / numbers;

  // Leaving the screen mid-spin: no result for a wheel that's gone.
  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  function spin() {
    const number = 1 + Math.floor(Math.random() * numbers);
    // Five full turns, ending with the number's slice under the pointer at the top.
    setRotation(5 * 360 - ((number - 1) * slice + slice / 2));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const reveal = () => {
      setSpinning(false);
      setResult(number);
      onResult(number);
    };
    if (reduceMotion) {
      reveal();
      return;
    }
    setSpinning(true);
    timer.current = window.setTimeout(reveal, SPIN_MS);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 max-w-full">
        {/* The pointer */}
        <span aria-hidden="true" className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 text-3xl text-parchment">
          ▼
        </span>
        <svg
          viewBox="-100 -100 200 200"
          role="img"
          aria-label={t("pubgame.wheel.label")}
          className="w-full motion-safe:transition-transform motion-safe:duration-[2500ms] motion-safe:ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {Array.from({ length: numbers }, (_, index) => {
            const start = ((index * slice - 90) * Math.PI) / 180;
            const end = (((index + 1) * slice - 90) * Math.PI) / 180;
            const middle = (start + end) / 2;
            return (
              <g key={index}>
                <path
                  d={`M0 0 L${95 * Math.cos(start)} ${95 * Math.sin(start)} A95 95 0 0 1 ${95 * Math.cos(end)} ${95 * Math.sin(end)} Z`}
                  fill={index % 2 === 0 ? "var(--color-gold)" : "var(--color-umber-light)"}
                  stroke="var(--color-ink)"
                />
                <text
                  x={68 * Math.cos(middle)}
                  y={68 * Math.sin(middle)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="18"
                  fontWeight="700"
                  fill={index % 2 === 0 ? "var(--color-ink)" : "var(--color-parchment)"}
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
          <circle r="14" fill="var(--color-ink)" stroke="var(--color-gold)" strokeWidth="3" />
        </svg>
      </div>

      {result === null ? (
        <Button onClick={spin} disabled={spinning} fullWidth>
          {spinning ? t("pubgame.wheel.spinning") : t("pubgame.wheel.spin")}
        </Button>
      ) : null}
      {/* Always mounted: screen readers announce the number when it appears. */}
      <p role="status" className={result === null ? "sr-only" : "text-center"}>
        {result !== null && (
          <>
            <span className="block font-display text-4xl font-semibold text-gold">
              {t("pubgame.wheel.result", { number: result })}
            </span>
            <span className="block">{t("pubgame.wheel.order", { number: result })}</span>
          </>
        )}
      </p>
    </div>
  );
}
