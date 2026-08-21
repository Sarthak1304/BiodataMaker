"use client";

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/layout/mobile-shell";
import { FormStepShell } from "@/components/form/form-step-shell";
import { PersonalStep } from "@/components/form/steps/personal-step";
import { FamilyStep } from "@/components/form/steps/family-step";
import { EducationStep } from "@/components/form/steps/education-step";
import { AstroStep } from "@/components/form/steps/astro-step";
import { ContactStep } from "@/components/form/steps/contact-step";
import { PhotoStep } from "@/components/form/steps/photo-step";
import { FORM_STEPS, FormStepKey } from "@/types/biodata";

const STEP_COMPONENTS: Record<FormStepKey, () => JSX.Element> = {
  personal: PersonalStep,
  family: FamilyStep,
  education: EducationStep,
  astro: AstroStep,
  contact: ContactStep,
  photo: PhotoStep,
};

function StepPageContent({ step }: { step: string }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "preview" ? "preview" : "edit";

  if (!FORM_STEPS.some((s) => s.key === step)) notFound();
  const stepKey = step as FormStepKey;
  const StepComponent = STEP_COMPONENTS[stepKey];

  return (
    <MobileShell wide>
      <FormStepShell stepKey={stepKey} mode={mode}>
        <StepComponent />
      </FormStepShell>
    </MobileShell>
  );
}

export default function StepPage({ params }: { params: { step: string } }) {
  return (
    <Suspense fallback={null}>
      <StepPageContent step={params.step} />
    </Suspense>
  );
}
