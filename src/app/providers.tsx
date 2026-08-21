"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { DraftAttacher } from "@/components/auth/draft-attacher";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <DraftAttacher />
      {children}
    </SessionProvider>
  );
}
