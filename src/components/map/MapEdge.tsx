"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

export type MapEdgeData = {
  label?: string;
  bridge?: boolean;
  related?: boolean;
  /** When true, a node is selected elsewhere — hide non-related labels */
  focusMode?: boolean;
};

function shortenLabel(label: string, max = 24) {
  const trimmed = label.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function MapEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps<Edge<MapEdgeData>>) {
  const edgeData = data ?? {};
  const label = edgeData.label?.trim();
  const related = Boolean(edgeData.related);
  const bridge = Boolean(edgeData.bridge);
  const focusMode = Boolean(edgeData.focusMode);
  const showLabel = Boolean(label) && (!focusMode || related);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Lift the chip above the stroke so the line never cuts through text.
  const offsetY = -16;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {showLabel ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute z-[12]"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + offsetY}px)`,
            }}
            title={label}
          >
            <span
              className={[
                "inline-block whitespace-nowrap rounded-md border px-2.5 py-1 text-[12px] font-semibold leading-none tracking-wide",
                "shadow-[0_4px_16px_rgba(0,0,0,0.65)]",
                related
                  ? "border-[#e62429]/60 bg-[#1a0a0c] text-[#f5f1e8]"
                  : bridge
                    ? "border-[#c9a227]/50 bg-[#161208] text-[#e8c547]"
                    : "border-white/20 bg-[#0c1018] text-[#f2efe8]",
              ].join(" ")}
            >
              {shortenLabel(label!)}
            </span>
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
