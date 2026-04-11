"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface PPSCardProps {
  score: number;
  breakdown: {
    skillsMatch: number;
    experience: number;
    education: number;
    marketDemand: number;
    location: number;
  };
  trend?: number;
}

export function PPSCard({ score, breakdown, trend }: PPSCardProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const items = [
    { label: "Skills Match", value: breakdown.skillsMatch, color: "#f2ca50" },
    { label: "Experience", value: breakdown.experience, color: "#e9c349" },
    { label: "Education", value: breakdown.education, color: "#f2cc00" },
    { label: "Market Demand", value: breakdown.marketDemand, color: "#c6c6c6" },
    { label: "Location", value: breakdown.location, color: "#99907c" },
  ];

  return (
    <Card className="p-6 border-border shadow-card">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col items-center lg:items-start">
          <h2 className="font-semibold text-text-secondary text-sm mb-4">Placement Potential Score</h2>
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#353534" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke="#f2ca50"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference } as any}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold text-primary">{score}</span>
              <span className="text-xs text-text-tertiary">out of 100</span>
            </div>
          </div>
          {trend !== undefined && (
            <p className="text-xs text-primary mt-2 font-medium">
              {trend > 0 ? "+" : ""}{trend}% this week
            </p>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-sm text-text-secondary mb-3">Score Breakdown</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{item.label}</span>
                  <span className="font-medium text-text-primary">{item.value}%</span>
                </div>
                <div className="h-2 bg-surfaceContainer rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
