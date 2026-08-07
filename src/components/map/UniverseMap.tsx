"use client";

import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  useReactFlow,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useOpenPanel } from "@openpanel/nextjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { RegionId } from "@/data/universe";
import type { GraphNode, UniverseGraph } from "@/lib/build-graph";
import { AnalyticsEvent } from "@/lib/analytics";
import {
  filterGraphNodes,
  getBridgeEdgesFromGalaxy,
  getBridgePartners,
  getGalaxyBridgePairs,
  getGraphNode,
  getLocalEdges,
  getRelatedIds,
} from "@/lib/graph-nav";
import {
  mergeGuestIntoGraph,
  pickGuestGalaxy,
  type GuestCharacterPayload,
} from "@/lib/merge-guest";
import { DetailPanel } from "./DetailPanel";
import { GalaxyHubNode, type GalaxyHubData } from "./GalaxyHubNode";
import { MapEdge, type MapEdgeData } from "./MapEdge";
import { MapNode, type MapNodeData } from "./MapNode";
import { SiteFooter } from "@/components/SiteFooter";

const nodeTypes: NodeTypes = {
  marvel: MapNode,
  galaxyHub: GalaxyHubNode,
};

const edgeTypes: EdgeTypes = {
  map: MapEdge,
};

type PositionMap = Record<string, { x: number; y: number }>;

function isRegionId(
  value: string | null,
  galaxyIds: Set<string>,
): value is RegionId {
  return Boolean(value && galaxyIds.has(value));
}

function buildEntityNode(
  n: GraphNode,
  selectedId: string | null,
  focusId: string | null,
  position: { x: number; y: number },
  dimmed = false,
): Node {
  return {
    id: n.id,
    type: "marvel",
    position,
    draggable: !dimmed,
    connectable: false,
    data: {
      label: n.label,
      type: n.type,
      region: n.region,
      focused: focusId === n.id,
      selected: selectedId === n.id,
      dimmed,
    } satisfies MapNodeData,
  };
}

function toFlowEdge(
  e: { id: string; source: string; target: string; label?: string },
  highlightId: string | null,
  bridge = false,
): Edge {
  const related = Boolean(
    highlightId &&
      (e.source === highlightId || e.target === highlightId),
  );
  const stroke = bridge
    ? "rgba(201,162,39,0.55)"
    : related
      ? "#e62429"
      : "rgba(201,162,39,0.45)";
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: "map",
    data: {
      label: e.label,
      bridge,
      related,
      focusMode: Boolean(highlightId),
    } satisfies MapEdgeData,
    animated: false,
    style: {
      stroke,
      strokeWidth: related || bridge ? 2.25 : 1.4,
      strokeDasharray: bridge ? "6 4" : undefined,
      opacity: highlightId && !related ? 0.28 : 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
      color: stroke,
    },
  };
}

