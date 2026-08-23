"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/lib/draft-store";
import { mapDbBiodata } from "@/lib/biodata-mapper";
import { useRequireAuth } from "@/lib/use-require-auth";
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
  const status = useRequireAuth();
  const loadBiodata = useDraftStore((s) => s.loadBiodata);
  const reset = useDraftStore((s) => s.reset);
  const [rows, setRows] = useState<BiodataRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
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

  async function confirmDelete() {
    if (!deletingId) return;
    setDeleteBusy(true);
    const res = await fetch(`/api/biodata/${deletingId}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev && prev.filter((r) => r.id !== deletingId));
      if (useDraftStore.getState().savedBiodataId === deletingId) reset();
      setDeletingId(null);
    }
    setDeleteBusy(false);
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
                <div
                  key={row.id}
                  className="rounded-lg border-[1.5px] border-border bg-white p-4 hover:border-gold-500"
                >
                  <button onClick={() => openExisting(row)} className="w-full text-left">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="font-display text-[17px] font-semibold text-ink-900">
                        {row.personal?.fullName || "Untitled Biodata"}
                      </p>
                      <Badge label={row.isPublic ? "Public" : "Private"} tone="outline" />
                    </div>
                    <p className="mb-3 text-[12.5px] text-ink-500">{template?.name ?? row.templateId}</p>
                  </button>
                  <div className="flex items-center justify-between">
                    <p className="text-[11.5px] text-ink-300">
                      Updated{" "}
                      {new Date(row.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <button
                      onClick={() => setDeletingId(row.id)}
                      aria-label="Delete this biodata"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button size="sm" className="mt-6 flex w-full items-center justify-center gap-1.5 sm:hidden" onClick={startNew}>
          <Plus size={15} strokeWidth={2} />
          New Biodata
        </Button>
      </div>

      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 px-6">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <h2 className="font-display mb-2 text-[20px] font-semibold text-maroon-900">Delete this biodata?</h2>
            <p className="mb-5 text-[13.5px] leading-relaxed text-ink-500">
              This permanently deletes this biodata document, including its photos. It won&apos;t affect your other
              saved biodata or your account. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 rounded-md border-[1.5px] border-border py-3 text-[14px] font-medium text-ink-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteBusy}
                className="flex-1 rounded-md bg-red-700 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {deleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileShell>
  );
}
