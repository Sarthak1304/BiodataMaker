"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/auth/google-icon";
import { LogoMark } from "@/components/layout/logo";

function AuthContent() {
  const router = useRouter();
  const { status } = useSession();
  const params = useSearchParams();
  const paramCallbackUrl = params.get("callbackUrl");
  // Signing in should land on the dashboard by default; staying a guest
  // should never be routed there (it requires auth), so it falls back to
  // the start flow instead unless the link explicitly says otherwise.
  const signInCallbackUrl = paramCallbackUrl ?? "/dashboard";
  const guestCallbackUrl = paramCallbackUrl ?? "/start";

  // Already signed in? Don't show sign-in options again — go straight to
  // wherever this link was pointing.
  useEffect(() => {
    if (status === "authenticated") router.replace(signInCallbackUrl);
  }, [status, router, signInCallbackUrl]);

  if (status === "authenticated") return null;

  return (
    <MobileShell>
      <TopBar />

      <div className="flex flex-col items-center px-7 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-[22px]"
        >
          <LogoMark size={56} />
        </motion.div>
        <h1 className="font-display mb-2 text-center text-[27px] font-semibold text-maroon-900">
          Welcome to BiodataMatcher
        </h1>
        <p className="mb-9 max-w-[290px] text-center text-[14px] leading-relaxed text-ink-500">
          Sign in to save your biodata, download it as a PDF, and connect with other members.
        </p>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mb-4 w-full">
          <Button
            variant="secondary"
            size="block"
            className="flex items-center justify-center gap-2.5"
            onClick={() => signIn("google", { callbackUrl: signInCallbackUrl })}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </motion.div>

        <div className="my-1.5 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[12px] text-ink-300">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          onClick={() => router.push(guestCallbackUrl)}
          className="mb-6 w-full rounded-md border-[1.5px] border-border py-3.5 text-[15px] font-medium text-ink-700"
        >
          Continue as Guest
        </button>

        <div className="flex w-full items-start gap-2.5 rounded-md bg-sage-100 p-4">
          <Info size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sage-700" />
          <p className="text-[12.5px] leading-relaxed text-sage-700">
            As a guest you can build and preview a biodata, but you can&apos;t <strong>download</strong> it,{" "}
            <strong>browse other members</strong>, or <strong>send messages</strong>. Sign in anytime to unlock
            these.
          </p>
        </div>
      </div>

      <p className="px-6 py-8 text-center text-[11.5px] text-ink-300">
        By continuing you agree to our{" "}
        <a href="#" className="text-ink-500 underline">
          Terms
        </a>{" "}
        &amp;{" "}
        <a href="#" className="text-ink-500 underline">
          Privacy Policy
        </a>
      </p>
    </MobileShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
}