function MapStatus({
  title,
  body,
  href,
  hrefLabel,
}: {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center bg-[#06080f] px-6 text-center">
      <p className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-[#e62429]">
        MARVEL
      </p>
      <h1 className="mt-4 max-w-md text-xl text-[#f5f1e8]">{title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#9a9488]">
        {body}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-6 rounded-full bg-[#e62429] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff2d33]"
        >
          {hrefLabel ?? "Open link"}
        </a>
      ) : null}
      <Link
        href="/"
        className="mt-4 text-xs uppercase tracking-[0.18em] text-[#6b6560] hover:text-[#e8e2d6]"
      >
        Back home
      </Link>
    </div>
  );
}

function MapInner({ baseGraph }: { baseGraph: UniverseGraph }) {
  const op = useOpenPanel();
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const galaxyParam = searchParams.get("galaxy");
  const bridgesParam = searchParams.get("bridges") === "1";

  const [graph, setGraph] = useState<UniverseGraph>(baseGraph);
  const [userReveal, setUserReveal] = useState(false);
  const [positionOverrides, setPositionOverrides] = useState<PositionMap>({});
  const [flowNodes, setFlowNodes] = useState<Node[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const galaxyIds = useMemo(
    () => new Set(graph.galaxies.map((g) => g.id)),
    [graph.galaxies],
  );
  const nodesById = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes],
  );

  const selectedNode = focusParam
    ? getGraphNode(graph, focusParam) ?? null
    : null;
  const selectedId = selectedNode?.id ?? null;

  const activeGalaxy: RegionId | null = isRegionId(galaxyParam, galaxyIds)
    ? galaxyParam
    : selectedNode && galaxyIds.has(selectedNode.region)
      ? selectedNode.region
      : null;

  const { fitView, setCenter, getNode } = useReactFlow();
  const showBridges = bridgesParam;
  const showSecondary =
    userReveal || Boolean(selectedNode && !selectedNode.core);

  const syncUrl = useCallback(
    (next: {
      galaxy?: RegionId | null;
      focus?: string | null;
      bridges?: boolean;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      if ("galaxy" in next) {
        if (next.galaxy) params.set("galaxy", next.galaxy);
        else params.delete("galaxy");
      }
      if ("focus" in next) {
        if (next.focus) params.set("focus", next.focus);
        else params.delete("focus");
      }
      if ("bridges" in next) {
        if (next.bridges) params.set("bridges", "1");
        else params.delete("bridges");
      }
      const qs = params.toString();
      router.replace(qs ? `/map?${qs}` : "/map", { scroll: false });
    },
    [router, searchParams],
  );

  const visibleAll = useMemo(
    () => filterGraphNodes(graph.nodes, showSecondary),
    [graph.nodes, showSecondary],
  );
  const visibleIds = useMemo(
    () => new Set(visibleAll.map((n) => n.id)),
    [visibleAll],
  );
  const galaxyNodes = useMemo(
    () =>
      activeGalaxy
        ? filterGraphNodes(graph.nodes, showSecondary, activeGalaxy)
        : [],
    [graph.nodes, showSecondary, activeGalaxy],
  );

  /** Structural / visual node list — positions owned by flowNodes after init. */
  const derivedNodes = useMemo(() => {
    if (!activeGalaxy) {
      return graph.galaxies.map((g) => ({
        id: `galaxy-${g.id}`,
        type: "galaxyHub",
        position: g.hubPosition,
        draggable: false,
        connectable: false,
        data: {
          galaxyId: g.id,
          label: g.label,
          description: g.description,
          count: filterGraphNodes(graph.nodes, showSecondary, g.id).length,
        } satisfies GalaxyHubData,
      }));
    }

    const meta = graph.galaxies.find((g) => g.id === activeGalaxy);
    const labelNode: Node | null = meta
      ? {
          id: `region-${meta.id}`,
          type: "default",
          position: meta.labelPosition,
          draggable: false,
          selectable: false,
          connectable: false,
          data: { label: meta.label },
          className: "region-label-node",
          style: {
            background: "transparent",
            border: "none",
            boxShadow: "none",
            padding: 0,
            width: 240,
            color: "#8a857a",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
            pointerEvents: "none",
          },
        }
      : null;

    const local = galaxyNodes.map((n) =>
      buildEntityNode(
        n,
        selectedId,
        focusParam,
        n.position,
        false,
      ),
    );

    const partners = showBridges
      ? getBridgePartners(
          graph.edges,
          activeGalaxy,
          nodesById,
          visibleIds,
        ).map((n) =>
          buildEntityNode(n, selectedId, focusParam, n.position, true),
        )
      : [];

    return [...(labelNode ? [labelNode] : []), ...local, ...partners];
  }, [
    activeGalaxy,
    graph.galaxies,
    graph.nodes,
    graph.edges,
    showSecondary,
    galaxyNodes,
    selectedId,
    focusParam,
    showBridges,
    nodesById,
    visibleIds,
  ]);

  const derivedSignature = useMemo(
    () =>
      [
        activeGalaxy ?? "overview",
        showBridges ? "1" : "0",
        showSecondary ? "1" : "0",
        selectedId ?? "",
        focusParam ?? "",
        derivedNodes.map((n) => n.id).join(","),
        graph.nodes.map((n) => n.id).join(","),
      ].join("|"),
    [
      activeGalaxy,
      showBridges,
      showSecondary,
      selectedId,
      focusParam,
      derivedNodes,
      graph.nodes,
    ],
  );

  useEffect(() => {
    setFlowNodes((current) => {
      const prev = new Map(current.map((n) => [n.id, n]));
      return derivedNodes.map((n) => {
        const old = prev.get(n.id);
        return {
          ...n,
          position:
            positionOverrides[n.id] ?? old?.position ?? n.position,
          measured: old?.measured,
          width: old?.width,
          height: old?.height,
        };
      });
    });
    // positionOverrides intentionally omitted: drag updates them without full re-derive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivedSignature, derivedNodes]);

  const edges = useMemo(() => {
    if (!activeGalaxy) {
      return getGalaxyBridgePairs(graph, visibleIds).map((pair) =>
        toFlowEdge(
          {
            id: pair.id,
            source: `galaxy-${pair.source}`,
            target: `galaxy-${pair.target}`,
            label: "linked",
          },
          null,
          true,
        ),
      );
    }

    const localIds = new Set(galaxyNodes.map((n) => n.id));
    const local = getLocalEdges(
      graph.edges,
      activeGalaxy,
      nodesById,
      localIds,
    ).map((e) => toFlowEdge(e, selectedId, false));

    if (!showBridges) return local;

    const bridges = getBridgeEdgesFromGalaxy(
      graph.edges,
      activeGalaxy,
      nodesById,
      visibleIds,
    ).map((e) => toFlowEdge(e, selectedId, true));

    return [...local, ...bridges];
  }, [
    activeGalaxy,
    graph,
    visibleIds,
    galaxyNodes,
    nodesById,
    selectedId,
    showBridges,
  ]);

  const related = useMemo(() => {
    if (!selectedNode) return [];
    return getRelatedIds(graph.edges, selectedNode.id)
      .map((id) => nodesById.get(id))
      .filter((n): n is GraphNode => Boolean(n))
      .slice(0, 6);
  }, [selectedNode, graph.edges, nodesById]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setFlowNodes((nds) => applyNodeChanges(changes, nds));

    const positionChanges = changes.filter((c) => c.type === "position");
    if (positionChanges.length === 0) return;

    setPositionOverrides((prev) => {
      const next = { ...prev };
      for (const change of positionChanges) {
        if (change.type === "position" && change.position) {
          next[change.id] = change.position;
        }
      }
      return next;
    });
  }, []);

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
    window.setTimeout(() => fitView({ padding: 0.22, duration: 450 }), 80);
  }, [activeGalaxy, showBridges, showSecondary, fitView]);

  useEffect(() => {
    if (!selectedId || !activeGalaxy) return;
    const t = window.setTimeout(() => focusCamera(selectedId), 220);
    return () => window.clearTimeout(t);
  }, [selectedId, activeGalaxy, focusCamera]);

  const enterGalaxy = useCallback(
    (id: RegionId) => {
      op.track(AnalyticsEvent.MapEnterGalaxy, { galaxy: id });
      syncUrl({ galaxy: id, focus: null, bridges: false });
    },
    [op, syncUrl],
  );

  const leaveGalaxy = useCallback(() => {
    op.track(AnalyticsEvent.MapLeaveGalaxy, {
      galaxy: activeGalaxy,
    });
    setUserReveal(false);
    syncUrl({ galaxy: null, focus: null, bridges: false });
  }, [op, activeGalaxy, syncUrl]);

  const onSelect = useCallback(
    (id: string) => {
      const node = nodesById.get(id);
      if (!node) return;
      op.track(AnalyticsEvent.MapSelectCharacter, {
        character_id: node.id,
        character_name: node.label,
        character_type: node.type,
        galaxy: node.region,
        source: activeGalaxy && node.region !== activeGalaxy ? "bridge" : "map",
      });
      if (activeGalaxy && node.region !== activeGalaxy) {
        syncUrl({ galaxy: node.region, focus: id, bridges: false });
        return;
      }
      syncUrl({
        galaxy: activeGalaxy ?? node.region,
        focus: id,
        bridges: showBridges,
      });
      window.setTimeout(() => focusCamera(id), 50);
    },
    [op, activeGalaxy, showBridges, syncUrl, focusCamera, nodesById],
  );

  const onClose = useCallback(() => {
    syncUrl({ focus: null, galaxy: activeGalaxy, bridges: showBridges });
  }, [syncUrl, activeGalaxy, showBridges]);

  const resetLayout = useCallback(() => {
    op.track(AnalyticsEvent.MapResetLayout, { galaxy: activeGalaxy });
    setPositionOverrides({});
    setFlowNodes((current) =>
      current.map((n) => {
        const entity = nodesById.get(n.id);
        if (!entity) return n;
        return { ...n, position: entity.position };
      }),
    );
    window.setTimeout(() => fitView({ padding: 0.22, duration: 500 }), 50);
  }, [op, activeGalaxy, fitView, nodesById]);

  const bridgeCount = activeGalaxy
    ? getBridgeEdgesFromGalaxy(
        graph.edges,
        activeGalaxy,
        nodesById,
        visibleIds,
      ).length
    : 0;

  const toggleReveal = () => {
    const nextReveal = !(userReveal || showSecondary);
    op.track(AnalyticsEvent.MapToggleReveal, {
      galaxy: activeGalaxy,
      revealed: nextReveal,
    });
    if (userReveal || showSecondary) {
      setUserReveal(false);
      if (selectedNode && !selectedNode.core) {
        syncUrl({ focus: null, galaxy: activeGalaxy, bridges: showBridges });
      }
    } else {
      setUserReveal(true);
    }
  };

  const toggleBridges = () => {
    const next = !showBridges;
    op.track(AnalyticsEvent.MapToggleBridges, {
      galaxy: activeGalaxy,
      bridges: next,
      bridge_count: bridgeCount,
    });
    syncUrl({
      galaxy: activeGalaxy,
      focus: selectedId,
      bridges: next,
    });
  };

  const runSearch = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (q.length < 2) {
        setSearchError("Enter at least 2 characters.");
        return;
      }

      setSearchBusy(true);
      setSearchError(null);

      try {
        const res = await fetch(
          `/api/universe/character?q=${encodeURIComponent(q)}`,
        );
        const data = (await res.json()) as GuestCharacterPayload & {
          error?: string;
        };

        if (!res.ok) {
          op.track(AnalyticsEvent.MapSearch, {
            query: q,
            success: false,
            error: data.error ?? "not_found",
            galaxy: activeGalaxy,
          });
          setSearchError(data.error ?? "Character not found.");
          return;
        }

        const galaxy = pickGuestGalaxy(graph, data, activeGalaxy);
        const merged = mergeGuestIntoGraph(graph, data, galaxy);
        op.track(AnalyticsEvent.MapSearch, {
          query: q,
          success: true,
          character_id: merged.nodeId,
          galaxy,
        });
        setGraph(merged.graph);
        setUserReveal(true);
        syncUrl({ galaxy, focus: merged.nodeId, bridges: false });
        setSearchQuery("");
        window.setTimeout(() => focusCamera(merged.nodeId), 280);
      } catch (err) {
        op.track(AnalyticsEvent.MapSearch, {
          query: q,
          success: false,
          error: err instanceof Error ? err.message : "search_failed",
          galaxy: activeGalaxy,
        });
        setSearchError(
          err instanceof Error ? err.message : "Search failed. Try again.",
        );
      } finally {
        setSearchBusy(false);
      }
    },
    [op, graph, activeGalaxy, syncUrl, focusCamera],
  );

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    void runSearch(searchQuery);
  };

  const activeGalaxyMeta = activeGalaxy
    ? graph.galaxies.find((g) => g.id === activeGalaxy)
    : undefined;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#06080f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(230,36,41,0.12),transparent_45%),radial-gradient(ellipse_at_80%_20%,rgba(40,70,140,0.18),transparent_50%),radial-gradient(ellipse_at_50%_90%,rgba(201,162,39,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(1px_1px_at_20px_30px,rgba(255,255,255,0.45),transparent),radial-gradient(1px_1px_at_80px_120px,rgba(255,255,255,0.3),transparent),radial-gradient(1.5px_1.5px_at_160px_80px,rgba(255,255,255,0.25),transparent)] [background-size:200px_200px]" />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between md:p-6"
      >
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-[0.12em] text-[#e62429] transition hover:text-[#ff3b3f] md:text-2xl"
          >
            MARVEL
          </Link>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#8a857a]">
            {activeGalaxyMeta
              ? `${activeGalaxyMeta.label} galaxy`
              : "Universe · Comic Vine galaxies"}
          </p>
          <Link
            href="/guide"
            className="mt-2 inline-block text-[11px] text-[#6b6560] underline-offset-2 transition hover:text-[#e8e2d6] hover:underline"
          >
            How to navigate
          </Link>
        </div>

        <div className="pointer-events-auto flex w-full max-w-xl flex-col gap-2 md:items-end">
          <form
            onSubmit={onSearchSubmit}
            className="flex w-full items-stretch gap-2"
          >
            <label className="sr-only" htmlFor="character-search">
              Search any Marvel character
            </label>
            <input
              id="character-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError(null);
              }}
              placeholder="Search any Marvel character (Comic Vine)"
              disabled={searchBusy}
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-[#0c1018]/90 px-4 py-2 text-sm text-[#f2efe8] outline-none backdrop-blur placeholder:text-[#6b6560] focus:border-[#c9a227]/55 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={searchBusy}
              className="shrink-0 rounded-full bg-[#e62429] px-4 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-[#ff2d33] disabled:opacity-50"
            >
              {searchBusy ? "Looking…" : "Find"}
            </button>
          </form>
          {searchError ? (
            <p className="text-right text-[11px] text-[#ff8a8a]">{searchError}</p>
          ) : (
            <p className="text-right text-[10px] text-[#6b6560]">
              Not in the map yet? Search adds them for this session.
            </p>
          )}

          <div className="flex max-w-[min(100%,28rem)] flex-wrap justify-end gap-2">
            {activeGalaxy ? (
              <>
                <button
                  type="button"
                  onClick={leaveGalaxy}
                  className="rounded-full border border-white/15 bg-[#0c1018]/80 px-4 py-2 text-xs tracking-wide text-[#e8e2d6] backdrop-blur transition hover:border-[#c9a227]/50"
                >
                  All galaxies
                </button>
                <button
                  type="button"
                  onClick={toggleBridges}
                  disabled={bridgeCount === 0}
                  className="rounded-full border border-white/15 bg-[#0c1018]/80 px-4 py-2 text-xs tracking-wide text-[#e8e2d6] backdrop-blur transition hover:border-[#c9a227]/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {showBridges
                    ? "Hide other galaxies"
                    : `Links to other galaxies${bridgeCount ? ` (${bridgeCount})` : ""}`}
                </button>
                <button
                  type="button"
                  onClick={toggleReveal}
                  className="rounded-full border border-white/15 bg-[#0c1018]/80 px-4 py-2 text-xs tracking-wide text-[#e8e2d6] backdrop-blur transition hover:border-[#c9a227]/50"
                >
                  {showSecondary ? "Core only" : "Reveal more"}
                </button>
                <button
                  type="button"
                  onClick={resetLayout}
                  className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-xs text-[#8a857a] transition hover:text-[#e8e2d6]"
                >
                  Reset layout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => fitView({ padding: 0.22, duration: 500 })}
                className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-xs text-[#8a857a] transition hover:text-[#e8e2d6]"
              >
                Fit view
              </button>
            )}
          </div>
        </div>
      </motion.header>

      <motion.div
        key={activeGalaxy ?? "overview"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="absolute inset-0"
      >
        <ReactFlow
          nodes={flowNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          nodesDraggable={Boolean(activeGalaxy)}
          nodesConnectable={false}
          elementsSelectable
          selectNodesOnDrag={false}
          panOnDrag
          onNodeClick={(_, n) => {
            if (n.type === "galaxyHub") {
              enterGalaxy((n.data as GalaxyHubData).galaxyId);
              return;
            }
            if (n.id.startsWith("region-")) return;
            onSelect(n.id);
          }}
          onPaneClick={onClose}
          fitView
          fitViewOptions={{ padding: 0.22 }}
          minZoom={0.3}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
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
              if (n.type === "galaxyHub") return "#e62429";
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
        {activeGalaxy ? (
          <>
            <span className="text-[#c9a227]">Solid gold</span> = link in this
            galaxy.{" "}
            <span className="text-[#e62429]">Solid red</span> = tied to the
            selected hero.
            {showBridges ? (
              <>
                {" "}
                <span className="text-[#c9a227]">Dashed gold</span> = link into
                another galaxy.
              </>
            ) : null}
          </>
        ) : (
          "Galaxies appear only when Comic Vine returns characters. Search any hero to add them for this visit."
        )}
      </p>

      <SiteFooter variant="map" />

      <DetailPanel
        node={selectedNode}
        related={related}
        onClose={onClose}
        onSelectRelated={onSelect}
      />
    </div>
  );
}

function MapLoader() {
  const op = useOpenPanel();
  const [graph, setGraph] = useState<UniverseGraph | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/universe/graph")
      .then(async (res) => {
        const data = (await res.json()) as UniverseGraph;
        if (cancelled) return;
        setGraph(data);

        if (!data.configured) {
          op.track(AnalyticsEvent.MapLoadFailed, { reason: "missing_api_key" });
          return;
        }
        if (data.galaxies.length === 0) {
          op.track(AnalyticsEvent.MapLoadFailed, {
            reason: "empty_galaxies",
            error: data.error ?? undefined,
          });
          return;
        }
        op.track(AnalyticsEvent.MapLoaded, {
          galaxy_count: data.galaxies.length,
          node_count: data.nodes.length,
          edge_count: data.edges.length,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load";
        setLoadError(message);
        op.track(AnalyticsEvent.MapLoadFailed, {
          reason: "fetch_error",
          error: message,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [op]);

  if (loadError) {
    return (
      <MapStatus
        title="Couldn’t load the universe"
        body={loadError}
      />
    );
  }

  if (!graph) {
    return (
      <MapStatus
        title="Consulting Comic Vine…"
        body="Fetching characters and relationships. First load can take a minute because we pace requests for the API."
      />
    );
  }

  if (!graph.configured) {
    return (
      <MapStatus
        title="Comic Vine key required"
        body="The galaxy map is built from Comic Vine data. Add COMIC_VINE_API_KEY to .env.local (free key from Comic Vine), restart the server, then reopen /map."
        href="https://comicvine.gamespot.com/api/"
        hrefLabel="Get a Comic Vine API key"
      />
    );
  }

  if (graph.galaxies.length === 0) {
    return (
      <MapStatus
        title="No galaxies yet"
        body={
          graph.error ??
          "Comic Vine didn’t return enough character data to build galaxies."
        }
        href="https://comicvine.gamespot.com/api/"
        hrefLabel="Check Comic Vine API"
      />
    );
  }

  return (
    <ReactFlowProvider>
      <MapInner baseGraph={graph} />
    </ReactFlowProvider>
  );
}

export function UniverseMap() {
  return <MapLoader />;
}
