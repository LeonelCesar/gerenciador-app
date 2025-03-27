import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

export const StartCard = () => {
  return (
    <>
      <Card
        title="Gross Reveniu"
        value="$120,054.24"
        pillText="2.75%"
        trend="up"
        period="From jan 1st - Jul 31st"
      />
      <Card
        title="Avg Order"
        value="$34,067.12"
        pillText="0.10%"
        trend="down"
        period="From Dez 3st - Feb 12st"
      />
      <Card
        title="Trailing Year"
        value="$456,456.34"
        pillText="74.95%"
        trend="up"
        period="Previous 365 days"
      />
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <div className="col-span-4 p-4 mt-4 rounded border border-stone-300">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-ss">{title}</h3>
          <p className="text-3xl font-semibold">{value}</p>
        </div>

        <span
          className={`text-sm flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up" ? "bg-green-100" : "bg-red-100 text-red-700"
          }`}
        >
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />}
          {pillText}
        </span>
      </div>
      <p className="text-stone-500 text-sm">{period}</p>
    </div>
  );
};
