import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-[#E8F6F6] text-[#0D7377]",
        secondary: "bg-[#7C6BB2] text-white",
        accent: "bg-[#FF6B35] text-white",
        success: "bg-[#22C55E] text-white",
        warning: "bg-[#F59E0B] text-white",
        error: "bg-[#EF4444] text-white",
        outline: "border border-[#E8E8E6] text-[#1A1A2E]",
        yellow: "bg-[#FEF3C7] text-[#92400E]",
        blue: "bg-[#DBEAFE] text-[#1E40AF]",
        lavender: "bg-[#EDE9FE] text-[#6B21A8]",
        coral: "bg-[#FFEDD5] text-[#C2410C]",
        red_muted: "bg-[#FEE2E2] text-[#991B1B]",
        gray: "bg-[#F4F4F2] text-[#5C5C6D]",
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
