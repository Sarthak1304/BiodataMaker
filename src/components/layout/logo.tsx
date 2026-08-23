"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Brand mark — two interlocking rings (a union motif, fitting a
 * matrimonial product) resolving into a monogram "B", rendered as a
 * gradient SVG rather than a flat letter-in-a-box.
 */
export function LogoMark({ size = 34, animated = true }: { size?: number; animated?: boolean }) {
  const svg = (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8C1D2B" />
          <stop offset="1" stopColor="#5C0F1E" />
        </linearGradient>
        <linearGradient id="logo-gold" x1="10" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3E4B8" />
          <stop offset="1" stopColor="#C9A227" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#logo-bg)" />
      <circle cx="16.5" cy="20" r="7" stroke="url(#logo-gold)" strokeWidth="1.6" opacity="0.85" />
      <circle cx="23.5" cy="20" r="7" stroke="url(#logo-gold)" strokeWidth="1.6" opacity="0.85" />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="700"
        fontSize="17"
        fill="url(#logo-gold)"
      >
        B
      </text>
    </svg>
  );

  if (!animated) return svg;

  return (
    <motion.div
      whileHover={{ rotate: -6, scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="inline-flex"
    >
      {svg}
    </motion.div>
  );
}

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="font-display bg-gradient-to-r from-maroon-900 to-maroon-700 bg-clip-text text-[17px] font-semibold tracking-tight text-transparent">
          BiodataMatcher
        </span>
      )}
    </span>
  );
}
