"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { DraftAttacher } from "@/components/auth/draft-attacher";
import { AppHeader } from "@/components/layout/app-header";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <DraftAttacher />
        <AppHeader />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
