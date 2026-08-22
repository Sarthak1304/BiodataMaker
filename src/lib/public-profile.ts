/**
 * Shapes a full Biodata DB row into the redacted, public-safe subset shown
 * in Discover and Profile Detail. This is the single choke point that
 * decides what other members can ever see about someone — phone, email,
 * full address, and Instagram handle must never pass through here.
 */

function calculateAge(dateOfBirth: string | undefined): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export interface PublicProfileCard {
  id: string;
  userId: string;
  fullName: string;
  age: number | null;
  height: string;
  religion: string;
  caste: string;
  occupation: string;
  city: string;
  photoUrl: string | null;
  photoShape: "circle" | "square";
  verified: boolean;
}

export interface PublicProfileDetail extends PublicProfileCard {
  templateId: string;
  maritalStatus: string;
  education: string;
  company: string;
  state: string;
  diet: string;
  manglikStatus: string;
  hobbies: string[];
  about: string;
  family: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: string;
    nativePlace: string;
  };
}

export function toPublicCard(row: Record<string, any>): PublicProfileCard {
  const personal = row.personal ?? {};
  const astro = row.astro ?? {};
  const education = row.education ?? {};
  const contact = row.contact ?? {};

  return {
    id: row.id,
    userId: row.userId,
    fullName: personal.fullName || "Member",
    age: calculateAge(personal.dateOfBirth),
    height: personal.height || "",
    religion: astro.religion || "",
    caste: astro.caste || "",
    occupation: education.occupation || "",
    city: contact.city || "",
    photoUrl: row.photoUrl ?? null,
    photoShape: row.photoShape === "square" ? "square" : "circle",
    verified: Boolean(row.emailVerified),
  };
}

export function toPublicDetail(row: Record<string, any>): PublicProfileDetail {
  const personal = row.personal ?? {};
  const astro = row.astro ?? {};
  const education = row.education ?? {};
  const contact = row.contact ?? {};
  const family = row.family ?? {};
  const partnerPreference = row.partnerPreference ?? {};

  return {
    ...toPublicCard(row),
    templateId: row.templateId,
    maritalStatus: personal.maritalStatus || "",
    education: education.highestQualification || "",
    company: education.companyName || "",
    state: contact.state || "",
    diet: personal.diet || "",
    manglikStatus: astro.manglikStatus || "",
    hobbies: Array.isArray(personal.hobbies) ? personal.hobbies : [],
    about: partnerPreference.freeText || "",
    family: {
      fatherOccupation: family.fatherOccupation || "",
      motherOccupation: family.motherOccupation || "",
      siblings: family.siblings || "",
      nativePlace: family.nativePlace || "",
    },
  };
}
