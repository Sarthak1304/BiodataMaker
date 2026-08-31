"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { FORM_STEPS, FormStepKey, TEMPLATES } from "@/types/biodata";
import { useDraftStore } from "@/lib/draft-store";
import { cn } from "@/lib/utils";

export function FormStepShell({
  stepKey,
  mode,
  children,
}: {
  stepKey: FormStepKey;
  mode: "edit" | "preview";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const draft = useDraftStore((s) => s.draft);
  const template = TEMPLATES.find((t) => t.id === draft.templateId);
  const stepIndex = FORM_STEPS.findIndex((s) => s.key === stepKey);
  const step = FORM_STEPS[stepIndex];
  const prevStep = FORM_STEPS[stepIndex - 1];
  const nextStep = FORM_STEPS[stepIndex + 1];

  return (
    <div>
      <TopBar right={<span className="text-[12.5px] text-muted-foreground">{stepIndex + 1} of {FORM_STEPS.length}</span>} />

      <div className="lg:flex lg:items-start lg:gap-10 lg:px-8 lg:pt-2">
        <div className="lg:min-w-0 lg:flex-1">
          <div className="px-5 pt-4 lg:px-0">
            <div className="mb-3.5 flex rounded-full border border-border bg-card p-1 lg:hidden">
              <Link
                href={`/create/${stepKey}`}
                className={cn(
                  "flex-1 rounded-full py-3.5 text-center text-[13px]",
                  mode === "edit" ? "bg-primary font-semibold text-primary-foreground" : "font-medium text-muted-foreground"
                )}
              >
                Edit
              </Link>
              <Link
                href={`/create/${stepKey}?mode=preview`}
                className={cn(
                  "flex-1 rounded-full py-3.5 text-center text-[13px]",
                  mode === "preview" ? "bg-primary font-semibold text-primary-foreground" : "font-medium text-muted-foreground"
                )}
              >
                Preview
              </Link>
            </div>

            <div className="mb-[18px] flex items-center justify-between">
              <Link href={`/create/template?from=/create/${stepKey}`}>
                <Badge label={template?.name ?? "Traditional Floral"} tone="gold" />
              </Link>
              <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:flex">
                <Clock size={12} strokeWidth={1.6} />
                Preview updates as you type
              </span>
            </div>

            <div className="mb-[22px] flex gap-1.5">
              {FORM_STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className={cn("h-1 flex-1 rounded-full", i <= stepIndex ? "bg-primary" : "bg-border")}
                />
              ))}
            </div>

            <div className="no-scrollbar mb-[18px] flex gap-2 overflow-x-auto pb-1">
              {FORM_STEPS.map((s, i) => (
                <Link
                  key={s.key}
                  href={`/create/${s.key}`}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-3 text-[12px]",
                    i === stepIndex
                      ? "bg-primary font-semibold text-primary-foreground"
                      : i < stepIndex
                      ? "border border-border text-foreground"
                      : "border border-border text-muted-foreground"
                  )}
                >
                  {s.label}
                </Link>
              ))}
            </div>

            {/* Edit form: always visible on desktop; toggled by mode on mobile */}
            <div className={cn(mode === "preview" && "hidden lg:block")}>
              <h1 className="font-display mb-1 text-[25px] font-semibold text-primary">{step.title}</h1>
              <p className="mb-6 text-[13.5px] text-muted-foreground">{step.subtitle}</p>
              {children}
            </div>

            {/* Preview: mobile-only, shown when toggled; desktop has its own sticky panel instead */}
            <div className={cn("lg:hidden", mode === "preview" ? "block" : "hidden")}>
              <TemplateRenderer data={draft} />
            </div>
          </div>

          <div className="mt-7 flex gap-3 border-t border-border bg-muted px-5 py-5 lg:px-0">
            <Button
              variant="secondary"
              size="default"
              className="flex-none basis-24"
              onClick={() => (prevStep ? router.push(`/create/${prevStep.key}`) : router.push("/create/template"))}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                nextStep ? router.push(`/create/${nextStep.key}`) : router.push("/create/preview")
              }
            >
              {nextStep ? `Next: ${nextStep.label}` : "See Full Preview"}
            </Button>
          </div>
        </div>

        <div className="hidden lg:sticky lg:top-6 lg:block lg:w-[380px] lg:shrink-0 lg:self-start lg:pb-10">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Live Preview</p>
          <TemplateRenderer data={draft} />
        </div>
      </div>
    </div>
  );
}
