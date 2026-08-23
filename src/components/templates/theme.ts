import { TemplateId } from "@/types/biodata";

export interface TemplateTheme {
  id: TemplateId;
  pageBackground: string;
  /** Solid-color fallback for PDF export, which can't render CSS gradients. */
  pdfBackground: string;
  headerVariant: "standard";
  frame: "brown-double" | "none";
  headingColor: string;
  accentColor: string;
  bodyColor: string;
  mutedColor: string;
  badgeBg: string;
  badgeText: string;
  photoRing: string;
  photoBg: string;
  dividerColor: string;
}

export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  "royal-rajasthani": {
    id: "royal-rajasthani",
    pageBackground: "#FBF3E7",
    pdfBackground: "#FBF3E7",
    headerVariant: "standard",
    frame: "brown-double",
    headingColor: "#7A1F3D",
    accentColor: "#A8863A",
    bodyColor: "#4A3F34",
    mutedColor: "#A8863A",
    badgeBg: "#F3E4C8",
    badgeText: "#7A1F3D",
    photoRing: "#A8863A",
    photoBg: "#F0DCC0",
    dividerColor: "#A8863A",
  },
  "elegant-ivory-gold": {
    id: "elegant-ivory-gold",
    pageBackground: "#FDFBF6",
    pdfBackground: "#FDFBF6",
    headerVariant: "standard",
    frame: "none",
    headingColor: "#3A332B",
    accentColor: "#B8912A",
    bodyColor: "#4A3F34",
    mutedColor: "#9C917F",
    badgeBg: "#F3E4B8",
    badgeText: "#9C7A1F",
    photoRing: "#C9A227",
    photoBg: "#F5EEDD",
    dividerColor: "#C9A227",
  },
  professional: {
    id: "professional",
    pageBackground: "#F7F8FA",
    pdfBackground: "#F7F8FA",
    headerVariant: "standard",
    frame: "none",
    headingColor: "#2C3E52",
    accentColor: "#2C3E52",
    bodyColor: "#3F4A57",
    mutedColor: "#8494A3",
    badgeBg: "#E8ECF1",
    badgeText: "#2C3E52",
    photoRing: "#3F5771",
    photoBg: "#E8ECF1",
    dividerColor: "#3F5771",
  },
  "pastel-contemporary": {
    id: "pastel-contemporary",
    pageBackground: "linear-gradient(160deg,#FCEFE9,#F3F6EE)",
    pdfBackground: "#F8EFE9",
    headerVariant: "standard",
    frame: "none",
    headingColor: "#5A4E45",
    accentColor: "#8A9E7E",
    bodyColor: "#5A4E45",
    mutedColor: "#A9998C",
    badgeBg: "#E4EDE2",
    badgeText: "#3C5640",
    photoRing: "#8A9E7E",
    photoBg: "#F3E4DC",
    dividerColor: "#8A9E7E",
  },
};
