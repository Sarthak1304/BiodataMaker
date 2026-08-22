import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { ExtractionNotConfiguredError, extractBiodataFromDocument } from "@/lib/extract-biodata";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  // Deliberately no auth check — extraction is part of the guest-accessible
  // upload flow (same as manual entry). File size is capped below to keep
  // anonymous usage bounded.
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 10MB)." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let extracted;
    if (name.endsWith(".pdf") || file.type === "application/pdf") {
      extracted = await extractBiodataFromDocument({ kind: "pdf", base64: buffer.toString("base64") });
    } else if (name.endsWith(".docx")) {
      const { value: text } = await mammoth.extractRawText({ buffer });
      if (!text.trim()) return NextResponse.json({ error: "Couldn't read any text from that file." }, { status: 400 });
      extracted = await extractBiodataFromDocument({ kind: "text", text });
    } else if (name.endsWith(".txt") || file.type === "text/plain") {
      extracted = await extractBiodataFromDocument({ kind: "text", text: buffer.toString("utf8") });
    } else if (file.type.startsWith("image/")) {
      extracted = await extractBiodataFromDocument({ kind: "image", base64: buffer.toString("base64"), mediaType: file.type });
    } else {
      return NextResponse.json(
        { error: "Unsupported file type — use a PDF, Word (.docx), text file, or image." },
        { status: 400 }
      );
    }

    return NextResponse.json({ extracted });
  } catch (e) {
    if (e instanceof ExtractionNotConfiguredError) {
      return NextResponse.json(
        { error: "AI extraction isn't set up yet — enter your details manually for now." },
        { status: 501 }
      );
    }
    console.error("Biodata extraction failed:", e);
    return NextResponse.json({ error: "Couldn't read that file. Try a different one, or enter details manually." }, { status: 500 });
  }
}
