import { useEffect, useMemo, useState } from "react";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Hook: anima valor (pulse)

function usePulseCurrency(value: string) {
  const baseValue = useMemo(() => {
    return Number(value.replace(/[^0-9.-]+/g, ""));
  }, [value]);

  const [animated, setAnimated] = useState(baseValue);

  useEffect(() => {
    const peak = baseValue * 1.05;
    const duration = 1200;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // ease-in-out

      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const value =
        progress <= 0.5
          ? baseValue + (peak - baseValue) * (eased * 2)
          : peak - (peak - baseValue) * ((eased - 0.5) * 2);

      setAnimated(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimated(baseValue);
      }
    }

    requestAnimationFrame(animate);
  }, [baseValue]);

  return animated.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/* StartCard */

export const StartCard = () => {
  const sparklineData = [
    { value: 100 },
    { value: 120 },
    { value: 90 },
    { value: 140 },
    { value: 130 },
    { value: 150 },
    { value: 160 },
  ];

  return (
    <>
      <Card
        title="Gross Revenue"
        value="$120,054.24"
        pillText="2.75%"
        trend="up"
        period="From Jan 1st - Jul 31st"
        sparklineData={sparklineData}
      />
      <Card
        title="Avg Order"
        value="$34,067.12"
        pillText="0.10%"
        trend="down"
        period="From Dec 3rd - Feb 12th"
        sparklineData={sparklineData}
      />
      <Card
        title="Trailing Year"
        value="$456,456.34"
        pillText="74.95%"
        trend="up"
        period="Previous 365 days"
        sparklineData={sparklineData}
      />
    </>
  );
};

/* Card  */

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
  sparklineData,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
  sparklineData: { value: number }[];
}) => {
  const animatedValue = usePulseCurrency(value);

  return (
    <div className="col-span-4 p-4 mt-4 rounded border border-stone-300 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex mb-4 flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex-1">
          <h3 className="text-stone-500 mb-2 text-ss">{title}</h3>

          {/* Valor com gradient (inalterado) */}

          <p className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-purple-400">
            {animatedValue}
          </p>

          {/* Sparkline (inalterado) */}

          <div className="w-full h-12 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pill badge (inalterado) */}
        <span
          className={`mt-2 sm:mt-0 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transform transition-transform duration-500 ${
            trend === "up"
              ? "bg-green-100 text-green-700 scale-105"
              : "bg-red-100 text-red-700 scale-95"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
          {pillText}
        </span>
      </div>

      {/* Período + tooltip (inalterado) */}
      <p
        className="text-stone-500 text-sm cursor-help"
        data-tooltip-content={`This shows the trend for ${period}`}
      >
        {period}
      </p>

      <ReactTooltip />
    </div>
  );
};
