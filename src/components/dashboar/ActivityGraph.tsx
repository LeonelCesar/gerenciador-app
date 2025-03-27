import { FiUser } from "react-icons/fi";
import { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Janeiro",
    Returning: 208,
    New: 23,
  },
  {
    name: "Fevereiro",
    Returning: 275,
    New: 41,
  },
  {
    name: "Março",
    Returning: 420,
    New: 19,
  },
  {
    name: "Abril",
    Returning: 670,
    New: 78,
  },
  {
    name: "Maio",
    Returning: 236,
    New: 48,
  },
  {
    name: "Junho",
    Returning: 167,
    New: 8.6,
  },
  {
    name: "Julho",
    Returning: 900,
    New: 4.29,
  },
];

function ActivityGraph() {
  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300">
      <div className="p-4">
        <h3 className="flex items-center gap-1.5 font-medium">
          <FiUser />
          Activity
        </h3>
      </div>

      {/* Our Graph*/}
      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 0,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="#4e4e7" />
            <XAxis dataKey="name" />
            <YAxis
              className="text-sm font-bold"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              wrapperClassName="text-sm rounded"
              labelClassName="text-sm text-stone-500"
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="New"
              stroke="#18181b"
              fill="#18181b"
            />
            <Line
              type="monotone"
              dataKey="Returning"
              stroke="#5b21b6"
              fill="#5b21b6"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityGraph;
