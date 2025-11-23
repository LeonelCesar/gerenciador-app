import { FiUser } from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Janeiro", Returning: 208, New: 23 },
  { name: "Fevereiro", Returning: 275, New: 41 },
  { name: "Março", Returning: 420, New: 19 },
  { name: "Abril", Returning: 670, New: 78 },
  { name: "Maio", Returning: 236, New: 48 },
  { name: "Junho", Returning: 167, New: 8.6 },
  { name: "Julho", Returning: 900, New: 4.29 },
];

const pieData = [
  {
    name: "Returning Users",
    value: data.reduce((acc, cur) => acc + cur.Returning, 0),
  },
  {
    name: "New Users",
    value: data.reduce((acc, cur) => acc + cur.New, 0),
  },
];

const COLORS = ["#6366f1", "#f43f5e"];

function ActivityGraph() {
  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiUser />
          Activity
        </h3>
      </div>

      {/* === GRÁFICOS LADO A LADO === */}
      <div className="h-80 px-4 pb-6 flex gap-4">
        {/* LEFT: LINE CHART */}
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 0, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#94a3b8" strokeOpacity={0.3} />
              <XAxis dataKey="name" stroke="#0ea5e9" />
              <YAxis
                className="text-sm font-bold"
                axisLine={false}
                tickLine={false}
                stroke="#38bdf8"
              />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="New"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#f43f5e" }}
              />
              <Line
                type="monotone"
                dataKey="Returning"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, stroke: "#6366f1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT: PIE CHART */}
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Legend />

              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={6}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ActivityGraph;
