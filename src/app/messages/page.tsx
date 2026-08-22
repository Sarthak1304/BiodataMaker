"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useRequireAuth } from "@/lib/use-require-auth";

interface Conversation {
  partner: { id: string; name: string | null; image: string | null };
  lastMessage: string;
  lastAt: string;
  unread: number;
  isMine: boolean;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const days = Math.floor(hr / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MessagesListPage() {
  const status = useRequireAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/messages")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Couldn't load messages."))))
      .then((data) => setConversations(data.conversations))
      .catch((e) => setError(e.message));
  }, [status]);

  return (
    <MobileShell wide>
      <div className="px-5 pt-5 lg:px-8">
        <h1 className="font-display mb-4 text-[26px] font-semibold text-maroon-900">Messages</h1>

        {error && <p className="text-[13px] text-maroon-700">{error}</p>}
        {conversations === null && !error && <p className="text-[13.5px] text-ink-500">Loading…</p>}

        {conversations && conversations.length === 0 && (
          <div className="rounded-lg border-[1.5px] border-dashed border-border bg-white py-14 text-center">
            <p className="mb-1 text-[14px] text-ink-500">No conversations yet.</p>
            <p className="text-[12.5px] text-ink-300">Messages you send or receive will show up here.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {conversations?.map((c) => (
          <button
            key={c.partner.id}
            onClick={() => router.push(`/messages/${c.partner.id}`)}
            className={`flex items-center gap-3.5 border-b border-border px-5 py-3.5 text-left lg:px-8 ${
              c.unread > 0 ? "bg-gold-100" : "bg-white"
            }`}
          >
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-300 to-gold-100">
              {c.partner.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.partner.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound size={24} strokeWidth={1.4} className="text-gold-700" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <p className="truncate text-[14.5px] font-semibold text-ink-900">{c.partner.name || "Member"}</p>
                <span className={`shrink-0 text-[11px] ${c.unread > 0 ? "font-semibold text-gold-700" : "text-ink-300"}`}>
                  {timeAgo(c.lastAt)}
                </span>
              </div>
              <p
                className={`mt-1 truncate text-[12.5px] ${
                  c.unread > 0 ? "font-medium text-ink-700" : "text-ink-500"
                }`}
              >
                {c.isMine ? "You: " : ""}
                {c.lastMessage}
              </p>
            </div>
            {c.unread > 0 && <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-maroon-700" />}
          </button>
        ))}
      </div>

      <BottomNav />
    </MobileShell>
  );
}
