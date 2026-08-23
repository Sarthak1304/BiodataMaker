"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Send, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useRequireAuth } from "@/lib/use-require-auth";
import { EmojiPicker } from "@/components/emoji-picker";

interface ThreadMessage {
  id: string;
  content: string;
  createdAt: string;
  readAt: string | null;
  isMine: boolean;
}

const POLL_MS = 4000;

export default function MessageThreadPage() {
  const status = useRequireAuth();
  const router = useRouter();
  const params = useParams<{ userId: string }>();

  const [partner, setPartner] = useState<{ id: string; name: string | null; image: string | null } | null>(null);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function load() {
    fetch(`/api/messages/${params.userId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Couldn't load this conversation."))))
      .then((data) => {
        setPartner(data.partner);
        setMessages(data.messages);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, params.userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: params.userId, content }),
      });
      if (res.ok) {
        load();
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Message failed to send.");
      }
    } finally {
      setSending(false);
    }
  }

  if (error && !partner) {
    return (
      <MobileShell>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-[14px] text-ink-500">{error}</p>
          <button onClick={() => router.push("/messages")} className="text-[13.5px] font-semibold text-maroon-700">
            Back to Messages
          </button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell bg="bg-ivory-100">
      <div className="flex items-center gap-2 border-b border-border bg-white px-3 py-2.5">
        <button onClick={() => router.push("/messages")} className="flex h-11 w-11 shrink-0 items-center justify-center">
          <ChevronLeft size={20} strokeWidth={1.8} className="text-ink-700" />
        </button>
        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold-300 to-gold-100">
          {partner?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={partner.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserRound size={18} strokeWidth={1.4} className="text-gold-700" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[14.5px] font-semibold text-ink-900">{partner?.name || "Member"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4 pt-4">
        <div className="text-center">
          <span className="rounded-full bg-sage-100 px-3.5 py-1.5 text-[11.5px] font-medium text-sage-700">
            Messages are private between you and {partner?.name?.split(" ")[0] || "this member"}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[76%] ${m.isMine ? "self-end" : "self-start"}`}
            >
              <div
                className={
                  m.isMine
                    ? "rounded-[16px_16px_4px_16px] bg-gradient-to-br from-maroon-700 to-maroon-900 px-[15px] py-[11px] shadow-sm"
                    : "rounded-[16px_16px_16px_4px] border border-border bg-white px-[15px] py-[11px] shadow-sm"
                }
              >
                <p className={`whitespace-pre-wrap break-words text-[13.5px] leading-relaxed ${m.isMine ? "text-gold-100" : "text-ink-900"}`}>
                  {m.content}
                </p>
              </div>
              <p className={`mt-1 text-[10.5px] text-ink-300 ${m.isMine ? "text-right" : ""}`}>
                {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                {m.isMine && m.readAt ? " · Seen" : ""}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-4 pb-2 text-[12.5px] text-maroon-700">{error}</p>}

      <div className="sticky bottom-0 flex items-center gap-2.5 border-t border-border bg-ivory-100 px-4 py-3.5">
        <EmojiPicker onSelect={(emoji) => setDraft((d) => d + emoji)} />
        <div className="flex-1 rounded-full border-[1.5px] border-border bg-white px-4 py-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            maxLength={4000}
            className="w-full min-w-0 border-none bg-transparent text-[14px] text-ink-900 outline-none"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={send}
          disabled={sending || !draft.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-maroon-700 to-maroon-900 shadow-button disabled:opacity-50"
        >
          <Send size={16} strokeWidth={1.8} className="text-gold-100" />
        </motion.button>
      </div>
    </MobileShell>
  );
}
