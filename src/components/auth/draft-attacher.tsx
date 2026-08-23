"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDraftStore } from "@/lib/draft-store";

function hasDraftContent(draft: ReturnType<typeof useDraftStore.getState>["draft"]) {
  return Boolean(draft.personal.fullName || draft.contact.email || draft.contact.phone);
}

/**
 * Keeps the local browser draft honest across auth transitions:
 * - On first sign-in with an in-progress guest draft, attach it to the
 *   new account (the draft itself stays visible in this tab so an
 *   in-flight flow like "sign in to download" isn't interrupted).
 * - On sign-out — or a session that simply expires — wipe the local draft
 *   entirely so nothing from this account lingers in the browser for
 *   whoever uses it next.
 */
export function DraftAttacher() {
  const { status } = useSession();
  const attempted = useRef(false);
  const prevStatus = useRef(status);

  useEffect(() => {
    const wasAuthenticated = prevStatus.current === "authenticated";
    prevStatus.current = status;

    if (status === "unauthenticated" && wasAuthenticated) {
      useDraftStore.getState().reset();
      attempted.current = false;
      return;
    }

    if (status !== "authenticated" || attempted.current) return;
    const { draft, savedBiodataId, setSavedBiodataId } = useDraftStore.getState();
    if (savedBiodataId || !hasDraftContent(draft)) return;

    attempted.current = true;
    fetch("/api/biodata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.biodata?.id) setSavedBiodataId(data.biodata.id);
      })
      .catch(() => {});
  }, [status]);

  return null;
}
