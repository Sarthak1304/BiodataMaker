"use client";

import { Field, Input, Textarea } from "@/components/ui/input";
import { useDraftStore } from "@/lib/draft-store";

export function FamilyStep() {
  const family = useDraftStore((s) => s.draft.family);
  const update = useDraftStore((s) => s.updateFamily);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <Field label="Father's Name" className="flex-1">
          <Input value={family.fatherName} onChange={(e) => update({ fatherName: e.target.value })} />
        </Field>
        <Field label="Father's Occupation" className="flex-1">
          <Input value={family.fatherOccupation} onChange={(e) => update({ fatherOccupation: e.target.value })} />
        </Field>
      </div>
      <div className="flex gap-3">
        <Field label="Mother's Name" className="flex-1">
          <Input value={family.motherName} onChange={(e) => update({ motherName: e.target.value })} />
        </Field>
        <Field label="Mother's Occupation" className="flex-1">
          <Input value={family.motherOccupation} onChange={(e) => update({ motherOccupation: e.target.value })} />
        </Field>
      </div>
      <Field label="Siblings">
        <Input
          placeholder="e.g. One younger brother"
          value={family.siblings}
          onChange={(e) => update({ siblings: e.target.value })}
        />
      </Field>
      <Field label="Family Type">
        <Input
          placeholder="e.g. Nuclear / Joint"
          value={family.familyType}
          onChange={(e) => update({ familyType: e.target.value })}
        />
      </Field>
      <Field label="Family Values">
        <Textarea
          rows={3}
          placeholder="e.g. Traditional yet open-minded"
          value={family.familyValues}
          onChange={(e) => update({ familyValues: e.target.value })}
        />
      </Field>
    </div>
  );
}
