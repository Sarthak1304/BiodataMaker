import { BiodataData } from "@/types/biodata";
import { astroGrid, badgeList, contactGrid, educationLines, familyLines, personalGrid } from "./format";
import { PhotosPage } from "./photos-page";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[9px] font-bold tracking-[0.14em] text-gold-700">{children}</p>;
}

function Grid({ rows, cols = 3 }: { rows: { label: string; value: string }[]; cols?: 1 | 2 | 3 }) {
  const colsClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${colsClass} gap-x-3 gap-y-[6px] text-[8.5px] leading-[1.5] text-ink-700`}>
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
    <div className="text-[8.5px] leading-[1.6] text-ink-700">
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

function CompactRows({ rows, cols = 2 }: { rows: { label: string; value: string }[]; cols?: 1 | 2 }) {
  return (
    <div
      className={`grid ${cols === 1 ? "grid-cols-1" : "grid-cols-2"} gap-x-3 gap-y-[4px] text-[8.5px] leading-[1.6] text-ink-700`}
    >
      {rows.map((row) => (
        <span key={row.label}>
          <strong className="font-bold text-ink-500">{row.label}:</strong> {row.value}
        </span>
      ))}
    </div>
  );
}

export function ModernMinimal({ data }: { data: BiodataData }) {
  const grid = personalGrid(data);
  const astro = astroGrid(data);
  const family = familyLines(data);
  const education = educationLines(data);
  const contact = contactGrid(data);
  const badges = badgeList(data);
  const { personal } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[210/297] h-auto w-full bg-white p-[30px_24px] font-sans text-ink-700 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 h-[3px] w-7 bg-ink-900" />
            <div className="text-[17px] font-bold tracking-[0.03em] text-ink-900">
              {(personal.fullName || "YOUR NAME").toUpperCase()}
            </div>
            <div className="mt-1.5 text-[8.5px] tracking-[0.18em] text-ink-300">MATRIMONIAL PROFILE</div>
          </div>
          {data.photoUrl && (
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-ivory-100 ${
                (data.photoShape ?? "circle") === "square" ? "rounded-sm" : "rounded-full"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.photoUrl} alt={personal.fullName} className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="mt-4 h-px w-full bg-border" />

        {grid.length > 0 && (
          <div className="mt-4">
            <SectionTitle>PERSONAL</SectionTitle>
            <Grid rows={grid} />
          </div>
        )}

        {astro.length > 0 && (
          <div className="mt-4">
            <SectionTitle>RELIGIOUS &amp; ASTROLOGICAL</SectionTitle>
            <Grid rows={astro} />
          </div>
        )}

        {(family.length > 0 || contact.length > 0) && (
          <div className="mt-4 grid grid-cols-2 items-start gap-3">
            {family.length > 0 && (
              <div>
                <SectionTitle>FAMILY</SectionTitle>
                <Lines lines={family} />
              </div>
            )}
            {contact.length > 0 && (
              <div>
                <SectionTitle>CONTACT</SectionTitle>
                <CompactRows rows={contact} cols={1} />
              </div>
            )}
          </div>
        )}

        {education.length > 0 && (
          <div className="mt-4">
            <SectionTitle>EDUCATION &amp; CAREER</SectionTitle>
            <Lines lines={education} />
          </div>
        )}

        {personal.hobbies.length > 0 && (
          <div className="mt-4">
            <SectionTitle>INTERESTS</SectionTitle>
            <div className="text-[8.5px] leading-[1.6] text-ink-700">{personal.hobbies.join(" · ")}</div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span key={b} className="rounded-sm border border-border px-[9px] py-[3.5px] text-[7.5px] font-semibold text-ink-500">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <PhotosPage data={data} accent="ink" />
    </div>
  );
}
