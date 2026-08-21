"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/lib/draft-store";
import { mapDbBiodata } from "@/lib/biodata-mapper";
import { TEMPLATES } from "@/types/biodata";

interface BiodataRow {
  id: string;
  templateId: string;
  updatedAt: string;
  isPublic: boolean;
  personal: { fullName?: string };
  [key: string]: unknown;
}

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const loadBiodata = useDraftStore((s) => s.loadBiodata);
  const reset = useDraftStore((s) => s.reset);
  const [rows, setRows] = useState<BiodataRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      // No explicit callbackUrl: /auth already defaults sign-in to
      // /dashboard and "Continue as Guest" to /start, which is exactly
      // right here (a guest has nothing to see on this page).
      router.replace("/auth");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/biodata")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Couldn't load your biodata."))))
      .then((data) => setRows(data.biodataList ?? []))
      .catch((e) => setError(e.message));
  }, [status, router]);

  function openExisting(row: BiodataRow) {
    loadBiodata(mapDbBiodata(row));
    router.push("/create/preview");
  }

  function startNew() {
    reset();
    router.push("/create/template");
  }

  return (
    <MobileShell wide>
      <TopBar right={<span className="w-9" />} />

      <div className="px-5 pt-4 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[26px] font-semibold text-maroon-900">My Biodata</h1>
            <p className="text-[13.5px] text-ink-500">All the biodata you've saved to your account.</p>
          </div>
          <Button size="sm" className="hidden shrink-0 items-center gap-1.5 sm:flex" onClick={startNew}>
            <Plus size={15} strokeWidth={2} />
            New
          </Button>
        </div>

        {error && <p className="mb-4 text-[13px] text-maroon-700">{error}</p>}

        {rows === null && !error && <p className="text-[13.5px] text-ink-500">Loading…</p>}

        {rows && rows.length === 0 && (
          <div className="rounded-lg border-[1.5px] border-dashed border-border bg-white py-14 text-center">
            <p className="mb-4 text-[14px] text-ink-500">You haven&apos;t created a biodata yet.</p>
            <Button size="sm" className="mx-auto flex w-fit items-center gap-1.5" onClick={startNew}>
              <Plus size={15} strokeWidth={2} />
              Create your first biodata
            </Button>
          </div>
        )}

        {rows && rows.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
              const template = TEMPLATES.find((t) => t.id === row.templateId);
              return (
                <button
                  key={row.id}
                  onClick={() => openExisting(row)}
                  className="rounded-lg border-[1.5px] border-border bg-white p-4 text-left hover:border-gold-500"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <p className="font-display text-[17px] font-semibold text-ink-900">
                      {row.personal?.fullName || "Untitled Biodata"}
                    </p>
                    <Badge label={row.isPublic ? "Public" : "Private"} tone="outline" />
                  </div>
                  <p className="mb-3 text-[12.5px] text-ink-500">{template?.name ?? row.templateId}</p>
                  <p className="text-[11.5px] text-ink-300">
                    Updated {new Date(row.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        <Button size="sm" className="mt-6 flex w-full items-center justify-center gap-1.5 sm:hidden" onClick={startNew}>
          <Plus size={15} strokeWidth={2} />
          New Biodata
        </Button>
      </div>
    </MobileShell>
  );
}
