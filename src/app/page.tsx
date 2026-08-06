import type { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";

export const metadata: Metadata = {
  title: "Marvel Universe Map — Newcomer Guide",
  description:
    "Finally understand the Marvel Universe. An interactive constellation of heroes, teams, and galaxies — built for people just getting started.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <LandingHero />;
}
