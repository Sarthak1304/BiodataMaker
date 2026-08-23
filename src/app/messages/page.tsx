"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Heart, Check, X } from "lucide-react";
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

interface ReceivedInterest {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  fromUser: { id: string; name: string | null; image: string | null };
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
  const [interests, setInterests] = useState<ReceivedInterest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/messages")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Couldn't load messages."))))
      .then((data) => setConversations(data.conversations))
      .catch((e) => setError(e.message));

    fetch("/api/interests")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setInterests((data?.received ?? []).filter((i: ReceivedInterest) => i.status === "PENDING")))
      .catch(() => {});
  }, [status]);

  async function respond(interest: ReceivedInterest, decision: "ACCEPTED" | "DECLINED") {
    setBusyId(interest.id);
    try {
      const res = await fetch(`/api/interests/${interest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision }),
      });
      if (res.ok) {
        setInterests((prev) => prev.filter((i) => i.id !== interest.id));
        if (decision === "ACCEPTED") router.push(`/messages/${interest.fromUser.id}`);
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <MobileShell wide>
      <div className="px-5 pt-5 lg:px-8">
        <h1 className="font-display mb-4 text-[26px] font-semibold text-maroon-900">Messages</h1>

        {interests.length > 0 && (
          <div className="mb-5 flex flex-col gap-2.5">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-300">
              Interest{interests.length > 1 ? "s" : ""} received
            </p>
            {interests.map((interest) => (
              <div
                key={interest.id}
                className="flex items-center gap-3 rounded-md border border-gold-500 bg-gold-100 px-4 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                  {interest.fromUser.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={interest.fromUser.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Heart size={16} strokeWidth={1.8} className="text-gold-700" />
                  )}
                </div>
                <p className="flex-1 text-[13.5px] font-medium text-ink-900">
                  {interest.fromUser.name || "A member"} is interested in you
                </p>
                <button
                  onClick={() => respond(interest, "DECLINED")}
                  disabled={busyId === interest.id}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-white disabled:opacity-50"
                >
                  <X size={14} strokeWidth={2} className="text-ink-500" />
                </button>
                <button
                  onClick={() => respond(interest, "ACCEPTED")}
                  disabled={busyId === interest.id}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-maroon-700 to-maroon-900 disabled:opacity-50"
                >
                  <Check size={14} strokeWidth={2.5} className="text-gold-100" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-[13px] text-maroon-700">{error}</p>}
        {conversations === null && !error && <p className="text-[13.5px] text-ink-500">Loading…</p>}

        {conversations && conversations.length === 0 && interests.length === 0 && (
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
