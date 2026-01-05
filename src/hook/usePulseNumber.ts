import { useEffect, useState } from "react";

type UsePulseNumberOptions = {
  peakMultiplier?: number; // quanto o valor sobe (ex: 1.05 = +5%)
  duration?: number;       // duração total da animação
  steps?: number;          // suavidade
};

export function usePulseNumber(
  baseValue: number,
  {
    peakMultiplier = 1.05,
    duration = 1200,
    steps = 30,
  }: UsePulseNumberOptions = {}
) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    const peakValue = baseValue * peakMultiplier;
    const halfSteps = steps / 2;
    const stepTime = duration / steps;

    let currentStep = 0;
    let direction: "up" | "down" = "up";

    const interval = setInterval(() => {
      currentStep++;

      if (direction === "up") {
        const progress = currentStep / halfSteps;
        setValue(baseValue + (peakValue - baseValue) * progress);

        if (currentStep >= halfSteps) {
          direction = "down";
          currentStep = 0;
        }
      } else {
        const progress = currentStep / halfSteps;
        setValue(peakValue - (peakValue - baseValue) * progress);

        if (currentStep >= halfSteps) {
          clearInterval(interval);
          setValue(baseValue);
        }
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [baseValue, peakMultiplier, duration, steps]);

  return value;
}
