"use client";

import { RadarChart as RechartsRadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface RadarDataPoint {
  subject: string;
  current: number;
  target: number;
  fullMark?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  title?: string;
}

export function RadarChart({ data, title }: RadarChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-text-primary mb-4 text-sm">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#353534" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#737783" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#737783" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#201f1f",
              border: "1px solid #353534",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#e5e2e1",
            }}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke="#f2ca50"
            fill="#f2ca50"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="#7C6BB2"
            fill="#7C6BB2"
            fillOpacity={0.1}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#737783" }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-text-tertiary">Your Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-purple-400" style={{ borderColor: "#7C6BB2" }} />
          <span className="text-xs text-text-tertiary">Target Level</span>
        </div>
      </div>
    </div>
  );
}
