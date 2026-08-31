"use client";

import { useState } from "react";
import { Field, Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { useDraftStore } from "@/lib/draft-store";
import { Diet, Gender, MaritalStatus } from "@/types/biodata";

const GENDERS: { value: Gender; label: string }[] = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
];

const MARITAL: { value: MaritalStatus; label: string }[] = [
  { value: "never-married", label: "Never Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

const DIETS: { value: Diet; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-Vegetarian" },
  { value: "eggetarian", label: "Eggetarian" },
  { value: "vegan", label: "Vegan" },
];

const DEFAULT_HOBBIES = ["Traveling", "Reading", "Cooking", "Music", "Yoga & Fitness", "Dancing"];

export function PersonalStep() {
  const personal = useDraftStore((s) => s.draft.personal);
  const update = useDraftStore((s) => s.updatePersonal);
  const [customHobby, setCustomHobby] = useState("");
  const [addingHobby, setAddingHobby] = useState(false);

  const hobbyOptions = Array.from(new Set([...DEFAULT_HOBBIES, ...personal.hobbies]));

  function toggleHobby(hobby: string) {
    const has = personal.hobbies.includes(hobby);
    update({ hobbies: has ? personal.hobbies.filter((h) => h !== hobby) : [...personal.hobbies, hobby] });
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Full Name">
        <Input
          placeholder="e.g. Ananya Sharma"
          value={personal.fullName}
          onChange={(e) => update({ fullName: e.target.value })}
        />
      </Field>

      <div className="flex gap-3">
        <Field label="Date of Birth" className="flex-1">
          <Input type="date" value={personal.dateOfBirth} onChange={(e) => update({ dateOfBirth: e.target.value })} />
        </Field>
        <Field label="Height" className="flex-1">
          <Input placeholder={`5' 4"`} value={personal.height} onChange={(e) => update({ height: e.target.value })} />
        </Field>
      </div>

      <div className="flex gap-3">
        <Field label="Time of Birth" className="flex-1">
          <Input type="time" value={personal.timeOfBirth} onChange={(e) => update({ timeOfBirth: e.target.value })} />
        </Field>
        <Field label="Place of Birth" className="flex-1">
          <Input
            placeholder="e.g. Jaipur"
            value={personal.placeOfBirth}
            onChange={(e) => update({ placeOfBirth: e.target.value })}
          />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-foreground">Gender</p>
        <div className="flex gap-2.5">
          {GENDERS.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={personal.gender === g.value}
              onClick={() => update({ gender: g.value })}
              className="flex-1"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-foreground">Marital Status</p>
        <div className="flex flex-wrap gap-2">
          {MARITAL.map((m) => (
            <Chip
              key={m.value}
              label={m.label}
              selected={personal.maritalStatus === m.value}
              onClick={() => update({ maritalStatus: m.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-foreground">Diet</p>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <Chip
              key={d.value}
              label={d.label}
              tone="sage"
              selected={personal.diet === d.value}
              onClick={() => update({ diet: d.value })}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Field label="Mother Tongue" className="flex-1">
          <Input
            placeholder="e.g. Hindi"
            value={personal.motherTongue}
            onChange={(e) => update({ motherTongue: e.target.value })}
          />
        </Field>
        <Field label="Blood Group" className="flex-1">
          <Input
            placeholder="e.g. B+"
            value={personal.bloodGroup}
            onChange={(e) => update({ bloodGroup: e.target.value })}
          />
        </Field>
      </div>

      <div className="flex gap-3">
        <Field label="Native Village / Town" className="flex-1">
          <Input
            placeholder="e.g. Palakkad, Kerala"
            value={personal.nativePlace}
            onChange={(e) => update({ nativePlace: e.target.value })}
          />
        </Field>
        <Field label="Complexion" className="flex-1">
          <Input
            placeholder="e.g. Wheatish"
            value={personal.complexion}
            onChange={(e) => update({ complexion: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Languages Known">
        <Input
          placeholder="e.g. Hindi, English, Malayalam"
          value={personal.languagesKnown}
          onChange={(e) => update({ languagesKnown: e.target.value })}
        />
      </Field>

      <div>
        <p className="mb-2 text-[12.5px] font-medium text-foreground">Hobbies &amp; Interests</p>
        <div className="flex flex-wrap gap-2">
          {hobbyOptions.map((h) => (
            <Chip key={h} label={h} selected={personal.hobbies.includes(h)} onClick={() => toggleHobby(h)} />
          ))}
          {addingHobby ? (
            <Input
              autoFocus
              className="w-32 !py-2 text-[13px]"
              value={customHobby}
              onChange={(e) => setCustomHobby(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customHobby.trim()) {
                  toggleHobby(customHobby.trim());
                  setCustomHobby("");
                  setAddingHobby(false);
                }
              }}
              onBlur={() => setAddingHobby(false)}
              placeholder="Type & Enter"
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddingHobby(true)}
              className="rounded-full border-[1.5px] border-dashed border-muted-foreground/40 px-4 py-3.5 text-[13px] text-muted-foreground"
            >
              + Add more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
