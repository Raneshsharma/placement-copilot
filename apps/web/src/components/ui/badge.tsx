import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ── Badge Variants (Sovereign Careerist) ──────────────────
const badgeVariants = cva(
  "inline-flex items-center rounded-md text-xs font-medium px-2.5 py-1 transition-colors",
  {
    variants: {
      variant: {
        // Primary — Navy badge
        default: "bg-primary-container text-primary-onContainer",
        // Secondary — Cyan badge
        secondary: "bg-secondary-container text-secondary-onContainer",
        // Success — Emerald badge
        success: "bg-success/12 text-success",
        // Warning — Amber badge
        warning: "bg-warning/12 text-warning",
        // Error — Red badge
        error: "bg-error/12 text-error",
        // Outline — ghost-border only
        outline: "border border-outline-variant text-on-surface-variant",
        // Glow — fills with primary for highlight moments
        glow: "bg-primary text-white shadow-glow-secondary",
        // Tonal — secondary container
        tonal: "bg-secondary-container text-secondary-onContainer",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
