"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
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

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const isSelected = t.id === templateId;
            return (
              <button
                key={t.id}
                disabled={!t.available}
                onClick={() => choose(t.id)}
                className={cn(
                  "relative rounded-lg border-[1.5px] bg-white p-2 text-left disabled:opacity-45",
                  isSelected ? "border-gold-500 border-[2.5px]" : "border-border"
                )}
              >
                {isSelected && (
                  <span className="absolute right-3.5 top-3.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500">
                    <Check size={11} strokeWidth={3} className="text-maroon-900" />
                  </span>
                )}
                <div className="relative aspect-[210/297] overflow-hidden rounded-md bg-ivory-50 p-2.5">
                  <TemplateThumb id={t.id} />
                </div>
                <p className="mt-2 mb-0.5 text-center text-[12.5px] font-semibold text-ink-900">{t.name}</p>
                {!t.available && (
                  <p className="pb-1 text-center text-[10.5px] text-ink-300">Coming soon</p>
                )}
              </button>
            );
          })}
        </div>
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
  if (id === "peacock-motif") {
    return (
      <div
        className="absolute inset-0 p-3"
        style={{ background: "radial-gradient(circle at 15% 10%,#0F6B5C,#0A4A40 60%,#083A32)" }}
      >
        <div className="relative pt-6 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full border border-[#D9B84A] bg-[#D9B84A]/25" />
          <div className="font-display text-[9px] font-semibold text-[#F3E9C9]">Divya Chauhan</div>
          <div className="mx-auto mt-1 h-px w-[22px] bg-[#D9B84A]" />
        </div>
      </div>
    );
  }
  if (id === "marigold-vermilion") {
    return (
      <div className="absolute inset-0 bg-[#FFF7ED] p-3">
        <div className="mb-2 flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-[#E2661B]/60" />
          ))}
        </div>
        <div className="pt-4 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full bg-[#FBE0C7]" />
          <div className="font-display text-[9px] font-semibold text-[#9A3B12]">Neha Joshi</div>
          <div className="mt-1 text-[5px] tracking-[0.08em] text-[#C77531]">FESTIVE · WARM</div>
        </div>
      </div>
    );
  }
  if (id === "kalamkari-print") {
    return (
      <div className="absolute inset-0 bg-[#F4ECDC] p-3">
        <div className="absolute inset-1.5 rounded-sm border-2 border-[#8B4A2B]" />
        <div className="relative pt-5 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full bg-[#E4D2B0]" />
          <div className="font-display text-[9px] font-semibold text-[#5C3A1E]">Aditi Rao</div>
          <div className="mt-1 text-[5px] tracking-[0.06em] text-[#2E4057]">HERITAGE PRINT</div>
        </div>
      </div>
    );
  }
  if (id === "sacred-mandala") {
    return (
      <div className="absolute inset-0 bg-[#FFF8ED] p-3">
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C77B2C]/30" />
        <div className="relative pt-5 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full border border-[#C77B2C] bg-[#FBE7C7]" />
          <div className="font-display text-[9px] font-semibold text-[#7A4A12]">Ishaan Verma</div>
          <div className="mt-1 text-[5px] tracking-[0.08em] text-[#C77B2C]">HOROSCOPE INCLUDED</div>
        </div>
      </div>
    );
  }
  if (id === "south-indian-temple") {
    return (
      <div className="absolute inset-0 bg-[#FBF1E7]">
        <div className="h-3 bg-maroon-700" style={{ clipPath: "polygon(0 100%,10% 30%,20% 60%,35% 0,50% 50%,65% 0,80% 60%,90% 30%,100% 100%)" }} />
        <div className="pt-3 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full bg-[#F0DCC0]" />
          <div className="font-display text-[9px] font-semibold text-maroon-700">Lakshmi N.</div>
          <div className="mt-1 text-[5px] tracking-[0.08em] text-gold-700">TEMPLE BORDER</div>
        </div>
      </div>
    );
  }
  if (id === "bengali-alpana") {
    return (
      <div className="absolute inset-0 bg-[#8E1B2C] p-2.5">
        <div className="mt-3 rounded-md bg-[#FDF6E9] p-2.5 text-center">
          <div className="mx-auto mb-1.5 h-5 w-5 rounded-full bg-[#F3D9D9]" />
          <div className="font-display text-[8.5px] font-semibold text-[#8E1B2C]">Ritwika Sen</div>
          <div className="mt-1 text-[5px] tracking-[0.06em] text-[#B3543F]">ALPANA BORDER</div>
        </div>
      </div>
    );
  }
  if (id === "photo-forward") {
    return (
      <div className="absolute inset-0 bg-[#22201D]">
        <div className="flex h-[62%] items-center justify-center bg-gradient-to-br from-[#4A4340] to-[#22201D]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#9C917F" strokeWidth="1.2" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="#9C917F" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="p-2.5">
          <div className="font-display text-[9px] font-semibold text-[#FBF7EE]">Karan Bhatt, 29</div>
          <div className="mt-1 text-[5px] tracking-[0.08em] text-[#C9BFB2]">EDITORIAL · CHARCOAL</div>
        </div>
      </div>
    );
  }
  if (id === "floral-watercolor") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#FFFDFB] p-3">
        <div className="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-[#F3D3DE] opacity-70 blur-[3px]" />
        <div className="absolute -bottom-3 -right-2 h-11 w-11 rounded-full bg-[#DCE9F7] opacity-60 blur-[3px]" />
        <div className="relative pt-5 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full bg-[#F6E4EA]" />
          <div className="font-display text-[9px] font-semibold text-[#7A5468]">Simran Kaur</div>
          <div className="mt-1 text-[5px] tracking-[0.08em] text-[#A17E96]">SOFT · ROMANTIC</div>
        </div>
      </div>
    );
  }
  if (id === "indo-deco") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#12141A] p-3">
        <div className="absolute left-0 top-0 h-0 w-0 border-b-[16px] border-l-[16px] border-b-transparent border-l-gold-500/50" />
        <div className="absolute right-0 top-0 h-0 w-0 border-b-[16px] border-r-[16px] border-b-transparent border-r-gold-500/50" />
        <div className="relative pt-5 text-center">
          <div className="mx-auto mb-1.5 h-6 w-6 rounded-full border border-gold-500 bg-gold-500/20" />
          <div className="font-display text-[9px] font-semibold text-gold-100">Aryan Kapoor</div>
          <div className="mt-1 text-[5px] tracking-[0.1em] text-gold-500">ART-DECO LUXE</div>
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
