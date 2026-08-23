import { BiodataData } from "@/types/biodata";
import {
  astroGrid,
  badgeList,
  contactGrid,
  educationLines,
  familyLines,
  personalGrid,
} from "./format";
import { PhotosPage } from "./photos-page";
import { TEMPLATE_THEMES } from "./theme";
import { Frame } from "./decorations";
import { SectionTitle, Grid, Lines, CompactRows } from "./section-parts";

function PhotoCircle({ data, theme, size = 68 }: { data: BiodataData; theme: (typeof TEMPLATE_THEMES)[string]; size?: number }) {
  const shape = (data.photoShape ?? "circle") === "square" ? "rounded-md" : "rounded-full";
  return (
    <div
      className={`mx-auto mb-2 flex items-center justify-center overflow-hidden border-2 ${shape}`}
      style={{ width: size, height: size, borderColor: theme.photoRing, background: theme.photoBg }}
    >
      {data.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.photoUrl} alt={data.personal.fullName} className="h-full w-full object-cover" />
      ) : (
        <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={theme.mutedColor} strokeWidth="1.3" />
          <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke={theme.mutedColor} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export function ThemedTemplate({ data }: { data: BiodataData }) {
  const theme = TEMPLATE_THEMES[data.templateId];
  if (!theme) return null;

  const grid = personalGrid(data);
  const astro = astroGrid(data);
  const family = familyLines(data);
  const education = educationLines(data);
  const contact = contactGrid(data);
  const badges = badgeList(data);
  const { personal } = data;

  const sections = (
    <>
      {grid.length > 0 && (
        <div className="relative mt-4">
          <SectionTitle color={theme.accentColor}>PERSONAL DETAILS</SectionTitle>
          <Grid rows={grid} labelColor={theme.mutedColor} valueColor={theme.bodyColor} />
        </div>
      )}

      {astro.length > 0 && (
        <div className="relative mt-4">
          <SectionTitle color={theme.accentColor}>RELIGIOUS &amp; ASTROLOGICAL</SectionTitle>
          <Grid rows={astro} labelColor={theme.mutedColor} valueColor={theme.bodyColor} />
        </div>
      )}

      {(family.length > 0 || contact.length > 0) && (
        <div className="relative mt-4 grid grid-cols-2 items-start gap-3">
          {family.length > 0 && (
            <div>
              <SectionTitle color={theme.accentColor}>FAMILY DETAILS</SectionTitle>
              <Lines lines={family} color={theme.bodyColor} />
            </div>
          )}
          {contact.length > 0 && (
            <div>
              <SectionTitle color={theme.accentColor}>CONTACT DETAILS</SectionTitle>
              <CompactRows rows={contact} labelColor={theme.mutedColor} valueColor={theme.bodyColor} />
            </div>
          )}
        </div>
      )}

      {education.length > 0 && (
        <div className="relative mt-4">
          <SectionTitle color={theme.accentColor}>EDUCATION &amp; CAREER</SectionTitle>
          <Lines lines={education} color={theme.bodyColor} />
        </div>
      )}

      {personal.hobbies.length > 0 && (
        <div className="relative mt-4">
          <SectionTitle color={theme.accentColor}>HOBBIES &amp; INTERESTS</SectionTitle>
          <div className="text-[8.5px] leading-[1.6]" style={{ color: theme.bodyColor }}>
            {personal.hobbies.join(" · ")}
          </div>
        </div>
      )}

      {badges.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full px-[9px] py-[3.5px] text-[7.5px] font-semibold"
              style={{ background: theme.badgeBg, color: theme.badgeText }}
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </>
  );

  const header = (
    <div className="relative pt-1 text-center">
      <p className="mb-2 text-[9px] tracking-[0.22em]" style={{ color: theme.accentColor }}>
        MATRIMONIAL BIODATA
      </p>
      <PhotoCircle data={data} theme={theme} />
      <div className="font-display mt-1 text-[19px] font-semibold" style={{ color: theme.headingColor }}>
        {personal.fullName || "Your Name"}
      </div>
      <div className="mx-auto mt-2 h-px w-11" style={{ background: theme.dividerColor }} />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-[210/297] h-auto w-full overflow-hidden font-sans shadow-card"
        style={{ background: theme.pageBackground }}
      >
        <Frame theme={theme} />

        <div className="p-[26px_22px]">
          {header}
          {sections}
        </div>
      </div>

      <PhotosPage data={data} accent="maroon" />
    </div>
  );
}
