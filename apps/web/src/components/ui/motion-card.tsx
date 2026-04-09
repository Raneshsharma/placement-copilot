"use client";
import { motion } from "framer-motion";

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}

export function MotionCard({ children, className = "", tiltStrength = 8 }: MotionCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
