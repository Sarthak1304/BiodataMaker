"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { DraftAttacher } from "@/components/auth/draft-attacher";
import { AppHeader } from "@/components/layout/app-header";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DraftAttacher />
      <AppHeader />
      {children}
    </SessionProvider>
  );
}
