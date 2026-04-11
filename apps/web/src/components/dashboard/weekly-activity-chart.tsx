"use client";

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface WeeklyActivityChartProps {
  data: Array<{ day: string; applications: number }>;
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <Card className="p-5">
      <h3 className="font-semibold text-on-surface mb-4">Weekly Activity</h3>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#434652" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,104,121,0.08)" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(121,122,134,0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#141b2c",
            }}
          />
          <Bar
            dataKey="applications"
            fill="#006879"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
