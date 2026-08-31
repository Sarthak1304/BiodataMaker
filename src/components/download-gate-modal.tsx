"use client";

import { signIn } from "next-auth/react";
import { Lock } from "lucide-react";
import { GoogleIcon } from "@/components/auth/google-icon";

export function DownloadGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-foreground/45" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[480px] rounded-t-[24px] bg-background px-6 pb-8 pt-7 shadow-[0_-12px_40px_rgba(42,33,25,.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-[38px] rounded-full bg-border" />
        <div className="mx-auto mb-[18px] flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
          <Lock size={22} strokeWidth={1.8} className="text-primary-foreground" />
        </div>
        <h2 className="font-display mb-2 text-center text-[22px] font-semibold text-primary">
          Sign in to download
        </h2>
        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-muted-foreground">
          Create a free account to download your biodata as a PDF, keep it saved, and edit it anytime.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/create/preview" })}
          className="mb-3.5 flex w-full items-center justify-center gap-2.5 rounded-md border-[1.5px] border-border bg-card py-3.5 text-[15px] font-medium text-foreground"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <div className="flex items-center justify-center gap-4">
          <button onClick={onClose} className="py-3.5 text-[13.5px] font-medium text-muted-foreground">
            Maybe later
          </button>
          <span className="text-border">|</span>
          <a href="/create/template?from=/create/preview" className="py-3.5 text-[13.5px] font-semibold text-primary">
            Try a different template
          </a>
        </div>
      </div>
    </div>
  );
}
