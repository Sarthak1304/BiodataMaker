"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-maroon-700 to-maroon-900 text-gold-100 shadow-button hover:brightness-110",
        secondary:
          "border-[1.5px] border-border bg-white text-ink-700 font-medium hover:bg-ivory-100 hover:border-gold-500",
        ghost: "bg-transparent text-maroon-700 font-semibold hover:text-maroon-900",
        outlineGold:
          "border-[1.5px] border-border bg-white text-ink-900 font-medium hover:bg-ivory-100",
      },
      size: {
        default: "px-6 py-[15px]",
        sm: "px-4 py-2.5 text-[13px]",
        block: "w-full px-6 py-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "block" },
  }
);

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: props.disabled ? 1 : 1.015 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
