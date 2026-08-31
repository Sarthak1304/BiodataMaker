"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Badge } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/lib/draft-store";
import { mapDbBiodata } from "@/lib/biodata-mapper";
import { useRequireAuth } from "@/lib/use-require-auth";
import { TEMPLATES } from "@/types/biodata";
import { TEMPLATE_THEMES } from "@/components/templates/theme";

interface BiodataRow {
  id: string;
  templateId: string;
  updatedAt: string;
  isPublic: boolean;
  personal: { fullName?: string };
  [key: string]: unknown;
}

function accentFor(templateId: string) {
  if (templateId === "modern-minimal") return "linear-gradient(135deg,#2A2119,#4A3F34)";
  if (templateId === "traditional-floral") return "linear-gradient(135deg,#7A1526,#5C0F1E)";
  const theme = TEMPLATE_THEMES[templateId];
  return theme ? `linear-gradient(135deg, ${theme.accentColor}, ${theme.headingColor})` : "linear-gradient(135deg,#7A1526,#5C0F1E)";
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function DashboardPage() {
  const router = useRouter();
  const status = useRequireAuth();
  const { data: session } = useSession();
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

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <MobileShell wide>
      <TopBar right={<span className="w-9" />} />

      <div className="px-5 pt-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            {firstName && <p className="text-[12.5px] text-muted-foreground">Welcome back, {firstName}</p>}
            <h1 className="font-display text-[26px] font-semibold text-primary">My Biodata</h1>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="hidden shrink-0 sm:block">
            <Button size="sm" className="flex items-center gap-1.5" onClick={startNew}>
              <Plus size={15} strokeWidth={2} />
              New
            </Button>
          </motion.div>
        </motion.div>

        {error && <p className="mb-4 text-[13px] text-primary">{error}</p>}

        {rows === null && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[104px] animate-pulse rounded-xl border border-border bg-muted" />
            ))}
          </div>
        )}

        {rows && rows.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl border-[1.5px] border-dashed border-border bg-card py-14 text-center"
          >
            <p className="mb-4 text-[14px] text-muted-foreground">You haven&apos;t created a biodata yet.</p>
            <Button size="sm" className="mx-auto flex w-fit items-center gap-1.5" onClick={startNew}>
              <Plus size={15} strokeWidth={2} />
              Create your first biodata
            </Button>
          </motion.div>
        )}

        {rows && rows.length > 0 && (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rows.map((row) => {
              const template = TEMPLATES.find((t) => t.id === row.templateId);
              return (
                <motion.div
                  key={row.id}
                  variants={cardVariants}
                  whileHover={{ y: -3 }}
                  className="group overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-1.5 w-full" style={{ background: accentFor(row.templateId) }} />
                  <div className="p-4">
                    <button onClick={() => openExisting(row)} className="w-full text-left">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                            style={{ background: accentFor(row.templateId) }}
                          >
                            <FileText size={14} strokeWidth={1.8} />
                          </div>
                          <p className="font-display text-[16px] font-semibold text-foreground">
                            {row.personal?.fullName || "Untitled Biodata"}
                          </p>
                        </div>
                        <Badge label={row.isPublic ? "Public" : "Private"} tone="outline" />
                      </div>
                      <p className="mb-3 text-[12.5px] text-muted-foreground">{template?.name ?? row.templateId}</p>
                    </button>
                    <div className="flex items-center justify-between">
                      <p className="text-[11.5px] text-muted-foreground">
                        Updated{" "}
                        {new Date(row.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <button
                        onClick={() => setDeletingId(row.id)}
                        aria-label="Delete this biodata"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-red-700 opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <Button size="sm" className="mt-6 flex w-full items-center justify-center gap-1.5 sm:hidden" onClick={startNew}>
          <Plus size={15} strokeWidth={2} />
          New Biodata
        </Button>
      </div>

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-lg bg-card p-6"
            >
              <h2 className="font-display mb-2 text-[20px] font-semibold text-primary">Delete this biodata?</h2>
              <p className="mb-5 text-[13.5px] leading-relaxed text-muted-foreground">
                This permanently deletes this biodata document, including its photos. It won&apos;t affect your
                other saved biodata or your account. This can&apos;t be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-md border-[1.5px] border-border py-3 text-[14px] font-medium text-foreground"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </MobileShell>
  );
}
