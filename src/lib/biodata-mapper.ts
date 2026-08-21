import { BiodataData, TemplateId } from "@/types/biodata";

/**
 * Prisma returns JSON columns as loosely-typed values. This maps a raw
 * Biodata row (from `/api/biodata`) into the concrete `BiodataData` shape
 * the rest of the app (forms, templates, PDF) is built around.
 */
export function mapDbBiodata(row: Record<string, unknown>): BiodataData & { id: string } {
  return {
    id: row.id as string,
    templateId: row.templateId as TemplateId,
    personal: row.personal as BiodataData["personal"],
    family: row.family as BiodataData["family"],
    education: row.education as BiodataData["education"],
    astro: row.astro as BiodataData["astro"],
    contact: row.contact as BiodataData["contact"],
    partnerPreference: row.partnerPreference as BiodataData["partnerPreference"],
    photoUrl: (row.photoUrl as string | null) ?? null,
    photoShape: (row.photoShape as "circle" | "square") ?? "circle",
    additionalPhotos: (row.additionalPhotos as string[] | null) ?? [],
    isPublic: Boolean(row.isPublic),
  };
}
