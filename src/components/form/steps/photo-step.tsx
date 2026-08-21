"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useDraftStore } from "@/lib/draft-store";
import { cn } from "@/lib/utils";
import { blobToDataUrl, normalizeToJpeg } from "@/lib/image";

async function uploadOrFallback(file: File): Promise<string> {
  const jpeg = await normalizeToJpeg(file);

  const form = new FormData();
  form.append("file", jpeg, "photo.jpg");
  try {
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (res.ok) {
      const data = await res.json();
      return data.url as string;
    }
  } catch {
    // fall through to local preview
  }
  return blobToDataUrl(jpeg);
}

export function PhotoStep() {
  const photoUrl = useDraftStore((s) => s.draft.photoUrl);
  const setPhoto = useDraftStore((s) => s.setPhoto);
  const photoShape = useDraftStore((s) => s.draft.photoShape ?? "circle");
  const setPhotoShape = useDraftStore((s) => s.setPhotoShape);
  const additionalPhotos = useDraftStore((s) => s.draft.additionalPhotos);
  const setAdditionalPhotos = useDraftStore((s) => s.setAdditionalPhotos);
  const [uploading, setUploading] = useState(false);
  const mainInput = useRef<HTMLInputElement>(null);
  const extraInput = useRef<HTMLInputElement>(null);

  async function handleMainPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await uploadOrFallback(file);
    setPhoto(url);
    setUploading(false);
  }

  async function handleExtraPhoto(file: File | undefined) {
    if (!file || additionalPhotos.length >= 5) return;
    setUploading(true);
    const url = await uploadOrFallback(file);
    setAdditionalPhotos([...additionalPhotos, url]);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 text-[12.5px] font-medium text-ink-700">Profile Picture</p>
        <div className="flex flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed border-border bg-white py-8">
          <button
            type="button"
            onClick={() => mainInput.current?.click()}
            className={cn(
              "relative flex h-24 w-24 items-center justify-center overflow-hidden border-2 border-gold-500 bg-ivory-200",
              photoShape === "circle" ? "rounded-full" : "rounded-lg"
            )}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Camera size={26} strokeWidth={1.6} className="text-ink-300" />
            )}
          </button>
          <input
            ref={mainInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleMainPhoto(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => mainInput.current?.click()}
            className="text-[13px] font-semibold text-maroon-700"
          >
            {uploading ? "Uploading…" : photoUrl ? "Change photo" : "Upload from gallery"}
          </button>
          <p className="px-8 text-center text-[11.5px] text-ink-300">
            A clear, recent, front-facing photo works best.
          </p>

          <div className="flex gap-2 rounded-full border border-border bg-ivory-50 p-1">
            <button
              type="button"
              onClick={() => setPhotoShape("circle")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-medium",
                photoShape === "circle" ? "bg-maroon-900 text-gold-100" : "text-ink-500"
              )}
            >
              Round
            </button>
            <button
              type="button"
              onClick={() => setPhotoShape("square")}
              className={cn(
                "rounded-full px-4 py-1.5 text-[12px] font-medium",
                photoShape === "square" ? "bg-maroon-900 text-gold-100" : "text-ink-500"
              )}
            >
              Square
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-[12.5px] font-medium text-ink-700">Add up to 5 more photos (optional)</p>
        <div className="grid grid-cols-3 gap-2.5">
          {additionalPhotos.map((url, i) => (
            <div
              key={url + i}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-ivory-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Extra ${i + 1}`} className="h-full w-full object-contain" />
              <button
                type="button"
                onClick={() => setAdditionalPhotos(additionalPhotos.filter((u) => u !== url))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {additionalPhotos.length < 5 && (
            <button
              type="button"
              onClick={() => extraInput.current?.click()}
              className="flex aspect-square items-center justify-center rounded-md border-[1.5px] border-dashed border-border text-ink-300"
            >
              <Camera size={20} strokeWidth={1.6} />
            </button>
          )}
          <input
            ref={extraInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleExtraPhoto(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
