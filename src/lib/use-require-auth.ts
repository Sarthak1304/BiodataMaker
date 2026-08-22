"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

/** Redirects guests to sign-in for pages that only make sense when logged in. */
export function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth?callbackUrl=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [status, router, pathname]);

  return status;
}
