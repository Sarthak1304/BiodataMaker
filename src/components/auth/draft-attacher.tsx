"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDraftStore } from "@/lib/draft-store";

function hasDraftContent(draft: ReturnType<typeof useDraftStore.getState>["draft"]) {
  return Boolean(draft.personal.fullName || draft.contact.email || draft.contact.phone);
}

export function DraftAttacher() {
  const { status } = useSession();
  const attempted = useRef(false);

  useEffect(() => {
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
