"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, BadgeCheck, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useRequireAuth } from "@/lib/use-require-auth";
import { PublicProfileCard } from "@/lib/public-profile";

const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist"];

export default function DiscoverPage() {
  const status = useRequireAuth();
  const router = useRouter();

  const [q, setQ] = useState("");
  const [religion, setReligion] = useState("");
  const [city, setCity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [cards, setCards] = useState<PublicProfileCard[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (religion) params.set("religion", religion);
    if (city) params.set("city", city);
    if (minAge) params.set("minAge", minAge);
    if (maxAge) params.set("maxAge", maxAge);

    const timeout = setTimeout(() => {
      fetch(`/api/discover?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Couldn't load profiles."))))
        .then((data) => {
          setCards(data.cards);
          setTotal(data.total);
        })
        .catch((e) => setError(e.message));
    }, 250);

    return () => clearTimeout(timeout);
  }, [status, q, religion, city, minAge, maxAge]);

  const activeFilters = [
    religion && { key: "religion", label: religion, clear: () => setReligion("") },
    city && { key: "city", label: city, clear: () => setCity("") },
    (minAge || maxAge) && {
      key: "age",
      label: `Age ${minAge || "18"}–${maxAge || "70"}`,
      clear: () => {
        setMinAge("");
        setMaxAge("");
      },
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  return (
    <MobileShell wide>
      <div className="px-5 pt-5 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[26px] font-semibold text-primary">Discover</h1>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card"
          >
            <SlidersHorizontal size={18} strokeWidth={1.8} className="text-foreground" />
          </button>
        </div>

        <div className="mb-3.5 flex items-center gap-2.5 rounded-md border-[1.5px] border-border bg-card px-3.5 py-3">
          <Search size={16} strokeWidth={1.8} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, profession..."
            className="flex-1 border-none bg-transparent text-[14px] text-foreground outline-none"
          />
        </div>

        {showFilters && (
          <div className="mb-4 flex flex-col gap-3 rounded-md border border-border bg-card p-4">
            <div>
              <p className="mb-2 text-[12px] font-medium text-foreground">Religion</p>
              <div className="flex flex-wrap gap-2">
                {RELIGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReligion(religion === r ? "" : r)}
                    className={`rounded-full border px-3 py-1.5 text-[12.5px] ${
                      religion === r ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="mb-2 text-[12px] font-medium text-foreground">Age</p>
                <div className="flex items-center gap-2">
                  <input
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value.replace(/\D/g, ""))}
                    placeholder="Min"
                    className="w-full min-w-0 rounded-md border border-border px-2.5 py-2 text-[13px] outline-none"
                  />
                  <span className="text-muted-foreground">–</span>
                  <input
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value.replace(/\D/g, ""))}
                    placeholder="Max"
                    className="w-full min-w-0 rounded-md border border-border px-2.5 py-2 text-[13px] outline-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="mb-2 text-[12px] font-medium text-foreground">Location</p>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full min-w-0 rounded-md border border-border px-2.5 py-2 text-[13px] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="no-scrollbar mb-3.5 flex gap-2 overflow-x-auto">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={f.clear}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[12.5px] font-semibold text-primary-foreground"
              >
                {f.label}
                <X size={11} strokeWidth={2.5} />
              </button>
            ))}
          </div>
        )}

        {error && <p className="mb-3 text-[13px] text-primary">{error}</p>}
        {cards === null && !error && <p className="text-[13.5px] text-muted-foreground">Loading…</p>}
        {cards && <p className="mb-3.5 text-[12.5px] text-muted-foreground">{total} profiles match your filters</p>}

        {cards && cards.length === 0 && (
          <div className="rounded-lg border-[1.5px] border-dashed border-border bg-card py-14 text-center">
            <p className="text-[14px] text-muted-foreground">No profiles match right now — try widening your filters.</p>
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence>
            {cards?.map((c) => (
              <motion.button
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => router.push(`/profile/${c.id}`)}
                className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent to-muted">
                  {c.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photoUrl} alt={c.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound size={36} strokeWidth={1.3} className="text-accent-foreground" />
                    </div>
                  )}
                  {c.verified && (
                    <span className="absolute right-2 top-2 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-sage-600">
                      <BadgeCheck size={13} strokeWidth={2.5} className="text-white" />
                    </span>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[13.5px] font-semibold text-foreground">
                    {c.fullName.split(" ")[0]}
                    {c.age ? `, ${c.age}` : ""}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">{c.occupation || "—"}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {[c.city, c.religion].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
