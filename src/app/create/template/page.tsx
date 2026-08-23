"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { useDraftStore } from "@/lib/draft-store";
import { TemplateId, TEMPLATES } from "@/types/biodata";
import { cn } from "@/lib/utils";

function PickTemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/create/personal";
  const templateId = useDraftStore((s) => s.draft.templateId);
  const setTemplate = useDraftStore((s) => s.setTemplate);
  const selected = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const isSwitching = searchParams.has("from");

  function choose(id: TemplateId) {
    setTemplate(id);
    if (isSwitching) router.push(returnTo);
  }

  return (
    <MobileShell wide>
      <TopBar
        right={
          <span className="text-[12.5px] text-ink-300">{isSwitching ? "Switch template" : "Before you begin"}</span>
        }
      />

      <div className="px-5 pt-[18px] lg:px-8">
        <h1 className="font-display mb-1.5 text-[26px] font-semibold text-maroon-900">Pick a look to start with</h1>
        <p className="mb-5 text-[13.5px] text-ink-500">
          Your biodata will preview in this style as you fill it in — switch anytime.
        </p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          {TEMPLATES.map((t) => {
            const isSelected = t.id === templateId;
            return (
              <motion.button
                key={t.id}
                variants={{ hidden: { opacity: 0, y: 14, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
                whileHover={t.available ? { y: -3, scale: 1.02 } : undefined}
                whileTap={t.available ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.25, ease: "easeOut" }}
                disabled={!t.available}
                onClick={() => choose(t.id)}
                className={cn(
                  "relative rounded-xl border-[1.5px] bg-white p-2 text-left shadow-sm transition-shadow disabled:opacity-45",
                  isSelected ? "border-gold-500 border-[2.5px] shadow-md" : "border-border hover:shadow-md"
                )}
              >
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute right-3.5 top-3.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500"
                  >
                    <Check size={11} strokeWidth={3} className="text-maroon-900" />
                  </motion.span>
                )}
                <div className="relative aspect-[210/297] overflow-hidden rounded-md bg-ivory-50 p-2.5">
                  <TemplateThumb id={t.id} />
                </div>
                <p className="mt-2 mb-0.5 text-center text-[12.5px] font-semibold text-ink-900">{t.name}</p>
                {!t.available && (
                  <p className="pb-1 text-center text-[10.5px] text-ink-300">Coming soon</p>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-7 border-t border-border bg-ivory-50 px-5 py-4 lg:px-8">
        <Button onClick={() => router.push(returnTo)} className="lg:mx-auto lg:block lg:w-64">
          {isSwitching ? `Use ${selected.name}` : `Start with ${selected.name}`}
        </Button>
      </div>
    </MobileShell>
  );
}

export default function PickTemplatePage() {
  return (
    <Suspense fallback={null}>
      <PickTemplateContent />
    </Suspense>
  );
}

function TemplateThumb({ id }: { id: string }) {
  if (id === "modern-minimal") {
    return (
      <div className="absolute inset-0 bg-white p-3">
        <div className="mb-2 h-0.5 w-[18px] bg-ink-900" />
        <div className="text-[8px] font-bold tracking-[0.03em] text-ink-900">KAVYA REDDY</div>
        <div className="mt-2 text-[5px] leading-loose text-ink-300">
          Personal
          <br />
          Education
          <br />
          Contact
        </div>
      </div>
    );
  }
  if (id === "royal-rajasthani") {
    return (
      <div className="absolute inset-0 bg-[#FBF3E7] p-2.5">
        <div className="absolute inset-1 rounded-sm border-2 border-[#A8863A]" />
        <div className="absolute inset-2 rounded-sm border border-[#A8863A]" />
        <div className="relative pt-5 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full bg-[#8B2E4E]/25" />
          <div className="font-display text-[8.5px] font-bold text-[#7A1F3D]">Rohan Singh</div>
          <div className="mt-1 text-[5px] tracking-[0.1em] text-[#A8863A]">RAJPUT · JAIPUR</div>
        </div>
      </div>
    );
  }
  if (id === "elegant-ivory-gold") {
    return (
      <div className="absolute inset-0 bg-[#FDFBF6] p-3">
        <div className="mb-2 h-px bg-gold-500" />
        <div className="font-display text-[9px] font-semibold text-[#3A332B]">Meera Iyer</div>
        <div className="mt-2 h-px w-full bg-gold-500" />
        <div className="mt-2 text-[5px] leading-loose text-ink-300">About · Family · Career</div>
      </div>
    );
  }
  if (id === "professional") {
    return (
      <div className="absolute inset-0 bg-[#F7F8FA] p-3">
        <div className="text-[8px] font-bold text-navy-700">ARJUN NAIR</div>
        <div className="my-1.5 h-0.5 w-full bg-navy-500" />
        <div className="text-[5px] leading-loose tracking-[0.05em] text-ink-300">
          PROFILE · EXPERIENCE
          <br />
          EDUCATION · CONTACT
        </div>
      </div>
    );
  }
  if (id === "pastel-contemporary") {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#FCEFE9] to-[#F3F6EE] p-3">
        <div className="mb-2 h-[22px] w-[22px] rounded-md bg-sage-500/30" />
        <div className="font-display text-[9px] font-semibold text-[#5A4E45]">Sneha Verma</div>
        <div className="mt-2 text-[5px] leading-loose text-ink-300">
          About Me · Family
          <br />
          Looking For
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-1.5 rounded-[4px] border border-gold-500" />
      <div className="relative pt-4 text-center">
        <div className="mx-auto mb-1.5 h-7 w-7 rounded-full bg-ivory-200" />
        <div className="font-display text-[9px] font-semibold text-maroon-900">Priya Kapoor</div>
        <div className="mx-auto my-1 h-px w-[26px] bg-gold-500" />
        <div className="text-[5.5px] leading-loose text-ink-300">
          PERSONAL DETAILS
          <br />
          FAMILY DETAILS
          <br />
          EDUCATION
        </div>
      </div>
    </div>
  );
}
