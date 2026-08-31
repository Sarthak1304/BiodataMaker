"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Download, RefreshCw, MoreVertical } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { DownloadGateModal } from "@/components/download-gate-modal";
import { useDraftStore } from "@/lib/draft-store";
import { TEMPLATES } from "@/types/biodata";
import { ChevronLeft } from "lucide-react";

export default function LivePreviewPage() {
  const router = useRouter();
  const { status } = useSession();
  const draft = useDraftStore((s) => s.draft);
  const setSavedBiodataId = useDraftStore((s) => s.setSavedBiodataId);
  const [showGate, setShowGate] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (status !== "authenticated") {
      setShowGate(true);
      return;
    }
    setDownloading(true);
    setError(null);
    try {
      const [pdfRes] = await Promise.all([
        fetch("/api/pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }),
        fetch("/api/biodata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.biodata?.id && setSavedBiodataId(d.biodata.id)),
      ]);

      if (!pdfRes.ok) throw new Error("Something went wrong generating your PDF. Please try again.");

      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(draft.personal.fullName || "biodata").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-biodata.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <MobileShell bg="bg-muted">
      <div className="flex items-center justify-between px-5 pt-5">
        <button
          aria-label="Back"
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-card"
        >
          <ChevronLeft size={22} strokeWidth={1.8} />
        </button>
        <span className="text-[13.5px] font-semibold text-foreground">
          {draft.personal.fullName ? `${draft.personal.fullName.split(" ")[0]}'s Biodata` : "Your Biodata"}
        </span>
        <MoreVertical size={20} strokeWidth={1.8} className="text-foreground" />
      </div>

      <div className="px-5 pt-4">
        <div className="flex rounded-full border border-border bg-card p-1">
          <Link
            href="/create/personal"
            className="flex-1 rounded-full py-3.5 text-center text-[13px] font-medium text-muted-foreground"
          >
            Edit
          </Link>
          <span className="flex-1 rounded-full bg-primary py-3.5 text-center text-[13px] font-semibold text-primary-foreground">
            Preview
          </span>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-4">
        <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-primary-foreground">
          {TEMPLATES.find((t) => t.id === draft.templateId)?.name ?? "Traditional Floral"}
        </span>
        <Link
          href="/create/template?from=/create/preview"
          className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] text-muted-foreground"
        >
          Switch template
        </Link>
      </div>

      <div className="px-5 pt-[18px]">
        <TemplateRenderer data={draft} />
        <p className="mt-3 text-center text-[11.5px] text-muted-foreground">
          Page 1 of {draft.additionalPhotos.length > 0 ? 2 : 1} · A4
        </p>
      </div>

      {error && <p className="px-5 pt-3 text-center text-[12.5px] text-primary">{error}</p>}

      <div className="mt-7 flex gap-3 border-t border-border bg-muted px-5 py-5">
        <Button variant="secondary" className="flex-1" onClick={() => router.push("/create/personal")}>
          Edit Details
        </Button>
        <Button className="flex flex-1 items-center justify-center gap-1.5" onClick={handleDownload} disabled={downloading}>
          <Download size={15} strokeWidth={1.8} />
          {downloading ? "Preparing…" : "Download PDF"}
        </Button>
      </div>
      <div className="px-5 pb-6 pt-0.5 text-center">
        <Link
          href="/create/template?from=/create/preview"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary"
        >
          <RefreshCw size={13} strokeWidth={1.8} />
          Not quite right? Try a different template
        </Link>
      </div>

      {showGate && <DownloadGateModal onClose={() => setShowGate(false)} />}
    </MobileShell>
  );
}
