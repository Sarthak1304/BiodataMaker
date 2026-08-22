import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decryptMessage } from "@/lib/crypto";

// Exports everything this account owns — their own data only, decrypted
// for their own eyes. Never used for any other user's data.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const [user, biodata, sentMessages, receivedMessages, sentInterests, receivedInterests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    }),
    prisma.biodata.findMany({ where: { userId } }),
    prisma.message.findMany({ where: { fromUserId: userId } }),
    prisma.message.findMany({ where: { toUserId: userId } }),
    prisma.interest.findMany({ where: { fromUserId: userId } }),
    prisma.interest.findMany({ where: { toUserId: userId } }),
  ]);

  const decryptSafely = (content: string) => {
    try {
      return decryptMessage(content);
    } catch {
      return "[unreadable]";
    }
  };

  const exportData = {
    exportedAt: new Date().toISOString(),
    account: user,
    biodata,
    messagesSent: sentMessages.map((m) => ({ ...m, content: decryptSafely(m.content) })),
    messagesReceived: receivedMessages.map((m) => ({ ...m, content: decryptSafely(m.content) })),
    interestsSent: sentInterests,
    interestsReceived: receivedInterests,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="biodatamatcher-my-data.json"`,
    },
  });
}
