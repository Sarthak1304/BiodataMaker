import { BiodataData } from "@/types/biodata";
import { TraditionalFloral } from "./traditional-floral";
import { ModernMinimal } from "./modern-minimal";
import { ThemedTemplate } from "./themed-template";
import { TEMPLATE_THEMES } from "./theme";

export function TemplateRenderer({ data }: { data: BiodataData }) {
  switch (data.templateId) {
    case "modern-minimal":
      return <ModernMinimal data={data} />;
    case "traditional-floral":
      return <TraditionalFloral data={data} />;
    default:
      if (TEMPLATE_THEMES[data.templateId]) return <ThemedTemplate data={data} />;
      return <TraditionalFloral data={data} />;
  }
}
