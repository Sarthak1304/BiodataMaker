"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserRound, LogOut, LayoutGrid, Search, MessageCircle, Settings as SettingsIcon } from "lucide-react";
import { useLogout } from "@/lib/use-logout";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppHeader() {
  const { data: session, status } = useSession();
  const logout = useLogout();
  const isAuthenticated = status === "authenticated";
  const homeHref = isAuthenticated ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-ivory-50/95 px-4 py-2.5 backdrop-blur">
      <Link href={homeHref} className="flex shrink-0 items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-maroon-700 to-maroon-900">
          <span className="font-display text-[16px] font-semibold text-gold-300">B</span>
        </div>
        <span className="font-display hidden text-[16px] font-semibold text-maroon-900 sm:inline">
          BiodataMatcher
        </span>
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-1">
          <nav className="mr-1 hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-700 hover:bg-ivory-100"
              >
                <item.icon size={14} strokeWidth={1.8} />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-ivory-200"
            aria-label="Settings"
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserRound size={16} strokeWidth={1.6} className="text-ink-500" />
            )}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-ink-500 hover:bg-ivory-100 hover:text-maroon-700"
          >
            <LogOut size={14} strokeWidth={1.8} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      ) : (
        <Link
          href="/auth"
          className="rounded-md bg-gradient-to-br from-maroon-700 to-maroon-900 px-3.5 py-1.5 text-[12.5px] font-semibold text-gold-100"
        >
          Sign In
        </Link>
      )}
    </header>
  );
}
