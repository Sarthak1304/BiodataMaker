export function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="mb-1 text-[6.5px] font-bold tracking-[0.12em]" style={{ color }}>
      {children}
    </p>
  );
}

export function Grid({
  rows,
  cols = 3,
  labelColor,
  valueColor,
}: {
  rows: { label: string; value: string }[];
  cols?: 1 | 2 | 3;
  labelColor: string;
  valueColor: string;
}) {
  const colsClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-2" : "grid-cols-3";
  return (
    <div className={`grid ${colsClass} gap-x-2 gap-y-[3px] text-[6.3px] leading-[1.55]`} style={{ color: valueColor }}>
      {rows.map((row) => (
        <span key={row.label}>
          <strong className="font-bold" style={{ color: labelColor }}>
            {row.label}
          </strong>
          <br />
          {row.value}
        </span>
      ))}
    </div>
  );
}

export function Lines({ lines, color }: { lines: string[]; color: string }) {
  return (
    <div className="text-[6.3px] leading-[1.55]" style={{ color }}>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

export function CompactRows({
  rows,
  cols = 1,
  labelColor,
  valueColor,
}: {
  rows: { label: string; value: string }[];
  cols?: 1 | 2;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <div
      className={`grid ${cols === 1 ? "grid-cols-1" : "grid-cols-2"} gap-x-2 gap-y-[2px] text-[6.3px] leading-[1.55]`}
      style={{ color: valueColor }}
    >
      {rows.map((row) => (
        <span key={row.label}>
          <strong className="font-bold" style={{ color: labelColor }}>
            {row.label}:
          </strong>{" "}
          {row.value}
        </span>
      ))}
    </div>
  );
}
