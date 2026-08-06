import type { Metadata } from "next";
import { LandingHero } from "@/components/landing/LandingHero";

export const metadata: Metadata = {
  title: "Marvel Universe Map — See how Marvel connects",
  description:
    "An interactive constellation of Marvel heroes, teams, and galaxies — explore relationships and see how the universe fits together.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <LandingHero />;
}
