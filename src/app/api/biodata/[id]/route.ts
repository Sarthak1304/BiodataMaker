import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const existing = await prisma.biodata.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await req.json();
  const data: { isPublic?: boolean; partnerPreference?: object } = {};
  if (typeof body.isPublic === "boolean") data.isPublic = body.isPublic;
  if (body.partnerPreference && typeof body.partnerPreference === "object") {
    data.partnerPreference = body.partnerPreference;
  }

  const biodata = await prisma.biodata.update({ where: { id: params.id }, data });
  return NextResponse.json({ biodata });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const existing = await prisma.biodata.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.biodata.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
