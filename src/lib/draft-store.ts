"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  BiodataData,
  EMPTY_BIODATA,
  TemplateId,
  AstroDetails,
  ContactDetails,
  EducationCareer,
  FamilyDetails,
  PartnerPreference,
  PersonalDetails,
} from "@/types/biodata";

interface DraftState {
  draft: BiodataData;
  savedBiodataId: string | null;
  setTemplate: (templateId: TemplateId) => void;
  updatePersonal: (patch: Partial<PersonalDetails>) => void;
  updateFamily: (patch: Partial<FamilyDetails>) => void;
  updateEducation: (patch: Partial<EducationCareer>) => void;
  updateAstro: (patch: Partial<AstroDetails>) => void;
  updateContact: (patch: Partial<ContactDetails>) => void;
  updatePreference: (patch: Partial<PartnerPreference>) => void;
  setPhoto: (url: string | null) => void;
  setPhotoShape: (shape: "circle" | "square") => void;
  setAdditionalPhotos: (urls: string[]) => void;
  setSavedBiodataId: (id: string | null) => void;
  loadBiodata: (biodata: BiodataData & { id: string }) => void;
  hydrateFromExtraction: (extracted: {
    personal?: Record<string, unknown>;
    family?: Record<string, unknown>;
    education?: Record<string, unknown>;
    astro?: Record<string, unknown>;
    contact?: Record<string, unknown>;
  }) => void;
  reset: () => void;
}

/** Merges only the non-empty extracted values on top of the current section, so a field the model left blank never overwrites something the user already typed. */
function mergeNonEmpty<T extends object>(current: T, incoming?: Record<string, unknown>): T {
  if (!incoming) return current;
  const next = { ...current } as Record<string, unknown>;
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    next[key] = value;
  }
  return next as T;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: EMPTY_BIODATA,
      savedBiodataId: null,
      setTemplate: (templateId) =>
        set((s) => ({ draft: { ...s.draft, templateId } })),
      updatePersonal: (patch) =>
        set((s) => ({ draft: { ...s.draft, personal: { ...s.draft.personal, ...patch } } })),
      updateFamily: (patch) =>
        set((s) => ({ draft: { ...s.draft, family: { ...s.draft.family, ...patch } } })),
      updateEducation: (patch) =>
        set((s) => ({ draft: { ...s.draft, education: { ...s.draft.education, ...patch } } })),
      updateAstro: (patch) =>
        set((s) => ({ draft: { ...s.draft, astro: { ...s.draft.astro, ...patch } } })),
      updateContact: (patch) =>
        set((s) => ({ draft: { ...s.draft, contact: { ...s.draft.contact, ...patch } } })),
      updatePreference: (patch) =>
        set((s) => ({
          draft: { ...s.draft, partnerPreference: { ...s.draft.partnerPreference, ...patch } },
        })),
      setPhoto: (url) => set((s) => ({ draft: { ...s.draft, photoUrl: url } })),
      setPhotoShape: (shape) => set((s) => ({ draft: { ...s.draft, photoShape: shape } })),
      setAdditionalPhotos: (urls) => set((s) => ({ draft: { ...s.draft, additionalPhotos: urls } })),
      setSavedBiodataId: (id) =>
        set((s) => ({ savedBiodataId: id, draft: { ...s.draft, id: id ?? undefined } })),
      loadBiodata: (biodata) => set({ draft: biodata, savedBiodataId: biodata.id }),
      hydrateFromExtraction: (extracted) =>
        set((s) => ({
          draft: {
            ...s.draft,
            personal: mergeNonEmpty(s.draft.personal, extracted.personal),
            family: mergeNonEmpty(s.draft.family, extracted.family),
            education: mergeNonEmpty(s.draft.education, extracted.education),
            astro: mergeNonEmpty(s.draft.astro, extracted.astro),
            contact: mergeNonEmpty(s.draft.contact, extracted.contact),
          },
        })),
      reset: () => set({ draft: EMPTY_BIODATA, savedBiodataId: null }),
    }),
    {
      name: "biodatamatcher-draft",
      // Guest/in-progress data only lives for this browser session — it's
      // not meant to be a permanent store. Real persistence only happens
      // once a user is signed in and it's saved to their account (DB).
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
