import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ── Button Variants (Sovereign Careerist) ──────────────────
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-hover-shift",
  {
    variants: {
      variant: {
        // Primary — Deep Navy with subtle gradient on hover
        default:
          "bg-primary text-white hover:bg-gradient-to-br hover:from-[#003178] hover:to-[#004a9e] shadow-ambient-sm hover:shadow-glow",
        // Secondary — Cyan accent
        secondary:
          "bg-secondary text-white hover:bg-secondary-light hover:shadow-glow-secondary",
        // Ghost — subtle tonal shift, no border
        ghost:
          "text-on-surface hover:bg-surface-container-low surface-shift",
        // Outline — ghost-border (15% opacity), no solid border
        outline:
          "border ghost-border border-outline-variant text-on-surface hover:bg-surface-container-low hover:shadow-ambient-sm",
        // Accent — Emerald for conversion/success moments
        accent:
          "bg-success text-white hover:bg-success-light hover:shadow-glow-success",
        // Tonal — primary container background
        tonal:
          "bg-primary-container text-primary-onContainer hover:bg-surface-container-high hover:shadow-ambient-sm",
        // Destructive
        destructive:
          "bg-error text-white hover:bg-error-light hover:shadow-ambient-lg",
        // Link
        link:
          "text-primary underline-offset-4 hover:underline hover:text-primary-light",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-base rounded-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button, buttonVariants };
