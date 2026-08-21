import { BiodataData } from "@/types/biodata";
import { astroGrid, badgeList, contactGrid, educationLines, familyLines, personalGrid } from "./format";
import { PhotosPage } from "./photos-page";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[6.5px] font-bold tracking-[0.1em] text-maroon-700">{children}</p>;
}

function Grid({ rows, cols = 3 }: { rows: { label: string; value: string }[]; cols?: 1 | 2 | 3 }) {
  const colsClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${colsClass} gap-x-2 gap-y-[3px] text-[6.3px] leading-[1.55] text-ink-700`}>
      {rows.map((row) => (
        <span key={row.label}>
          <strong className="font-bold text-ink-500">{row.label}</strong>
          <br />
          {row.value}
        </span>
      ))}
    </div>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <div className="text-[6.3px] leading-[1.55] text-ink-700">
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function CompactRows({ rows, cols = 2 }: { rows: { label: string; value: string }[]; cols?: 1 | 2 }) {
  return (
    <div
      className={`grid ${cols === 1 ? "grid-cols-1" : "grid-cols-2"} gap-x-2 gap-y-[2px] text-[6.3px] leading-[1.55] text-ink-700`}
    >
      {rows.map((row) => (
        <span key={row.label}>
          <strong className="font-bold text-ink-500">{row.label}:</strong> {row.value}
        </span>
      ))}
    </div>
  );
}

export function TraditionalFloral({ data }: { data: BiodataData }) {
  const grid = personalGrid(data);
  const astro = astroGrid(data);
  const family = familyLines(data);
  const education = educationLines(data);
  const contact = contactGrid(data);
  const badges = badgeList(data);
  const { personal } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[210/297] h-auto w-full bg-white p-[18px_16px] font-sans text-ink-700 shadow-card">
        <div className="pointer-events-none absolute inset-[9px] rounded-[3px] border-[1.5px] border-gold-500" />
        <div className="pointer-events-none absolute inset-[13px] rounded-[2px] border-[0.5px] border-gold-300" />

        <div className="relative pt-1 text-center">
          <p className="mb-1.5 text-[7px] tracking-[0.2em] text-gold-700">MATRIMONIAL BIODATA</p>
          <div
            className={`mx-auto mb-2 flex h-[50px] w-[50px] items-center justify-center overflow-hidden border-2 border-gold-500 bg-ivory-200 ${
              (data.photoShape ?? "circle") === "square" ? "rounded-md" : "rounded-full"
            }`}
          >
            {data.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoUrl} alt={personal.fullName} className="h-full w-full object-cover" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#9C917F" strokeWidth="1.5" />
                <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="#9C917F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="font-display text-[14px] font-semibold text-maroon-900">
            {personal.fullName || "Your Name"}
          </div>
          <div className="mx-auto mt-1.5 h-px w-9 bg-gold-500" />
        </div>

        {grid.length > 0 && (
          <div className="relative mt-2.5">
            <SectionTitle>PERSONAL DETAILS</SectionTitle>
            <Grid rows={grid} />
          </div>
        )}

        {astro.length > 0 && (
          <div className="relative mt-2.5">
            <SectionTitle>RELIGIOUS &amp; ASTROLOGICAL</SectionTitle>
            <Grid rows={astro} />
          </div>
        )}

        {(family.length > 0 || contact.length > 0) && (
          <div className="relative mt-2.5 grid grid-cols-2 items-start gap-3">
            {family.length > 0 && (
              <div>
                <SectionTitle>FAMILY DETAILS</SectionTitle>
                <Lines lines={family} />
              </div>
            )}
            {contact.length > 0 && (
              <div>
                <SectionTitle>CONTACT DETAILS</SectionTitle>
                <CompactRows rows={contact} cols={1} />
              </div>
            )}
          </div>
        )}

        {education.length > 0 && (
          <div className="relative mt-2.5">
            <SectionTitle>EDUCATION &amp; CAREER</SectionTitle>
            <Lines lines={education} />
          </div>
        )}

        {personal.hobbies.length > 0 && (
          <div className="relative mt-2.5">
            <SectionTitle>HOBBIES &amp; INTERESTS</SectionTitle>
            <div className="text-[6.3px] text-ink-700">{personal.hobbies.join(" · ")}</div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="relative mt-2.5 flex flex-wrap gap-1">
            {badges.map((b) => (
              <span key={b} className="rounded-full bg-sage-100 px-[6px] py-[2px] text-[5.5px] font-semibold text-sage-700">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <PhotosPage data={data} accent="maroon" />
    </div>
  );
}
