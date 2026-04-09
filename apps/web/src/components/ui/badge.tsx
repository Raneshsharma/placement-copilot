import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[4px] text-xs font-medium px-2.5 py-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary border border-primary/20",
        secondary: "bg-surfaceContainer text-text-secondary border border-border",
        accent: "bg-accent/15 text-accent border border-accent/20",
        success: "bg-primary/15 text-primary border border-primary/20",
        warning: "bg-warning/15 text-warning border border-warning/20",
        error: "bg-error/15 text-error border border-error/20",
        outline: "border border-border text-text-secondary",
        gold: "bg-primary/20 text-primary border border-primary/30",
        glow: "bg-primary text-[#3c2f00] shadow-glow-sm",
        yellow: "bg-primary/15 text-primary border border-primary/20",
        blue: "bg-surfaceContainer text-text-secondary border border-border",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
