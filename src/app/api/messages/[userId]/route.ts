import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptMessage } from "@/lib/crypto";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const otherUserId = params.userId;

  const [partner, rows] = await Promise.all([
    prisma.user.findUnique({ where: { id: otherUserId }, select: { id: true, name: true, image: true } }),
    // Scoped to exactly these two participants — this is the only query
    // in the whole app that can ever return this pair's message content.
    prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!partner) return NextResponse.json({ error: "Member not found." }, { status: 404 });

  const messages = rows.map((m) => {
    let content = "[unreadable message]";
    try {
      content = decryptMessage(m.content);
    } catch {
      // corrupted/legacy row — degrade gracefully instead of 500ing the thread
    }
    return {
      id: m.id,
      fromUserId: m.fromUserId,
      toUserId: m.toUserId,
      content,
      createdAt: m.createdAt,
      readAt: m.readAt,
      isMine: m.fromUserId === userId,
    };
  });

  // Mark incoming messages as read now that the recipient has opened the thread.
  await prisma.message.updateMany({
    where: { fromUserId: otherUserId, toUserId: userId, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ partner, messages });
}
