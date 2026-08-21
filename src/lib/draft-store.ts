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
  reset: () => void;
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
