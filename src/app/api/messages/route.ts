import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptMessage, encryptMessage } from "@/lib/crypto";

// GET: inbox — one row per conversation partner, most recent message first.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const messages = await prisma.message.findMany({
    where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: { select: { id: true, name: true, image: true } },
      toUser: { select: { id: true, name: true, image: true } },
    },
  });

  const conversations = new Map<
    string,
    { partner: { id: string; name: string | null; image: string | null }; lastMessage: string; lastAt: Date; unread: number; isMine: boolean }
  >();

  for (const m of messages) {
    const isMine = m.fromUserId === userId;
    const partner = isMine ? m.toUser : m.fromUser;
    if (!conversations.has(partner.id)) {
      let content = "[unreadable message]";
      try {
        content = decryptMessage(m.content);
      } catch {
        // leave fallback text — never crash the inbox over one bad row
      }
      conversations.set(partner.id, { partner, lastMessage: content, lastAt: m.createdAt, unread: 0, isMine });
    }
    if (!isMine && !m.readAt) {
      conversations.get(partner.id)!.unread++;
    }
  }

  const list = Array.from(conversations.values()).sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime());
  return NextResponse.json({ conversations: list });
}

// POST: send a message. Content is encrypted before it ever touches the DB.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const toUserId = String(body.toUserId ?? "");
  const content = String(body.content ?? "").trim();
  const biodataId = body.biodataId ? String(body.biodataId) : null;

  if (!toUserId || toUserId === userId) {
    return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
  }
  if (!content || content.length > 4000) {
    return NextResponse.json({ error: "Message must be 1–4000 characters." }, { status: 400 });
  }

  // Only allow starting a NEW conversation with someone discoverable
  // (has a public profile) or someone you've already messaged before —
  // stops this endpoint being used to message arbitrary account IDs.
  const [targetHasPublicProfile, existingThread] = await Promise.all([
    prisma.biodata.findFirst({ where: { userId: toUserId, isPublic: true } }),
    prisma.message.findFirst({
      where: {
        OR: [
          { fromUserId: userId, toUserId },
          { fromUserId: toUserId, toUserId: userId },
        ],
      },
    }),
  ]);
  if (!targetHasPublicProfile && !existingThread) {
    return NextResponse.json({ error: "You can't message this member." }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: { fromUserId: userId, toUserId, biodataId, content: encryptMessage(content) },
  });

  return NextResponse.json({ message: { ...message, content } });
}
