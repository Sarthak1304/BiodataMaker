import { TemplateTheme } from "./theme";

export function Frame({ theme }: { theme: TemplateTheme }) {
  const c = theme.accentColor;
  switch (theme.frame) {
    case "brown-double":
      return (
        <>
          <div className="pointer-events-none absolute inset-[7px] rounded-[2px] border-[2px]" style={{ borderColor: c }} />
          <div className="pointer-events-none absolute inset-[12px] rounded-[2px] border-[1px]" style={{ borderColor: c }} />
        </>
      );
    default:
      return null;
  }
}
