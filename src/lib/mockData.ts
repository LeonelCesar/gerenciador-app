// lib/mockData.ts
import { MetricData } from "@/components/dashboard/MetricsCards";

export const getMockMetrics = (): MetricData[] => {
  // Gera sparklines diferentes para cada métrica
  const generateSparkline = (base: number, variance: number) =>
    Array.from({ length: 7 }, (_, i) => ({
      value: base + Math.sin(i) * variance + (Math.random() - 0.5) * variance * 0.5,
    }));

  return [
    {
      title: "Gross Revenue",
      value: 120054.24,
      trendPercent: 2.75,
      trend: "up",
      period: "Jan 1 - Jul 31",
      sparkline: generateSparkline(120, 20),
      tooltipContent: "Receita bruta total no período, sem deduções.",
    },
    {
      title: "Avg Order Value",
      value: 34067.12,
      trendPercent: 0.1,
      trend: "down",
      period: "Dec 3 - Feb 12",
      sparkline: generateSparkline(34, 5),
      tooltipContent: "Valor médio por pedido no período selecionado.",
    },
    {
      title: "Annual Revenue",
      value: 456456.34,
      trendPercent: 74.95,
      trend: "up",
      period: "Previous 365 days",
      sparkline: generateSparkline(456, 50),
      tooltipContent: "Receita acumulada dos últimos 12 meses.",
    },
  ];
};