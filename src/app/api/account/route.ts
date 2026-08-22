import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Deletes the account and everything tied to it (biodata, messages,
// interests, sessions) — the schema's onDelete: Cascade handles all of
// that from this single query. No soft-delete: once confirmed, it's gone.
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
