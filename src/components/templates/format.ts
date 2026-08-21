import { BiodataData } from "@/types/biodata";

export type GridRow = { label: string; value: string };

export function formatDob(dateOfBirth: string): string {
  if (!dateOfBirth) return "";
  const d = new Date(dateOfBirth);
  if (Number.isNaN(d.getTime())) return dateOfBirth;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function labelize(value: string): string {
  return value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function personalGrid(data: BiodataData): GridRow[] {
  const { personal } = data;
  return [
    { label: "Date of Birth", value: formatDob(personal.dateOfBirth) },
    { label: "Time of Birth", value: formatTime(personal.timeOfBirth) },
    { label: "Place of Birth", value: personal.placeOfBirth },
    { label: "Height", value: personal.height },
    { label: "Weight", value: personal.weight },
    { label: "Complexion", value: personal.complexion },
    { label: "Blood Group", value: personal.bloodGroup },
    { label: "Gender", value: labelize(personal.gender) },
    { label: "Marital Status", value: labelize(personal.maritalStatus) },
    { label: "Diet", value: labelize(personal.diet) },
    { label: "Mother Tongue", value: personal.motherTongue },
    { label: "Native Place", value: personal.nativePlace },
    { label: "Languages Known", value: personal.languagesKnown },
  ].filter((row) => row.value);
}

export function astroGrid(data: BiodataData): GridRow[] {
  const { astro } = data;
  return [
    { label: "Religion", value: astro.religion },
    { label: "Caste", value: astro.caste },
    { label: "Sub-caste", value: astro.subCaste },
    { label: "Gotra", value: astro.gotra },
    { label: "Nakshatra", value: astro.nakshatra },
    { label: "Rashi", value: astro.rashi },
    { label: "Manglik", value: astro.manglikStatus ? labelize(astro.manglikStatus) : "" },
  ].filter((row) => row.value);
}

export function familyLines(data: BiodataData): string[] {
  const { family } = data;
  const lines: string[] = [];
  if (family.fatherName) {
    lines.push(`Father — ${family.fatherName}${family.fatherOccupation ? `, ${family.fatherOccupation}` : ""}`);
  }
  if (family.motherName) {
    lines.push(`Mother — ${family.motherName}${family.motherOccupation ? `, ${family.motherOccupation}` : ""}`);
  }
  if (family.siblings) lines.push(`Siblings — ${family.siblings}`);
  if (family.familyType) lines.push(`Family Type — ${family.familyType}`);
  if (family.familyValues) lines.push(`Family Values — ${family.familyValues}`);
  return lines;
}

export function educationLines(data: BiodataData): string[] {
  const { education } = data;
  const lines: string[] = [];
  const qualification = [education.highestQualification, education.institution].filter(Boolean).join(" — ");
  if (qualification) lines.push(qualification);
  const occupation = [education.occupation, education.companyName].filter(Boolean).join(" at ");
  if (occupation) lines.push(occupation);
  if (education.annualIncome) lines.push(`Annual Income — ${education.annualIncome}`);
  return lines;
}

export function contactGrid(data: BiodataData): GridRow[] {
  const { contact } = data;
  return [
    { label: "Mobile", value: contact.phone ? `+91 ${contact.phone}` : "" },
    { label: "WhatsApp", value: contact.whatsapp ? `+91 ${contact.whatsapp}` : "" },
    { label: "Email", value: contact.email },
    { label: "City", value: contact.city },
    { label: "State", value: contact.state },
    { label: "Address", value: contact.address },
    { label: "Instagram", value: contact.instagramHandle },
  ].filter((row) => row.value);
}

export function preferenceGrid(data: BiodataData): GridRow[] {
  const p = data.partnerPreference;
  return [
    { label: "Age", value: p.ageRange },
    { label: "Height", value: p.heightRange },
    { label: "Religion", value: p.religion },
    { label: "Caste", value: p.caste },
    { label: "Education", value: p.education },
    { label: "Profession", value: p.profession },
    { label: "Location", value: p.location },
    { label: "Marital Status", value: p.maritalStatus },
  ].filter((row) => row.value);
}

export function badgeList(data: BiodataData): string[] {
  const badges: string[] = [];
  if (data.astro.manglikStatus === "manglik") badges.push("Manglik");
  if (data.astro.manglikStatus === "non-manglik") badges.push("Non-Manglik");
  if (data.personal.diet === "vegetarian") badges.push("Non-drinker");
  return badges;
}
