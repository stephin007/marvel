import { Suspense } from "react";
import { UniverseMap } from "@/components/map/UniverseMap";

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
