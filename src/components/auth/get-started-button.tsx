"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/auth/google-icon";

export function GetStartedButton() {
  return (
    <Button
      className="mb-3 flex items-center justify-center gap-2.5"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      <GoogleIcon size={18} />
      Get Started with Google
    </Button>
  );
}
