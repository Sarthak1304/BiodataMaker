import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toPublicDetail } from "@/lib/public-profile";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await prisma.biodata.findUnique({
    where: { id: params.id },
    include: { user: { select: { emailVerified: true } } },
  });

  // Only ever serve a profile that is (a) real and (b) currently public —
  // an owner flipping their profile private must immediately stop showing
  // up here, even via a stale/shared link.
  if (!row || !row.isPublic) {
    return NextResponse.json({ error: "This profile isn't available." }, { status: 404 });
  }

  return NextResponse.json({ profile: toPublicDetail({ ...row, emailVerified: row.user.emailVerified }) });
}
