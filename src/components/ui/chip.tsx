"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Chip({
  label,
  selected,
  onClick,
  tone = "maroon",
  className,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  tone?: "maroon" | "sage";
  className?: string;
}) {
  const selectedClasses =
    tone === "sage"
      ? "border-sage-500 bg-sage-100 text-sage-700 font-semibold"
      : "border-maroon-700 bg-maroon-900 text-gold-100 font-semibold";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "rounded-full border-[1.5px] px-4 py-3.5 text-[13px] transition-colors",
        selected ? selectedClasses : "border-border bg-white text-ink-700 hover:border-ink-300",
        className
      )}
    >
      {label}
    </motion.button>
  );
}

export function Badge({
  label,
  tone = "sage",
}: {
  label: string;
  tone?: "sage" | "gold" | "maroon" | "outline";
}) {
  const toneClasses = {
    sage: "bg-sage-100 text-sage-700",
    gold: "bg-gold-100 text-gold-700",
    maroon: "bg-maroon-900 text-gold-100",
    outline: "border-[1.5px] border-border bg-white text-ink-500 font-medium",
  }[tone];

  return (
    <span className={cn("rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold", toneClasses)}>
      {label}
    </span>
  );
}
