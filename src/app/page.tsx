import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/auth/get-started-button";

const FEATURES = [
  {
    title: "Upload your old biodata",
    body: "We read PDFs, Word files, images and text, then auto-fill the form for you.",
    tone: "bg-sage-100",
    stroke: "#4C6B4F",
  },
  {
    title: "Six elegant templates",
    body: "From traditional to modern minimal — switch anytime, your details carry over.",
    tone: "bg-gold-100",
    stroke: "#9C7A1F",
  },
  {
    title: "Instant, print-ready PDF",
    body: "Crisp A4 layout every time, ready to email or print for family.",
    tone: "bg-ivory-200",
    stroke: "#7A1526",
  },
];

export default async function LandingPage() {
  // Already signed in? Skip straight to the dashboard instead of showing
  // sign-in options again.
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <MobileShell>
      <section className="px-6 pb-2 pt-8">
        <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-[12px] font-semibold text-sage-700">
          ✦ AI-assisted · Free to start
        </div>
        <h1 className="font-display mb-3.5 text-[38px] font-semibold leading-[1.12] text-maroon-900">
          A biodata as graceful as your story
        </h1>
        <p className="mb-[26px] text-[15px] leading-relaxed text-ink-500">
          Upload an old biodata or fill a short guided form. Pick from elegant templates and download a
          print-ready PDF in minutes.
        </p>
        <GetStartedButton />
        <Link href="/start">
          <Button variant="secondary" size="block">
            Continue as Guest
          </Button>
        </Link>
        <p className="mt-3 text-center text-[12.5px] text-ink-300">No sign-up needed to explore templates</p>
      </section>

      <section className="mt-9 pl-6">
        <h2 className="font-display mb-3.5 pr-6 text-[21px] font-semibold text-ink-900">
          Templates for every family
        </h2>
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto pb-1.5">
          <div className="w-[132px] shrink-0">
            <div className="relative h-[172px] w-[132px] overflow-hidden rounded-md border border-border bg-white p-2.5">
              <div className="absolute inset-1.5 rounded-[4px] border-[1.5px] border-gold-500" />
              <div className="absolute left-4 right-4 top-4 text-center">
                <div className="mx-auto mb-2 h-[34px] w-[34px] rounded-full bg-ivory-200" />
                <div className="font-display text-[11px] font-semibold text-maroon-900">Priya Kapoor</div>
                <div className="mx-auto my-1.5 h-px w-9 bg-gold-500" />
                <div className="text-[7px] leading-relaxed text-ink-300">
                  Personal Details
                  <br />
                  Family Details
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-ink-700">Traditional Floral</p>
          </div>
          <div className="w-[132px] shrink-0">
            <div className="h-[172px] w-[132px] rounded-md border border-border bg-white p-3.5">
              <div className="mb-2.5 h-2 w-6 bg-ink-900" />
              <div className="text-[11px] font-bold text-ink-900">KAVYA REDDY</div>
              <div className="mt-2 text-[7px] leading-loose text-ink-300">
                Personal
                <br />
                Education
                <br />
                Contact
              </div>
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-ink-700">Modern Minimal</p>
          </div>
          <div className="w-7 shrink-0" />
        </div>
      </section>

      <section className="mt-9 border-y border-border bg-white px-6 py-6">
        <h2 className="font-display mb-5 text-[21px] font-semibold text-ink-900">Why families choose us</h2>
        <div className="flex flex-col gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3.5">
              <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md ${f.tone}`}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.stroke }} />
              </div>
              <div>
                <p className="mb-0.5 text-[14.5px] font-semibold text-ink-900">{f.title}</p>
                <p className="text-[13px] leading-relaxed text-ink-500">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 pb-10 pt-7 text-center">
        <p className="text-[12.5px] text-ink-300">Crafted with care, for every family&apos;s story.</p>
      </footer>
    </MobileShell>
  );
}
