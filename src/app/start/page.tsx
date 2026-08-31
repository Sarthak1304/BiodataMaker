"use client";

import Link from "next/link";
import { Sparkles, PenLine } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";

export default function StartFlowPage() {
  return (
    <MobileShell>
      <TopBar />

      <div className="px-6 pt-8">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-accent-foreground">
          Getting started
        </p>
        <h1 className="font-display mb-2.5 text-[28px] font-semibold text-primary">
          How would you like to start?
        </h1>
        <p className="mb-[30px] text-[14px] leading-relaxed text-muted-foreground">
          Choose whichever is easiest. You can always fine-tune every detail afterwards.
        </p>

        <Link
          href="/start/upload"
          className="relative mb-4 flex w-full items-start gap-4 rounded-lg border-[1.5px] border-border bg-card p-[22px] text-left"
        >
          <span className="absolute right-3.5 top-3.5 rounded-full bg-sage-100 px-2.5 py-1 text-[10.5px] font-semibold text-sage-700 dark:bg-sage-900/30 dark:text-sage-300">
            FASTEST
          </span>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent">
            <Sparkles size={22} strokeWidth={1.8} className="text-accent-foreground" />
          </div>
          <div>
            <p className="font-display mb-1 text-[18px] font-semibold text-foreground">Upload old biodata</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              PDF, Word, image or text — we&apos;ll read it and auto-fill your details for review.
            </p>
          </div>
        </Link>

        <Link
          href="/create/template"
          className="flex w-full items-start gap-4 rounded-lg border-[1.5px] border-border bg-card p-[22px] text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sage-100 dark:bg-sage-900/30">
            <PenLine size={22} strokeWidth={1.8} className="text-sage-700 dark:text-sage-300" />
          </div>
          <div>
            <p className="font-display mb-1 text-[18px] font-semibold text-foreground">Enter details manually</p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Start from a blank, guided form — ideal if this is your first biodata.
            </p>
          </div>
        </Link>

        <div className="mt-[34px] flex items-center justify-center gap-2">
          <p className="text-[12px] text-muted-foreground">Your information stays private until you choose to publish it.</p>
        </div>
      </div>
    </MobileShell>
  );
}
