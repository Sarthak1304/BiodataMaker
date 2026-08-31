"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageCircle, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-10 mt-6 flex border-t border-border bg-card px-2 pb-4 pt-3 lg:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            <Icon size={21} strokeWidth={active ? 2 : 1.8} className={active ? "text-primary" : "text-muted-foreground"} />
            <span className={cn("text-[10.5px]", active ? "font-semibold text-primary" : "text-muted-foreground")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
