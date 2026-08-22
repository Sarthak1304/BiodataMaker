export type Gender = "woman" | "man";
export type MaritalStatus = "never-married" | "divorced" | "widowed";
export type Diet = "vegetarian" | "non-vegetarian" | "eggetarian" | "vegan";
export type ManglikStatus = "manglik" | "non-manglik" | "unsure";

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  timeOfBirth: string;
  placeOfBirth: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  gender: Gender | "";
  maritalStatus: MaritalStatus | "";
  diet: Diet | "";
  motherTongue: string;
  nativePlace: string;
  languagesKnown: string;
  hobbies: string[];
}

export interface FamilyDetails {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: string;
  familyValues: string;
}

export interface EducationCareer {
  highestQualification: string;
  institution: string;
  occupation: string;
  companyName: string;
  annualIncome: string;
}

export interface AstroDetails {
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  nakshatra: string;
  rashi: string;
  manglikStatus: ManglikStatus | "";
}

export interface ContactDetails {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  instagramHandle: string;
}

export interface PartnerPreference {
  ageRange: string;
  heightRange: string;
  religion: string;
  caste: string;
  education: string;
  profession: string;
  location: string;
  maritalStatus: string;
  freeText: string;
}

export type TemplateId =
  | "traditional-floral"
  | "modern-minimal"
  | "royal-rajasthani"
  | "elegant-ivory-gold"
  | "professional"
  | "pastel-contemporary"
  | "peacock-motif"
  | "marigold-vermilion"
  | "kalamkari-print"
  | "sacred-mandala"
  | "south-indian-temple"
  | "bengali-alpana"
  | "photo-forward"
  | "floral-watercolor"
  | "indo-deco";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  available: boolean;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "traditional-floral",
    name: "Traditional Floral",
    description: "Maroon & gold borders, floral corner motifs, serif headings.",
    available: true,
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean lines, generous white space, single accent color.",
    available: true,
  },
  {
    id: "royal-rajasthani",
    name: "Royal Rajasthani",
    description: "Jewel tones, ornamental frame, regal feel.",
    available: true,
  },
  {
    id: "elegant-ivory-gold",
    name: "Elegant Ivory & Gold",
    description: "Understated luxury, thin gold rule lines.",
    available: true,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Resume-like structure, muted navy/grey.",
    available: true,
  },
  {
    id: "pastel-contemporary",
    name: "Pastel Contemporary",
    description: "Soft palette, rounded sections, friendlier feel.",
    available: true,
  },
  {
    id: "peacock-motif",
    name: "Peacock Motif",
    description: "Deep emerald background, gold peacock-eye accents.",
    available: true,
  },
  {
    id: "marigold-vermilion",
    name: "Marigold & Vermilion",
    description: "Warm festive orange, marigold garland border.",
    available: true,
  },
  {
    id: "kalamkari-print",
    name: "Kalamkari Print",
    description: "Heritage hand-print border, earthy tones.",
    available: true,
  },
  {
    id: "sacred-mandala",
    name: "Sacred Mandala",
    description: "Centered mandala watermark, warm ivory & copper.",
    available: true,
  },
  {
    id: "south-indian-temple",
    name: "South Indian Temple",
    description: "Temple gopuram silhouette border, maroon & gold.",
    available: true,
  },
  {
    id: "bengali-alpana",
    name: "Bengali Alpana",
    description: "Deep red ground with an ivory alpana-bordered card.",
    available: true,
  },
  {
    id: "photo-forward",
    name: "Photo-Forward",
    description: "Large portrait panel, charcoal editorial styling.",
    available: true,
  },
  {
    id: "floral-watercolor",
    name: "Floral Watercolor",
    description: "Soft blurred watercolor blooms, romantic pastel.",
    available: true,
  },
  {
    id: "indo-deco",
    name: "Indo-Deco",
    description: "Midnight navy with art-deco gold geometry.",
    available: true,
  },
];

export interface BiodataData {
  id?: string;
  templateId: TemplateId;
  personal: PersonalDetails;
  family: FamilyDetails;
  education: EducationCareer;
  astro: AstroDetails;
  contact: ContactDetails;
  partnerPreference: PartnerPreference;
  photoUrl: string | null;
  photoShape: "circle" | "square";
  additionalPhotos: string[];
  isPublic: boolean;
}

export const EMPTY_BIODATA: BiodataData = {
  templateId: "traditional-floral",
  personal: {
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    height: "",
    weight: "",
    complexion: "",
    bloodGroup: "",
    gender: "",
    maritalStatus: "",
    diet: "",
    motherTongue: "",
    nativePlace: "",
    languagesKnown: "",
    hobbies: [],
  },
  family: {
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    siblings: "",
    familyType: "",
    familyValues: "",
  },
  education: {
    highestQualification: "",
    institution: "",
    occupation: "",
    companyName: "",
    annualIncome: "",
  },
  astro: {
    religion: "",
    caste: "",
    subCaste: "",
    gotra: "",
    nakshatra: "",
    rashi: "",
    manglikStatus: "",
  },
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    instagramHandle: "",
  },
  partnerPreference: {
    ageRange: "",
    heightRange: "",
    religion: "",
    caste: "",
    education: "",
    profession: "",
    location: "",
    maritalStatus: "",
    freeText: "",
  },
  photoUrl: null,
  photoShape: "circle",
  additionalPhotos: [],
  isPublic: false,
};

export const FORM_STEPS = [
  { key: "personal", label: "Personal", title: "Personal Details", subtitle: "Tell us a little about yourself." },
  { key: "family", label: "Family", title: "Family Details", subtitle: "About your parents and siblings." },
  { key: "education", label: "Education", title: "Education & Career", subtitle: "Your qualifications and work." },
  { key: "astro", label: "Astro", title: "Religious & Astrological", subtitle: "Religion, caste and horoscope basics." },
  { key: "contact", label: "Contact", title: "Contact Details", subtitle: "How can matches reach you?" },
  { key: "photo", label: "Photo", title: "Photo", subtitle: "Add a profile picture." },
] as const;

export type FormStepKey = (typeof FORM_STEPS)[number]["key"];
