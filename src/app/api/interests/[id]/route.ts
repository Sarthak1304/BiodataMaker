import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const status = body.status === "ACCEPTED" ? "ACCEPTED" : body.status === "DECLINED" ? "DECLINED" : null;
  if (!status) return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const existing = await prisma.interest.findUnique({ where: { id: params.id } });
  // Only the recipient can accept/decline — the sender doesn't get to
  // approve their own interest.
  if (!existing || existing.toUserId !== userId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const interest = await prisma.interest.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json({ interest });
}
