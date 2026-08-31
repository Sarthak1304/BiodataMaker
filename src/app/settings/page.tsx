"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ChevronRight, UserRound, Download, Trash2, LogOut } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useDraftStore } from "@/lib/draft-store";
import { useLogout } from "@/lib/use-logout";

interface BiodataRow {
  id: string;
  isPublic: boolean;
  partnerPreference?: { freeText?: string };
  personal?: { fullName?: string };
}

export default function SettingsPage() {
  const status = useRequireAuth();
  const { data: session } = useSession();
  const router = useRouter();

  const resetDraft = useDraftStore((s) => s.reset);
  const logout = useLogout();

  const [rows, setRows] = useState<BiodataRow[] | null>(null);
  const [about, setAbout] = useState("");
  const [aboutSaved, setAboutSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingBiodataId, setDeletingBiodataId] = useState<string | null>(null);
  const [biodataDeleteBusy, setBiodataDeleteBusy] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/biodata")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list: BiodataRow[] = data?.biodataList ?? [];
        setRows(list);
        setAbout(list[0]?.partnerPreference?.freeText ?? "");
      });
  }, [status]);

  async function togglePublic(row: BiodataRow) {
    const next = !row.isPublic;
    setRows((prev) => prev && prev.map((r) => (r.id === row.id ? { ...r, isPublic: next } : r)));
    await fetch(`/api/biodata/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: next }),
    });
  }

  async function saveAbout() {
    if (!rows || rows.length === 0) return;
    await fetch(`/api/biodata/${rows[0].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerPreference: { freeText: about } }),
    });
    setAboutSaved(true);
    setTimeout(() => setAboutSaved(false), 2000);
  }

  async function deleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      resetDraft();
      await signOut({ callbackUrl: "/" });
    } else {
      setDeleting(false);
    }
  }

  async function deleteBiodata() {
    if (!deletingBiodataId) return;
    setBiodataDeleteBusy(true);
    const res = await fetch(`/api/biodata/${deletingBiodataId}`, { method: "DELETE" });
    if (res.ok) {
      setRows((prev) => prev && prev.filter((r) => r.id !== deletingBiodataId));
      if (useDraftStore.getState().savedBiodataId === deletingBiodataId) resetDraft();
      setDeletingBiodataId(null);
    }
    setBiodataDeleteBusy(false);
  }

  return (
    <MobileShell wide>
      <div className="px-5 pt-5 lg:px-8">
        <h1 className="font-display mb-4 text-[26px] font-semibold text-primary">Settings</h1>

        <div className="mb-6 flex items-center gap-3.5 rounded-md border border-border bg-card p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserRound size={22} strokeWidth={1.5} className="text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-foreground">{session?.user?.name || "Member"}</p>
            <p className="truncate text-[12px] text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Privacy</p>
        <div className="mb-6 rounded-md border border-border bg-card px-4">
          {rows === null && <p className="py-4 text-[13px] text-muted-foreground">Loading…</p>}
          {rows && rows.length === 0 && (
            <p className="py-4 text-[13px] text-muted-foreground">You haven&apos;t created a biodata yet.</p>
          )}
          {rows?.map((row, i) => (
            <div key={row.id} className={`flex items-center justify-between py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex-1 pr-3">
                <p className="text-[14px] font-medium text-foreground">{row.personal?.fullName || "Untitled Biodata"}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {row.isPublic ? "Visible to other members in Discover" : "Private — hidden from Discover"}
                </p>
              </div>
              <button
                onClick={() => togglePublic(row)}
                className={`relative h-[26px] w-11 shrink-0 rounded-full transition-colors ${
                  row.isPublic ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-[3px] h-5 w-5 rounded-full bg-card shadow transition-all ${
                    row.isPublic ? "right-[3px]" : "left-[3px]"
                  }`}
                />
              </button>
              <button
                onClick={() => setDeletingBiodataId(row.id)}
                className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-950/40"
                aria-label="Delete this biodata"
              >
                <Trash2 size={15} strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>

        {rows && rows.length > 0 && (
          <>
            <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              About You &amp; What You&apos;re Looking For
            </p>
            <div className="mb-6 rounded-md border border-border bg-card p-4">
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                maxLength={800}
                placeholder="A short note about yourself and what you're looking for — shown on your public profile, kept out of your printed biodata."
                className="w-full min-w-0 resize-none border-none bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-2 flex items-center justify-end gap-3">
                {aboutSaved && <span className="text-[12px] text-sage-700 dark:text-sage-300">Saved</span>}
                <Button size="sm" onClick={saveAbout}>
                  Save
                </Button>
              </div>
            </div>
          </>
        )}

        <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Data</p>
        <div className="mb-6 rounded-md border border-border bg-card px-4">
          <a
            href="/api/account/export"
            className="flex items-center justify-between border-b border-border py-3.5 text-left"
          >
            <span className="flex items-center gap-2.5 text-[14px] text-foreground">
              <Download size={15} strokeWidth={1.8} className="text-muted-foreground" />
              Download My Data
            </span>
            <ChevronRight size={14} strokeWidth={1.8} className="text-muted-foreground" />
          </a>
          <button
            onClick={() => setConfirmingDelete(true)}
            className="flex w-full items-center justify-between py-3.5 text-left"
          >
            <span className="flex items-center gap-2.5 text-[14px] font-medium text-red-700 dark:text-red-400">
              <Trash2 size={15} strokeWidth={1.8} />
              Delete Account
            </span>
            <ChevronRight size={14} strokeWidth={1.8} className="text-red-700" />
          </button>
        </div>

        <button
          onClick={logout}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border-[1.5px] border-border bg-card py-3.5 text-[14.5px] font-semibold text-foreground"
        >
          <LogOut size={15} strokeWidth={1.8} />
          Log Out
        </button>
      </div>

      {deletingBiodataId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6">
          <div className="w-full max-w-sm rounded-lg bg-card p-6">
            <h2 className="font-display mb-2 text-[20px] font-semibold text-primary">Delete this biodata?</h2>
            <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
              This permanently deletes this biodata document, including its photos. It won&apos;t affect your other
              saved biodata or your account. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingBiodataId(null)}
                className="flex-1 rounded-md border-[1.5px] border-border py-3 text-[14px] font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={deleteBiodata}
                disabled={biodataDeleteBusy}
                className="flex-1 rounded-md bg-red-700 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {biodataDeleteBusy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6">
          <div className="w-full max-w-sm rounded-lg bg-card p-6">
            <h2 className="font-display mb-2 text-[20px] font-semibold text-primary">Delete your account?</h2>
            <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
              This permanently deletes your account, every biodata you&apos;ve created, and all your messages and
              interests. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-md border-[1.5px] border-border py-3 text-[14px] font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="flex-1 rounded-md bg-red-700 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileShell>
  );
}
