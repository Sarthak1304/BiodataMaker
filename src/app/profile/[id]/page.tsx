"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MessageCircle, Heart, UserRound, BadgeCheck } from "lucide-react";
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
          <p className="mb-4 text-[14px] text-ink-500">{error}</p>
          <button onClick={() => router.push("/discover")} className="text-[13.5px] font-semibold text-maroon-700">
            Back to Discover
          </button>
        </div>
      </MobileShell>
    );
  }

  if (!profile) {
    return (
      <MobileShell>
        <p className="px-6 pt-10 text-[13.5px] text-ink-500">Loading…</p>
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
    <MobileShell wide bg="bg-white">
      <div className="relative h-[300px] bg-gradient-to-br from-gold-100 via-ivory-200 to-sage-100">
        <div className="absolute inset-x-5 top-5 flex justify-between">
          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85"
          >
            <ChevronLeft size={18} strokeWidth={1.8} className="text-ink-700" />
          </button>
        </div>
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoUrl} alt={profile.fullName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound size={64} strokeWidth={1.2} className="text-gold-600" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-900/45 to-transparent" />
        <div className="absolute bottom-5 left-6 flex items-center gap-2">
          <h1 className="font-display text-[26px] font-semibold text-white">
            {profile.fullName}
            {profile.age ? `, ${profile.age}` : ""}
          </h1>
          {profile.verified && <BadgeCheck size={18} className="text-sage-400" />}
        </div>
        <p className="absolute bottom-1.5 left-6 text-[12.5px] text-white/90">
          {[profile.occupation, profile.city].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="px-5 pt-5 lg:px-8">
        {stats.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-white px-1 py-3 text-center">
                <p className="text-[13px] font-semibold text-ink-900">{s.value}</p>
                <p className="mt-0.5 text-[9.5px] text-ink-300">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {profile.about && (
          <>
            <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-300">About</p>
            <p className="mb-6 text-[14px] leading-relaxed text-ink-700">{profile.about}</p>
          </>
        )}

        {family.length > 0 && (
          <>
            <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-300">
              Family Details
            </p>
            <div className="mb-6 text-[13.5px] leading-[2] text-ink-700">
              {family.map((f) => (
                <div key={f.label} className="flex justify-between">
                  <span className="text-ink-300">{f.label}</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {(profile.education || profile.company) && (
          <>
            <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-300">
              Education &amp; Career
            </p>
            <div className="mb-6 text-[13.5px] leading-[2] text-ink-700">
              {profile.education && (
                <div className="flex justify-between">
                  <span className="text-ink-300">Qualification</span>
                  <span>{profile.education}</span>
                </div>
              )}
              {profile.occupation && (
                <div className="flex justify-between">
                  <span className="text-ink-300">Occupation</span>
                  <span>{profile.occupation}</span>
                </div>
              )}
              {profile.company && (
                <div className="flex justify-between">
                  <span className="text-ink-300">Company</span>
                  <span>{profile.company}</span>
                </div>
              )}
            </div>
          </>
        )}

        {profile.hobbies.length > 0 && (
          <>
            <p className="mb-2.5 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-300">
              Hobbies &amp; Interests
            </p>
            <p className="mb-6 text-[13.5px] text-ink-700">{profile.hobbies.join(" · ")}</p>
          </>
        )}

        {badges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b}
                className={`rounded-full px-3 py-1.5 text-[11.5px] font-semibold ${
                  b === "Verified" ? "bg-gold-100 text-gold-700" : "bg-sage-100 text-sage-700"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mt-5 flex gap-3 border-t border-border bg-ivory-50 px-5 py-4 lg:px-8">
        <button
          onClick={message}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border-[1.5px] border-maroon-700 bg-white py-3.5 text-[14.5px] font-semibold text-maroon-700"
        >
          <MessageCircle size={16} strokeWidth={1.8} />
          Message
        </button>
        <button
          onClick={expressInterest}
          disabled={busy || interestSent}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-gradient-to-br from-maroon-700 to-maroon-900 py-3.5 text-[14.5px] font-semibold text-gold-100 disabled:opacity-60"
        >
          <Heart size={16} strokeWidth={1.8} />
          {interestSent ? "Interest Sent" : "Express Interest"}
        </button>
      </div>
    </MobileShell>
  );
}
