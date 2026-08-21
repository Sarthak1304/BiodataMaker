"use client";

import { Field, Input, Textarea } from "@/components/ui/input";
import { useDraftStore } from "@/lib/draft-store";

export function PreferenceStep() {
  const pref = useDraftStore((s) => s.draft.partnerPreference);
  const update = useDraftStore((s) => s.updatePreference);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Field label="Age Range" className="flex-1">
          <Input placeholder="e.g. 27–32" value={pref.ageRange} onChange={(e) => update({ ageRange: e.target.value })} />
        </Field>
        <Field label="Height Range" className="flex-1">
          <Input
            placeholder={`e.g. 5'6"–6'0"`}
            value={pref.heightRange}
            onChange={(e) => update({ heightRange: e.target.value })}
          />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Religion" className="flex-1">
          <Input value={pref.religion} onChange={(e) => update({ religion: e.target.value })} />
        </Field>
        <Field label="Caste" className="flex-1">
          <Input value={pref.caste} onChange={(e) => update({ caste: e.target.value })} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Education" className="flex-1">
          <Input value={pref.education} onChange={(e) => update({ education: e.target.value })} />
        </Field>
        <Field label="Profession" className="flex-1">
          <Input value={pref.profession} onChange={(e) => update({ profession: e.target.value })} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Location" className="flex-1">
          <Input value={pref.location} onChange={(e) => update({ location: e.target.value })} />
        </Field>
        <Field label="Marital Status" className="flex-1">
          <Input value={pref.maritalStatus} onChange={(e) => update({ maritalStatus: e.target.value })} />
        </Field>
      </div>
      <Field label="Anything else you'd like to add">
        <Textarea rows={3} value={pref.freeText} onChange={(e) => update({ freeText: e.target.value })} />
      </Field>
    </div>
  );
}
