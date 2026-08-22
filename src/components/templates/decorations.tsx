import { TemplateTheme } from "./theme";

export function Decoration({ theme }: { theme: TemplateTheme }) {
  const c = theme.accentColor;
  switch (theme.decoration) {
    case "peacock":
      return (
        <svg viewBox="0 0 210 297" className="pointer-events-none absolute inset-0 h-full w-full opacity-30">
          <circle cx="24" cy="30" r="12" fill="none" stroke={c} strokeWidth="0.6" />
          <circle cx="24" cy="30" r="5" fill={c} opacity="0.5" />
          <circle cx="186" cy="48" r="15" fill="none" stroke={c} strokeWidth="0.6" />
          <circle cx="186" cy="48" r="7" fill={c} opacity="0.5" />
          <circle cx="16" cy="260" r="13" fill="none" stroke={c} strokeWidth="0.6" />
          <circle cx="16" cy="260" r="6" fill={c} opacity="0.5" />
          <circle cx="193" cy="244" r="10" fill="none" stroke={c} strokeWidth="0.6" />
          <circle cx="193" cy="244" r="4.5" fill={c} opacity="0.5" />
        </svg>
      );
    case "marigold":
      return (
        <svg viewBox="0 0 210 40" className="pointer-events-none absolute left-0 top-0 h-[40px] w-full opacity-90">
          <circle cx="18" cy="14" r="9" fill="#E2661B" opacity="0.5" />
          <circle cx="42" cy="8" r="6" fill="#F0923C" opacity="0.6" />
          <circle cx="70" cy="14" r="10" fill="#E2661B" opacity="0.4" />
          <circle cx="98" cy="8" r="6" fill="#F0923C" opacity="0.6" />
          <circle cx="126" cy="14" r="9" fill="#E2661B" opacity="0.5" />
          <circle cx="150" cy="9" r="7" fill="#F0923C" opacity="0.55" />
          <circle cx="178" cy="13" r="8" fill="#E2661B" opacity="0.5" />
        </svg>
      );
    case "kalamkari":
      return (
        <svg viewBox="0 0 210 297" className="pointer-events-none absolute inset-0 h-full w-full opacity-30">
          <path d="M12 12 Q26 42 12 72 Q-2 102 12 132" stroke="#2E4057" strokeWidth="0.6" fill="none" />
          <path d="M198 12 Q184 42 198 72 Q212 102 198 132" stroke="#2E4057" strokeWidth="0.6" fill="none" />
          <circle cx="12" cy="42" r="2.5" fill="#8B4A2B" />
          <circle cx="198" cy="42" r="2.5" fill="#8B4A2B" />
        </svg>
      );
    case "deco-corners":
      return (
        <svg viewBox="0 0 210 297" className="pointer-events-none absolute inset-0 h-full w-full opacity-60">
          <path d="M0 0 L36 0 L0 36 Z" fill={c} opacity="0.4" />
          <path d="M210 0 L174 0 L210 36 Z" fill={c} opacity="0.4" />
          <path d="M0 297 L36 297 L0 261 Z" fill={c} opacity="0.4" />
          <path d="M210 297 L174 297 L210 261 Z" fill={c} opacity="0.4" />
          <line x1="0" y1="148.5" x2="210" y2="148.5" stroke={c} strokeWidth="0.3" opacity="0.35" />
        </svg>
      );
    case "watercolor":
      return (
        <svg viewBox="0 0 210 297" className="pointer-events-none absolute inset-0 h-full w-full opacity-70">
          <circle cx="10" cy="10" r="30" fill="#F3D3DE" opacity="0.6" />
          <circle cx="200" cy="280" r="34" fill="#DCE9F7" opacity="0.55" />
          <circle cx="205" cy="120" r="20" fill="#DCEEDD" opacity="0.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function Frame({ theme }: { theme: TemplateTheme }) {
  const c = theme.accentColor;
  switch (theme.frame) {
    case "gold-double":
      return (
        <>
          <div className="pointer-events-none absolute inset-[9px] rounded-[3px] border-[1.5px]" style={{ borderColor: c }} />
          <div className="pointer-events-none absolute inset-[13px] rounded-[2px] border-[0.5px] opacity-60" style={{ borderColor: c }} />
        </>
      );
    case "brown-double":
      return (
        <>
          <div className="pointer-events-none absolute inset-[7px] rounded-[2px] border-[2px]" style={{ borderColor: c }} />
          <div className="pointer-events-none absolute inset-[12px] rounded-[2px] border-[1px]" style={{ borderColor: c }} />
        </>
      );
    case "mandala":
      return (
        <svg viewBox="0 0 210 297" className="pointer-events-none absolute inset-0 h-full w-full opacity-20">
          <circle cx="105" cy="148" r="75" fill="none" stroke={c} strokeWidth="0.5" />
          <circle cx="105" cy="148" r="57" fill="none" stroke={c} strokeWidth="0.5" />
          <circle cx="105" cy="148" r="39" fill="none" stroke={c} strokeWidth="0.5" />
          <path d="M105 73v150M30 148h150M52 90l106 116M158 90L52 206" stroke={c} strokeWidth="0.3" />
        </svg>
      );
    case "temple-band":
      return (
        <svg viewBox="0 0 210 40" className="pointer-events-none absolute left-0 top-0 h-[34px] w-full">
          <path
            d="M0 40 L18 22 L30 30 L48 8 L66 28 L88 2 L110 28 L128 8 L146 30 L158 22 L176 40 L210 40 L210 0 L0 0 Z"
            fill={theme.accentColor}
          />
          <circle cx="88" cy="9" r="2.2" fill="#C9A227" />
        </svg>
      );
    default:
      return null;
  }
}
