"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Sparkles, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/lib/draft-store";

export default function UploadStartPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const hydrateFromExtraction = useDraftStore((s) => s.hydrateFromExtraction);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "extracting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setStatus("extracting");
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Couldn't read that file.");
        setStatus("idle");
        return;
      }

      hydrateFromExtraction(data.extracted);
      setStatus("done");
    } catch {
      setError("Something went wrong reading that file. You can still enter details manually.");
      setStatus("idle");
    }
  }

  return (
    <MobileShell>
      <TopBar />

      <div className="px-6 pt-8">
        <h1 className="font-display mb-2.5 text-[26px] font-semibold text-primary">Upload your old biodata</h1>
        <p className="mb-6 text-[14px] leading-relaxed text-muted-foreground">
          PDF, Word, image or text — we&apos;ll read it and pre-fill the form for you to review.
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={status === "extracting"}
          className="flex w-full flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-card py-12 disabled:opacity-70"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            {status === "done" ? (
              <CheckCircle2 size={22} strokeWidth={1.8} className="text-sage-700 dark:text-sage-300" />
            ) : (
              <FileUp size={22} strokeWidth={1.8} className="text-accent-foreground" />
            )}
          </div>
          <p className="text-[14px] font-medium text-foreground">
            {status === "extracting" ? "Reading your file…" : fileName ?? "Tap to choose a file"}
          </p>
          <p className="text-[12px] text-muted-foreground">.pdf, .docx, .txt, or an image</p>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-md bg-destructive/10 p-4">
            <p className="text-[12.5px] leading-relaxed text-destructive">{error}</p>
          </div>
        )}

        {status === "done" && !error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-md bg-sage-100 p-4 dark:bg-sage-900/30">
            <CheckCircle2 size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-sage-700 dark:text-sage-300" />
            <p className="text-[12.5px] leading-relaxed text-sage-700 dark:text-sage-300">
              We&apos;ve pre-filled what we could find — pick a template next, then review and edit every field
              before saving.
            </p>
          </div>
        )}

        {status === "idle" && !error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-md bg-sage-100 p-4 dark:bg-sage-900/30">
            <Sparkles size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-sage-700 dark:text-sage-300" />
            <p className="text-[12.5px] leading-relaxed text-sage-700 dark:text-sage-300">
              We never invent details — anything we&apos;re not confident about is left blank for you to fill in.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-3 border-t border-border bg-muted px-6 py-5">
        <Button variant="secondary" size="default" className="flex-none basis-24" onClick={() => router.back()}>
          Back
        </Button>
        <Button className="flex-1" onClick={() => router.push("/create/template")}>
          {status === "done" ? "Continue" : "Continue Manually"}
        </Button>
      </div>
    </MobileShell>
  );
}
