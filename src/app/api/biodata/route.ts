import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BiodataData } from "@/types/biodata";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const biodataList = await prisma.biodata.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ biodataList });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = (await req.json()) as BiodataData;

  // Only update an existing document when the caller explicitly points at
  // one they own — otherwise this always creates a new one, so a signed-in
  // user can hold multiple biodata documents at once.
  const existing = body.id ? await prisma.biodata.findFirst({ where: { id: body.id, userId } }) : null;

  const payload = {
    templateId: body.templateId,
    personal: body.personal as object,
    family: body.family as object,
    education: body.education as object,
    career: {} as object,
    astro: body.astro as object,
    contact: body.contact as object,
    partnerPreference: body.partnerPreference as object,
    photoUrl: body.photoUrl,
    photoShape: body.photoShape,
    additionalPhotos: body.additionalPhotos as object,
    isPublic: body.isPublic,
  };

  const biodata = existing
    ? await prisma.biodata.update({ where: { id: existing.id }, data: payload })
    : await prisma.biodata.create({ data: { userId, ...payload } });

  return NextResponse.json({ biodata });
}
