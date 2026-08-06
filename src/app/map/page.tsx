import type { Metadata } from "next";
import { Suspense } from "react";
import { UniverseMap } from "@/components/map/UniverseMap";

export const metadata: Metadata = {
  title: "Explore the Map",
  description:
    "Open Marvel galaxies on an interactive map — follow Comic Vine–backed links between heroes, search any character, and learn how the universe connects.",
  alternates: {
    canonical: "/map",
  },
  openGraph: {
    title: "Explore the Marvel Universe Map",
    description:
      "Navigate galaxies of heroes and relationships. Search characters, follow links, and see how Marvel stories connect.",
    url: "/map",
  },
};

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center bg-[#06080f] text-sm text-[#8a857a]">
          Loading universe…
        </div>
      }
    >
      <UniverseMap />
    </Suspense>
  );
}
