import { PureComponent } from 'react';
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
  {
    subject: "Traking",
    Mobile: 120,
    Desktop: 110,
    Max: 150,
  },
  {
    subject: "Builder",
    Mobile: 170,
    Desktop: 280,
    Max: 120,
  },
  {
    subject: "Schedule",
    Mobile: 290,
    Desktop: 90,
    Max: 70,
  },
  {
    subject: "AI Train",
    Mobile: 560,
    Desktop: 260,
    Max: 905,
  },
  {
    subject: "Interval",
    Mobile: 280,
    Desktop: 56,
    Max: 106,
  },
  {
    subject: "History",
    Mobile: 540,
    Desktop: 56,
    Max: 750,
  },
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
        <RadarChart cx="50%" cy="50%" 
          outerRadius="80%" data={data}
        >
          <PolarGrid />
          <PolarAngleAxis 
            className="text-xs font-bold"
            dataKey="subject" 
          />
          <PolarRadiusAxis />
          <Radar 
            name="Mike" 
            dataKey="A" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6} 
        />
        </RadarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

export default UsageRadaGraph;
