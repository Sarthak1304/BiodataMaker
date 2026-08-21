import { BiodataData } from "@/types/biodata";
import { TraditionalFloral } from "./traditional-floral";
import { ModernMinimal } from "./modern-minimal";

export function TemplateRenderer({ data }: { data: BiodataData }) {
  switch (data.templateId) {
    case "modern-minimal":
      return <ModernMinimal data={data} />;
    case "traditional-floral":
    default:
      return <TraditionalFloral data={data} />;
  }
}
