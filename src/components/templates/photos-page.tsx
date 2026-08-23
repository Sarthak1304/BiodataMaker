import { BiodataData } from "@/types/biodata";
import { cn } from "@/lib/utils";

function gridCols(count: number) {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  return 3;
}

export function PhotosPage({ data, accent = "maroon" }: { data: BiodataData; accent?: "maroon" | "ink" }) {
  if (data.additionalPhotos.length === 0) return null;
  const cols = gridCols(data.additionalPhotos.length);

  return (
    <div className="relative aspect-[210/297] w-full bg-white p-[26px_22px] shadow-card">
      <p
        className={cn(
          "mb-4 text-center text-[10px] font-semibold tracking-[0.18em]",
          accent === "maroon" ? "text-maroon-700" : "text-ink-900"
        )}
      >
        MORE PHOTOS
      </p>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {data.additionalPhotos.map((url, i) => (
          <div
            key={url + i}
            className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-ivory-200 bg-ivory-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Photo ${i + 2}`} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
