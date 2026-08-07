import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SiteFooter } from "@/components/SiteFooter";
import { AnalyticsEvent } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "How to Navigate",
  description:
    "A short guide to the Marvel Universe Map — galaxies, links, search, and what the colored lines mean.",
  alternates: {
    canonical: "/guide",
  },
};

const steps = [
  {
    title: "Start with a galaxy",
    body: "From the overview, click a galaxy hub — Street Level, Earth’s Mightiest, Cosmic, or Mutants. Each one is a corner of Marvel that Comic Vine could actually fill with characters.",
  },
  {
    title: "Click a hero",
    body: "Selecting a character opens a plain-language panel: who they are, why they matter, and related names you can jump to. Gold links dim; red links are the ones tied to the person you picked.",
  },
  {
    title: "Read the lines",
    body: "Solid gold = a Comic Vine relationship inside this galaxy (team, ally, or rival). Solid red = that link touches the selected hero. Dashed gold appears when you turn on links to other galaxies.",
  },
  {
    title: "Search anyone",
    body: "Type a name in the search box — even someone not on the starter map. If Comic Vine finds them, they’re added for this visit and connected to anyone already mapped who shares a team, friendship, or rivalry.",
  },
  {
    title: "Optional controls",
    body: "“Reveal more” shows secondary characters. “Links to other galaxies” draws bridges outward. Drag nodes to rearrange; Reset layout puts them back. Pan and scroll-zoom to explore.",
  },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#06080f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(230,36,41,0.14),transparent_45%),radial-gradient(ellipse_at_85%_30%,rgba(40,70,140,0.16),transparent_50%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-[#e62429] transition hover:text-[#ff3b3f]"
        >
          MARVEL
        </Link>
        <TrackedLink
          href="/map"
          event={AnalyticsEvent.CtaExploreMap}
          eventProperties={{ source: "guide_header" }}
          className="rounded-full bg-[#e62429] px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[#ff2d33]"
        >
          Open the map
        </TrackedLink>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-6 py-14 md:py-20">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8a857a]">
          Guide
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide text-[#f5f1e8] md:text-5xl">
          How to navigate
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#a8a296] md:text-lg">
          Whether you’re new to Marvel or already deep in it — follow galaxies and
          the relationships Comic Vine confirms. No comics homework required.
        </p>

        <ol className="mt-14 space-y-12">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5 md:gap-7">
              <span
                aria-hidden
                className="font-[family-name:var(--font-display)] text-3xl leading-none text-[#e62429]/80 md:text-4xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#f2efe8]">
                  {step.title}
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-[#9a9488] md:text-base">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center gap-4">
          <TrackedLink
            href="/map"
            event={AnalyticsEvent.CtaExploreMap}
            eventProperties={{ source: "guide_footer" }}
            className="inline-flex items-center gap-2 rounded-full bg-[#e62429] px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#ff2d33]"
          >
            Explore the map
            <span aria-hidden>→</span>
          </TrackedLink>
          <Link
            href="/"
            className="text-sm text-[#8a857a] transition hover:text-[#e8e2d6]"
          >
            Back home
          </Link>
        </div>
      </main>

      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
