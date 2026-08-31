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
    tone: "bg-sage-100 dark:bg-sage-900/30",
    stroke: "#4C6B4F",
  },
  {
    title: "Six elegant templates",
    body: "From traditional to modern minimal — switch anytime, your details carry over.",
    tone: "bg-accent",
    stroke: "#9C7A1F",
  },
  {
    title: "Instant, print-ready PDF",
    body: "Crisp A4 layout every time, ready to email or print for family.",
    tone: "bg-muted",
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
        <div className="mb-[18px] inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-[12px] font-semibold text-sage-700 dark:bg-sage-900/30 dark:text-sage-300">
          ✦ AI-assisted · Free to start
        </div>
        <h1 className="font-display mb-3.5 text-[38px] font-semibold leading-[1.12] text-primary">
          A biodata as graceful as your story
        </h1>
        <p className="mb-[26px] text-[15px] leading-relaxed text-muted-foreground">
          Upload an old biodata or fill a short guided form. Pick from elegant templates and download a
          print-ready PDF in minutes.
        </p>
        <GetStartedButton />
        <Link href="/start">
          <Button variant="secondary" className="w-full">
            Continue as Guest
          </Button>
        </Link>
        <p className="mt-3 text-center text-[12.5px] text-muted-foreground">No sign-up needed to explore templates</p>
      </section>

      <section className="mt-9 pl-6">
        <h2 className="font-display mb-3.5 pr-6 text-[21px] font-semibold text-foreground">
          Templates for every family
        </h2>
        <div className="no-scrollbar flex gap-3.5 overflow-x-auto pb-1.5">
          <div className="w-[132px] shrink-0">
            <div className="relative h-[172px] w-[132px] overflow-hidden rounded-md border border-border bg-card p-2.5">
              <div className="absolute inset-1.5 rounded-[4px] border-[1.5px] border-gold-500" />
              <div className="absolute left-4 right-4 top-4 text-center">
                <div className="mx-auto mb-2 h-[34px] w-[34px] rounded-full bg-muted" />
                <div className="font-display text-[11px] font-semibold text-primary">Priya Kapoor</div>
                <div className="mx-auto my-1.5 h-px w-9 bg-gold-500" />
                <div className="text-[7px] leading-relaxed text-muted-foreground">
                  Personal Details
                  <br />
                  Family Details
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-foreground">Traditional Floral</p>
          </div>
          <div className="w-[132px] shrink-0">
            <div className="h-[172px] w-[132px] rounded-md border border-border bg-card p-3.5">
              <div className="mb-2.5 h-2 w-6 bg-foreground" />
              <div className="text-[11px] font-bold text-foreground">KAVYA REDDY</div>
              <div className="mt-2 text-[7px] leading-loose text-muted-foreground">
                Personal
                <br />
                Education
                <br />
                Contact
              </div>
            </div>
            <p className="mt-2 text-center text-[12px] font-medium text-foreground">Modern Minimal</p>
          </div>
          <div className="w-7 shrink-0" />
        </div>
      </section>

      <section className="mt-9 border-y border-border bg-card px-6 py-6">
        <h2 className="font-display mb-5 text-[21px] font-semibold text-foreground">Why families choose us</h2>
        <div className="flex flex-col gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3.5">
              <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-md ${f.tone}`}>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.stroke }} />
              </div>
              <div>
                <p className="mb-0.5 text-[14.5px] font-semibold text-foreground">{f.title}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 pb-10 pt-7 text-center">
        <p className="text-[12.5px] text-muted-foreground">Crafted with care, for every family&apos;s story.</p>
      </footer>
    </MobileShell>
  );
}
