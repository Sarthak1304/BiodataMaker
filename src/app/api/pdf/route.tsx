import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BiodataData } from "@/types/biodata";
import { TraditionalFloralPdf } from "@/components/pdf/traditional-floral-pdf";
import { ModernMinimalPdf } from "@/components/pdf/modern-minimal-pdf";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in to download your biodata." }, { status: 401 });
  }

  const data = (await req.json()) as BiodataData;

  const doc = data.templateId === "modern-minimal" ? <ModernMinimalPdf data={data} /> : <TraditionalFloralPdf data={data} />;
  const buffer = await renderToBuffer(doc);

  const fileName = `${(data.personal.fullName || "biodata").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-biodata.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
