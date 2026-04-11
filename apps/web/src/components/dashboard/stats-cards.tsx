"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ElementType;
  color?: string;
}

export function StatsCards({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card className="p-4 border-border shadow-card hover:shadow-glow-sm transition-all duration-200 h-full">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-[6px] flex items-center justify-center"
                style={{ backgroundColor: (stat.color || "#f2ca50") + "20" }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color || "#f2ca50" }} />
              </div>
              {stat.trend && (
                <div className={cn("flex items-center gap-0.5 text-xs font-medium", stat.trendUp ? "text-success" : "text-text-tertiary")}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
            <p className="text-xs text-text-tertiary mt-1">{stat.label}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
