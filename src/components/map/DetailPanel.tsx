"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { canonLabels } from "@/data/universe";
import type { GraphNode } from "@/lib/build-graph";

type DetailPanelProps = {
  node: GraphNode | null;
  related: GraphNode[];
  onClose: () => void;
  onSelectRelated: (id: string) => void;
};

export function DetailPanel({
  node,
  related,
  onClose,
  onSelectRelated,
}: DetailPanelProps) {
  return (
    <AnimatePresence>
      {node ? (
        <motion.aside
          key={node.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 max-h-[70vh] overflow-y-auto border-t border-white/10 bg-[#0a0e16]/95 p-5 shadow-[0_-20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:inset-x-auto md:bottom-6 md:right-6 md:top-24 md:max-h-[calc(100%-7rem)] md:w-[360px] md:rounded-2xl md:border"
          role="dialog"
          aria-label={`${node.label} details`}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a227]/90">
                  {node.type}
                </p>
                <span className="rounded border border-white/12 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[#8a857a]">
                  {canonLabels[node.canon]}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#f5f1e8]">
                {node.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-[#b8b3a8] transition hover:border-white/30 hover:text-white"
              aria-label="Close details"
            >
              Close
            </button>
          </div>

          {node.imageUrl ? (
            <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#121826]">
              <Image
                src={node.imageUrl}
                alt={node.label}
                fill
                className="object-cover"
                sizes="360px"
                unoptimized
              />
            </div>
          ) : null}

          <p className="text-sm leading-relaxed text-[#d4cfc3]">{node.blurb}</p>

          <div className="mt-4 border-l-2 border-[#e62429] pl-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#e62429]">
              Why it matters
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#e8e2d6]">
              {node.whyItMatters}
            </p>
          </div>

          {node.teams.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#8a857a]">
                Teams (Comic Vine)
              </p>
              <p className="text-xs leading-relaxed text-[#b8b3a8]">
                {node.teams.slice(0, 8).join(" · ")}
                {node.teams.length > 8 ? "…" : ""}
              </p>
            </div>
          ) : null}

          {related.length > 0 ? (
            <div className="mt-5">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#8a857a]">
                Connected (via Comic Vine)
              </p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRelated(r.id)}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs text-[#e8e2d6] transition hover:border-[#e62429]/50 hover:bg-[#e62429]/10"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-5 text-[10px] leading-relaxed text-[#5c574f]">
            Character data © Comic Vine / Fandom. Non-commercial educational use.
          </p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
