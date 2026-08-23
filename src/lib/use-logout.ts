"use client";

import { signOut } from "next-auth/react";
import { useDraftStore } from "@/lib/draft-store";

/** Clears the local draft before the redirect fires, so nothing from this account lingers in the browser for whoever uses it next. */
export function useLogout() {
  const reset = useDraftStore((s) => s.reset);
  return () => {
    reset();
    signOut({ callbackUrl: "/" });
  };
}
