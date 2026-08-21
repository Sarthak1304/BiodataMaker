"use client";

import { Field, Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { useDraftStore } from "@/lib/draft-store";
import { ManglikStatus } from "@/types/biodata";

const MANGLIK: { value: ManglikStatus; label: string }[] = [
  { value: "manglik", label: "Manglik" },
  { value: "non-manglik", label: "Non-Manglik" },
  { value: "unsure", label: "Not Sure" },
];

export function AstroStep() {
  const astro = useDraftStore((s) => s.draft.astro);
  const update = useDraftStore((s) => s.updateAstro);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Field label="Religion" className="flex-1">
          <Input placeholder="e.g. Hindu" value={astro.religion} onChange={(e) => update({ religion: e.target.value })} />
        </Field>
        <Field label="Caste" className="flex-1">
          <Input placeholder="e.g. Brahmin" value={astro.caste} onChange={(e) => update({ caste: e.target.value })} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Sub-caste" className="flex-1">
          <Input value={astro.subCaste} onChange={(e) => update({ subCaste: e.target.value })} />
        </Field>
        <Field label="Gotra" className="flex-1">
          <Input value={astro.gotra} onChange={(e) => update({ gotra: e.target.value })} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Nakshatra" className="flex-1">
          <Input value={astro.nakshatra} onChange={(e) => update({ nakshatra: e.target.value })} />
        </Field>
        <Field label="Rashi" className="flex-1">
          <Input value={astro.rashi} onChange={(e) => update({ rashi: e.target.value })} />
        </Field>
      </div>
      <div>
        <p className="mb-2 text-[12.5px] font-medium text-ink-700">Manglik Status</p>
        <div className="flex flex-wrap gap-2">
          {MANGLIK.map((m) => (
            <Chip
              key={m.value}
              label={m.label}
              tone="sage"
              selected={astro.manglikStatus === m.value}
              onClick={() => update({ manglikStatus: m.value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
