import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const [sent, received] = await Promise.all([
    prisma.interest.findMany({ where: { fromUserId: userId }, orderBy: { createdAt: "desc" } }),
    prisma.interest.findMany({ where: { toUserId: userId }, orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({ sent, received });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const toUserId = String(body.toUserId ?? "");
  const biodataId = body.biodataId ? String(body.biodataId) : null;

  if (!toUserId || toUserId === userId) {
    return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
  }

  // The target must be a real, currently-public profile — don't let this
  // endpoint be used to probe for the existence of private/unknown users.
  if (biodataId) {
    const target = await prisma.biodata.findUnique({ where: { id: biodataId } });
    if (!target || !target.isPublic || target.userId !== toUserId) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }
  }

  const interest = await prisma.interest.upsert({
    where: { fromUserId_toUserId: { fromUserId: userId, toUserId } },
    update: { biodataId, status: "PENDING" },
    create: { fromUserId: userId, toUserId, biodataId, status: "PENDING" },
  });

  return NextResponse.json({ interest });
}
