"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";

export default function UploadStartPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <MobileShell>
      <TopBar />

      <div className="px-6 pt-8">
        <h1 className="font-display mb-2.5 text-[26px] font-semibold text-maroon-900">Upload your old biodata</h1>
        <p className="mb-6 text-[14px] leading-relaxed text-ink-500">
          PDF, Word, image or text — we&apos;ll read it and pre-fill the form for you to review.
        </p>

        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-white py-12"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-100">
            <FileUp size={22} strokeWidth={1.8} className="text-gold-700" />
          </div>
          <p className="text-[14px] font-medium text-ink-700">{fileName ?? "Tap to choose a file"}</p>
          <p className="text-[12px] text-ink-300">.pdf, .docx, .txt, or an image</p>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,image/*"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />

        <div className="mt-6 flex items-start gap-2.5 rounded-md bg-sage-100 p-4">
          <Sparkles size={16} strokeWidth={1.8} className="mt-0.5 shrink-0 text-sage-700" />
          <p className="text-[12.5px] leading-relaxed text-sage-700">
            AI extraction is arriving in the next update — for now, start from a blank guided form and it&apos;ll
            only take a few minutes.
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3 border-t border-border bg-ivory-50 px-6 py-5">
        <Button variant="secondary" size="default" className="flex-none basis-24" onClick={() => router.back()}>
          Back
        </Button>
        <Button className="flex-1" onClick={() => router.push("/create/template")}>
          Continue Manually
        </Button>
      </div>
    </MobileShell>
  );
}
