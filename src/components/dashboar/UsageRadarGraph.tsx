import { FiEye } from "react-icons/fi";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Traking", Mobile: 120, Desktop: 110, Max: 150 },
  { subject: "Builder", Mobile: 170, Desktop: 280, Max: 120 },
  { subject: "Schedule", Mobile: 290, Desktop: 90, Max: 70 },
  { subject: "AI Train", Mobile: 560, Desktop: 260, Max: 905 },
  { subject: "Interval", Mobile: 280, Desktop: 56, Max: 106 },
  { subject: "History", Mobile: 540, Desktop: 56, Max: 750 },
];

function UsageRadaGraph() {
  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiEye />
          Usage
        </h3>
      </div>

      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.4} />

            <PolarAngleAxis
              dataKey="subject"
              className="text-xs font-bold"
              stroke="#0ea5e9"          // azul vivo
            />

            <PolarRadiusAxis
              stroke="#38bdf8"          // azul claro vibrante
              tick={{ fill: "#38bdf8", fontSize: 10 }}
            />

            {/* Radar Mobile */}
            <Radar
              name="Mobile"
              dataKey="Mobile"
              stroke="#6366f1"          // roxo vivo
              fill="#6366f1"
              fillOpacity={0.45}
            />

            {/* Radar Desktop */}
            <Radar
              name="Desktop"
              dataKey="Desktop"
              stroke="#f43f5e"          // rosa forte
              fill="#f43f5e"
              fillOpacity={0.45}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default UsageRadaGraph;
