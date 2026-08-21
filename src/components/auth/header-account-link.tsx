"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutGrid } from "lucide-react";

export function HeaderAccountLink() {
  const { status } = useSession();
  if (status !== "authenticated") return null;

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-700"
    >
      <LayoutGrid size={13} strokeWidth={1.8} />
      My Biodata
    </Link>
  );
}
