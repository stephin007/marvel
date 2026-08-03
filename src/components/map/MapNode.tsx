"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { NodeType } from "@/data/universe";

export type MapNodeData = {
  label: string;
  type: NodeType;
  region: string;
  focused: boolean;
  selected: boolean;
};

const typeStyles: Record<
  NodeType,
  { ring: string; glow: string; badge: string; badgeLabel: string }
> = {
  hero: {
    ring: "border-[#e62429]/70",
    glow: "shadow-[0_0_24px_rgba(230,36,41,0.35)]",
    badge: "bg-[#e62429]/20 text-[#ff6b6b]",
    badgeLabel: "Hero",
  },
  villain: {
    ring: "border-[#94a3b8]/70",
    glow: "shadow-[0_0_24px_rgba(148,163,184,0.3)]",
    badge: "bg-[#94a3b8]/15 text-[#cbd5e1]",
    badgeLabel: "Villain",
  },
  team: {
    ring: "border-[#c9a227]/70",
    glow: "shadow-[0_0_24px_rgba(201,162,39,0.3)]",
    badge: "bg-[#c9a227]/20 text-[#e8c547]",
    badgeLabel: "Team",
  },
  event: {
    ring: "border-[#5b8def]/70",
    glow: "shadow-[0_0_24px_rgba(91,141,239,0.3)]",
    badge: "bg-[#5b8def]/20 text-[#8eb6ff]",
    badgeLabel: "Event",
  },
};

export function MapNode({ data }: NodeProps) {
  const node = data as MapNodeData;
  const styles = typeStyles[node.type];
  const active = node.selected || node.focused;

  return (
    <div
      className={[
        "min-w-[132px] max-w-[160px] rounded-full border px-4 py-2.5 text-center backdrop-blur-md transition-all duration-300",
        "bg-[#0c1018]/85",
        styles.ring,
        active ? `${styles.glow} scale-105 border-opacity-100` : "opacity-90",
        node.focused ? "animate-node-pulse" : "",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-1.5 !w-1.5 !border-0 !bg-[#c9a227]/80"
      />
      <p className="font-[family-name:var(--font-display)] text-[13px] font-semibold leading-tight tracking-wide text-[#f2efe8]">
        {node.label}
      </p>
      <span
        className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${styles.badge}`}
      >
        {styles.badgeLabel}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-1.5 !w-1.5 !border-0 !bg-[#c9a227]/80"
      />
    </div>
  );
}
