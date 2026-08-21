"use client";

import { Field, Input } from "@/components/ui/input";
import { useDraftStore } from "@/lib/draft-store";

export function EducationStep() {
  const education = useDraftStore((s) => s.draft.education);
  const update = useDraftStore((s) => s.updateEducation);

  return (
    <div className="flex flex-col gap-4">
      <Field label="Highest Qualification">
        <Input
          placeholder="e.g. M.Tech, Computer Science"
          value={education.highestQualification}
          onChange={(e) => update({ highestQualification: e.target.value })}
        />
      </Field>
      <Field label="Institution">
        <Input
          placeholder="e.g. IIT Bombay"
          value={education.institution}
          onChange={(e) => update({ institution: e.target.value })}
        />
      </Field>
      <Field label="Occupation">
        <Input
          placeholder="e.g. Software Engineer"
          value={education.occupation}
          onChange={(e) => update({ occupation: e.target.value })}
        />
      </Field>
      <Field label="Company">
        <Input
          placeholder="e.g. a product company, Bengaluru"
          value={education.companyName}
          onChange={(e) => update({ companyName: e.target.value })}
        />
      </Field>
      <Field label="Annual Income (optional)">
        <Input
          placeholder="e.g. ₹18 LPA"
          value={education.annualIncome}
          onChange={(e) => update({ annualIncome: e.target.value })}
        />
      </Field>
    </div>
  );
}
