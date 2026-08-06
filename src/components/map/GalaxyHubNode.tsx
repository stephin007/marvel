"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { RegionId } from "@/data/universe";

export type GalaxyHubData = {
  galaxyId: RegionId;
  label: string;
  description: string;
  count: number;
};

export function GalaxyHubNode({ data }: NodeProps) {
  const hub = data as GalaxyHubData;

  return (
    <div className="group min-w-[200px] max-w-[240px] cursor-pointer rounded-2xl border border-[#e62429]/35 bg-[#0c1018]/90 px-5 py-4 text-center shadow-[0_0_40px_rgba(230,36,41,0.12)] backdrop-blur-md transition duration-300 hover:border-[#e62429]/70 hover:shadow-[0_0_48px_rgba(230,36,41,0.28)]">
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-[#c9a227]/70"
      />
      <p className="text-[9px] uppercase tracking-[0.24em] text-[#c9a227]/90">
        Galaxy
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#f5f1e8]">
        {hub.label}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[#9a9488]">
        {hub.description}
      </p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-[#6b6560]">
        {hub.count} places · enter →
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-[#c9a227]/70"
      />
    </div>
  );
}
