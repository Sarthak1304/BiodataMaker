"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, Heart, UserRound, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { useRequireAuth } from "@/lib/use-require-auth";
import { PublicProfileDetail } from "@/lib/public-profile";
import { labelize } from "@/components/templates/format";

export default function ProfileDetailPage() {
  const status = useRequireAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [profile, setProfile] = useState<PublicProfileDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [interestSent, setInterestSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch(`/api/discover/${params.id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("This profile isn't available."))))
      .then((data) => setProfile(data.profile))
      .catch((e) => setError(e.message));
  }, [status, params.id]);

  async function expressInterest() {
    if (!profile || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profile.userId, biodataId: profile.id }),
      });
      if (res.ok) setInterestSent(true);
    } finally {
      setBusy(false);
    }
  }

  function message() {
    if (!profile) return;
    router.push(`/messages/${profile.userId}?biodataId=${profile.id}`);
  }

  if (error) {
    return (
      <MobileShell>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-[14px] text-muted-foreground">{error}</p>
          <button onClick={() => router.push("/discover")} className="text-[13.5px] font-semibold text-primary">
            Back to Discover
          </button>
        </div>
      </MobileShell>
    );
  }

  if (!profile) {
    return (
      <MobileShell>
        <p className="px-6 pt-10 text-[13.5px] text-muted-foreground">Loading…</p>
      </MobileShell>
    );
  }

  const stats = [
    { label: "Height", value: profile.height },
    { label: "Religion", value: profile.religion },
    { label: "Education", value: profile.education },
    { label: "Status", value: labelize(profile.maritalStatus) },
  ].filter((s) => s.value);

  const family = [
    { label: "Father", value: profile.family.fatherOccupation },
    { label: "Mother", value: profile.family.motherOccupation },
    { label: "Siblings", value: profile.family.siblings },
    { label: "Native Place", value: profile.family.nativePlace },
  ].filter((f) => f.value);

  const badges = [
    profile.manglikStatus === "manglik" && "Manglik",
    profile.manglikStatus === "non-manglik" && "Non-Manglik",
    profile.diet === "vegetarian" && "Non-drinker",
    profile.verified && "Verified",
  ].filter(Boolean) as string[];

  return (
    <MobileShell wide bg="bg-background">
      {/* Decorative cover banner — never holds the photo itself, so a
          portrait photo never gets force-cropped into a wide letterbox. */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-700 to-gold-600">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <button
          onClick={() => router.back()}
          className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
        </button>
      </div>

      <div className="px-5 lg:px-8">
        <div className="-mt-14 mb-3 flex items-end gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg"
          >
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
            ) : (
              <UserRound size={44} strokeWidth={1.2} className="text-accent-foreground" />
            )}
          </motion.div>
          <div className="min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display truncate text-[22px] font-semibold text-foreground">
                {profile.fullName}
                {profile.age ? `, ${profile.age}` : ""}
              </h1>
              {profile.verified && <BadgeCheck size={16} className="shrink-0 text-sage-600" />}
            </div>
            <p className="truncate text-[13px] text-muted-foreground">
              {[profile.occupation, profile.city].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          {stats.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-muted px-1 py-3 text-center">
                  <p className="text-[13px] font-semibold text-foreground">{s.value}</p>
                  <p className="mt-0.5 text-[9.5px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {profile.about && (
            <>
              <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">About</p>
              <p className="mb-6 text-[14px] leading-relaxed text-foreground">{profile.about}</p>
            </>
          )}

          {family.length > 0 && (
            <>
              <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Family Details
              </p>
              <div className="mb-6 text-[13.5px] leading-[2] text-foreground">
                {family.map((f) => (
                  <div key={f.label} className="flex justify-between">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span>{f.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {(profile.education || profile.company) && (
            <>
              <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Education &amp; Career
              </p>
              <div className="mb-6 text-[13.5px] leading-[2] text-foreground">
                {profile.education && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Qualification</span>
                    <span>{profile.education}</span>
                  </div>
                )}
                {profile.occupation && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Occupation</span>
                    <span>{profile.occupation}</span>
                  </div>
                )}
                {profile.company && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span>{profile.company}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {profile.hobbies.length > 0 && (
            <>
              <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Hobbies &amp; Interests
              </p>
              <p className="mb-6 text-[13.5px] text-foreground">{profile.hobbies.join(" · ")}</p>
            </>
          )}

          {badges.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold ${
                    b === "Verified" ? "bg-accent text-accent-foreground" : "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300"
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="sticky bottom-0 mt-5 flex gap-3 border-t border-border bg-muted px-5 py-4 lg:px-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={message}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border-[1.5px] border-primary bg-card py-3.5 text-[14.5px] font-semibold text-primary"
        >
          <MessageCircle size={16} strokeWidth={1.8} />
          Message
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={expressInterest}
          disabled={busy || interestSent}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-primary to-primary/80 py-3.5 text-[14.5px] font-semibold text-primary-foreground shadow-button disabled:opacity-60"
        >
          <Heart size={16} strokeWidth={1.8} />
          {interestSent ? "Interest Sent" : "Express Interest"}
        </motion.button>
      </div>
    </MobileShell>
  );
}
