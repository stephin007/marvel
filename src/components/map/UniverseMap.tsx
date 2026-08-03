"use client";

import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { regions, type UniverseNode } from "@/data/universe";
import {
  getNodeById,
  getVisibleEdges,
  getVisibleNodes,
} from "@/lib/universe";
import { DetailPanel } from "./DetailPanel";
import { MapNode, type MapNodeData } from "./MapNode";

const nodeTypes: NodeTypes = {
  marvel: MapNode,
};

function buildFlowNodes(
  nodes: UniverseNode[],
  selectedId: string | null,
  focusId: string | null,
): Node[] {
  const regionNodes: Node[] = regions.map((region) => ({
    id: `region-${region.id}`,
    type: "default",
    position: region.position,
    draggable: false,
    selectable: false,
    connectable: false,
    data: { label: region.label },
    className: "region-label-node",
    style: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      padding: 0,
      width: 220,
      color: "#8a857a",
      fontSize: 11,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      fontWeight: 600,
      pointerEvents: "none",
    },
  }));

  const entityNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: "marvel",
    position: n.position,
    data: {
      label: n.label,
      type: n.type,
      region: n.region,
      focused: focusId === n.id,
      selected: selectedId === n.id,
    } satisfies MapNodeData,
  }));

  return [...regionNodes, ...entityNodes];
}

function buildFlowEdges(
  showSecondary: boolean,
  visibleIds: Set<string>,
  highlightId: string | null,
): Edge[] {
  return getVisibleEdges(showSecondary, visibleIds).map((e) => {
    const related =
      highlightId &&
      (e.source === highlightId || e.target === highlightId);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: Boolean(related),
      style: {
        stroke: related ? "#e62429" : "rgba(201,162,39,0.35)",
        strokeWidth: related ? 2 : 1.2,
      },
      labelStyle: {
        fill: "#9a9488",
        fontSize: 9,
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: "#0a0e16",
        fillOpacity: 0.85,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: related ? "#e62429" : "rgba(201,162,39,0.45)",
      },
    };
  });
}

function MapInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const selectedNode =
    focusParam && getNodeById(focusParam) ? getNodeById(focusParam)! : null;
  const selectedId = selectedNode?.id ?? null;

  const { fitView, setCenter, getNode } = useReactFlow();
  const [userReveal, setUserReveal] = useState(false);
  const showSecondary =
    userReveal || Boolean(selectedNode && !selectedNode.core);

  const visibleUniverseNodes = useMemo(
    () => getVisibleNodes(showSecondary),
    [showSecondary],
  );
  const visibleIds = useMemo(
    () => new Set(visibleUniverseNodes.map((n) => n.id)),
    [visibleUniverseNodes],
  );

  const nodes = useMemo(
    () => buildFlowNodes(visibleUniverseNodes, selectedId, focusParam),
    [visibleUniverseNodes, selectedId, focusParam],
  );
  const edges = useMemo(
    () => buildFlowEdges(showSecondary, visibleIds, selectedId),
    [showSecondary, visibleIds, selectedId],
  );

  const focusCamera = useCallback(
    (id: string) => {
      const n = getNode(id);
      if (!n) return;
      const w = n.measured?.width ?? 140;
      const h = n.measured?.height ?? 56;
      setCenter(n.position.x + w / 2, n.position.y + h / 2, {
        zoom: 1.15,
        duration: 600,
      });
    },
    [getNode, setCenter],
  );

  useEffect(() => {
    if (!selectedId || !visibleIds.has(selectedId)) return;
    const t = window.setTimeout(() => focusCamera(selectedId), 200);
    return () => window.clearTimeout(t);
  }, [selectedId, visibleIds, focusCamera, showSecondary]);

  const updateFocusUrl = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("focus", id);
      else params.delete("focus");
      const qs = params.toString();
      router.replace(qs ? `/map?${qs}` : "/map", { scroll: false });
    },
    [router, searchParams],
  );

  const onSelect = useCallback(
    (id: string) => {
      updateFocusUrl(id);
      window.setTimeout(() => focusCamera(id), 50);
    },
    [focusCamera, updateFocusUrl],
  );

  const onClose = useCallback(() => {
    updateFocusUrl(null);
  }, [updateFocusUrl]);

  const toggleReveal = () => {
    if (userReveal || showSecondary) {
      setUserReveal(false);
      if (selectedNode && !selectedNode.core) {
        updateFocusUrl(null);
      }
    } else {
      setUserReveal(true);
    }
    window.setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 50);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#06080f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(230,36,41,0.12),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(40,70,140,0.18),transparent_50%),radial-gradient(ellipse_at_50%_90%,rgba(201,162,39,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(1px_1px_at_20px_30px,rgba(255,255,255,0.45),transparent),radial-gradient(1px_1px_at_80px_120px,rgba(255,255,255,0.3),transparent),radial-gradient(1.5px_1.5px_at_160px_80px,rgba(255,255,255,0.25),transparent)] [background-size:200px_200px]" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6"
      >
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-[#e62429] transition hover:text-[#ff3b3f] md:text-2xl"
          >
            MARVEL
          </Link>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#8a857a]">
            Universe Map
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={toggleReveal}
            className="rounded-full border border-white/15 bg-[#0c1018]/80 px-4 py-2 text-xs tracking-wide text-[#e8e2d6] backdrop-blur transition hover:border-[#c9a227]/50"
          >
            {showSecondary ? "Show core only" : "Reveal more"}
          </button>
          <button
            type="button"
            onClick={() => fitView({ padding: 0.2, duration: 500 })}
            className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-xs text-[#8a857a] transition hover:text-[#e8e2d6]"
          >
            Fit view
          </button>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute inset-0"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, n) => {
            if (n.id.startsWith("region-")) return;
            onSelect(n.id);
          }}
          onPaneClick={onClose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.35}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: "default" }}
          className="universe-flow"
        >
          <Background color="rgba(255,255,255,0.04)" gap={28} size={1} />
          <Controls
            showInteractive={false}
            className="!overflow-hidden !rounded-xl !border !border-white/10 !bg-[#0c1018]/90 !shadow-none"
          />
          <MiniMap
            className="!overflow-hidden !rounded-xl !border !border-white/10 !bg-[#0c1018]/90"
            maskColor="rgba(6,8,15,0.7)"
            nodeColor={(n) => {
              if (n.id.startsWith("region-")) return "transparent";
              const t = (n.data as MapNodeData)?.type;
              if (t === "team") return "#c9a227";
              if (t === "event") return "#5b8def";
              if (t === "villain") return "#94a3b8";
              return "#e62429";
            }}
          />
        </ReactFlow>
      </motion.div>

      <p className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-xs text-[11px] leading-relaxed text-[#6b6560] md:block">
        Drag to pan · scroll to zoom · tap a constellation point to learn how it
        connects.
      </p>

      <DetailPanel
        node={selectedNode}
        onClose={onClose}
        onSelectRelated={onSelect}
      />
    </div>
  );
}

export function UniverseMap() {
  return (
    <ReactFlowProvider>
      <MapInner />
    </ReactFlowProvider>
  );
}
