import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toPublicCard } from "@/lib/public-profile";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  // Discover is only for signed-in members — never expose even the
  // redacted profile cards to anonymous/guest traffic.
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const religion = searchParams.get("religion")?.trim().toLowerCase() ?? "";
  const city = searchParams.get("city")?.trim().toLowerCase() ?? "";
  const minAge = Number(searchParams.get("minAge")) || null;
  const maxAge = Number(searchParams.get("maxAge")) || null;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const rows = await prisma.biodata.findMany({
    where: { isPublic: true, userId: { not: userId } },
    include: { user: { select: { emailVerified: true } } },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  let cards = rows.map((r) => toPublicCard({ ...r, emailVerified: r.user.emailVerified }));

  if (q) {
    cards = cards.filter(
      (c) => c.fullName.toLowerCase().includes(q) || c.occupation.toLowerCase().includes(q)
    );
  }
  if (religion) cards = cards.filter((c) => c.religion.toLowerCase() === religion);
  if (city) cards = cards.filter((c) => c.city.toLowerCase().includes(city));
  if (minAge) cards = cards.filter((c) => c.age !== null && c.age >= minAge);
  if (maxAge) cards = cards.filter((c) => c.age !== null && c.age <= maxAge);

  const total = cards.length;
  const start = (page - 1) * PAGE_SIZE;
  const pageCards = cards.slice(start, start + PAGE_SIZE);

  return NextResponse.json({ cards: pageCards, total, page, pageSize: PAGE_SIZE });
}
