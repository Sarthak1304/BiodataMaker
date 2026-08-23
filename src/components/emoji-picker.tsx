"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

const EMOJIS = [
  "😀", "😁", "😂", "🥰", "😍", "😊", "😉", "😘",
  "🙏", "👍", "👏", "🎉", "❤️", "💐", "💍", "✨",
  "🌸", "🌺", "🥳", "😅", "🤔", "😢", "🙌", "🔥",
];

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Add emoji"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
          open ? "border-gold-500 bg-gold-100 text-gold-700" : "border-border bg-white text-ink-500"
        }`}
      >
        <Smile size={18} strokeWidth={1.8} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-[54px] left-0 z-30 grid w-[236px] grid-cols-8 gap-1 rounded-lg border border-border bg-white p-2.5 shadow-lg"
          >
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onSelect(emoji);
                  setOpen(false);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[16px] hover:bg-ivory-100"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
