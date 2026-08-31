"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar({
  title,
  right,
  onBack,
}: {
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <button
        aria-label="Back"
        onClick={onBack ?? (() => router.back())}
        className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
      >
        <ChevronLeft size={22} strokeWidth={1.8} />
      </button>
      {title && <span className="text-[13.5px] font-semibold text-foreground">{title}</span>}
      {right ?? <span className="w-9" />}
    </div>
  );
}
