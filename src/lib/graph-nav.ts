import type { RegionId } from "@/data/universe";
import type { GraphEdge, GraphNode, UniverseGraph } from "@/lib/build-graph";

export function getGraphNode(
  graph: UniverseGraph,
  id: string,
): GraphNode | undefined {
  return graph.nodes.find((n) => n.id === id);
}

export function filterGraphNodes(
  nodes: GraphNode[],
  showSecondary: boolean,
  galaxyId?: RegionId | null,
): GraphNode[] {
  return nodes.filter((n) => {
    if (!showSecondary && !n.core) return false;
    if (galaxyId && n.region !== galaxyId) return false;
    return true;
  });
}

export function isBridgeEdge(
  edge: GraphEdge,
  nodesById: Map<string, GraphNode>,
): boolean {
  const a = nodesById.get(edge.source);
  const b = nodesById.get(edge.target);
  if (!a || !b) return false;
  return a.region !== b.region;
}

export function getLocalEdges(
  edges: GraphEdge[],
  galaxyId: RegionId,
  nodesById: Map<string, GraphNode>,
  visibleIds: Set<string>,
): GraphEdge[] {
  return edges.filter((e) => {
    if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return false;
    const a = nodesById.get(e.source);
    const b = nodesById.get(e.target);
    return a?.region === galaxyId && b?.region === galaxyId;
  });
}

export function getBridgeEdgesFromGalaxy(
  edges: GraphEdge[],
  galaxyId: RegionId,
  nodesById: Map<string, GraphNode>,
  visibleIds: Set<string>,
): GraphEdge[] {
  return edges.filter((e) => {
    if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return false;
    if (!isBridgeEdge(e, nodesById)) return false;
    const a = nodesById.get(e.source);
    const b = nodesById.get(e.target);
    return a?.region === galaxyId || b?.region === galaxyId;
  });
}

export function getBridgePartners(
  edges: GraphEdge[],
  galaxyId: RegionId,
  nodesById: Map<string, GraphNode>,
  visibleIds: Set<string>,
): GraphNode[] {
  const bridges = getBridgeEdgesFromGalaxy(
    edges,
    galaxyId,
    nodesById,
    visibleIds,
  );
  const partners = new Map<string, GraphNode>();
  for (const e of bridges) {
    const a = nodesById.get(e.source);
    const b = nodesById.get(e.target);
    if (a && a.region !== galaxyId && visibleIds.has(a.id)) partners.set(a.id, a);
    if (b && b.region !== galaxyId && visibleIds.has(b.id)) partners.set(b.id, b);
  }
  return Array.from(partners.values());
}

export function getGalaxyBridgePairs(
  graph: UniverseGraph,
  visibleIds: Set<string>,
): Array<{ id: string; source: RegionId; target: RegionId }> {
  const nodesById = new Map(graph.nodes.map((n) => [n.id, n]));
  const pairs = new Map<string, { id: string; source: RegionId; target: RegionId }>();

  for (const e of graph.edges) {
    if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) continue;
    const a = nodesById.get(e.source);
    const b = nodesById.get(e.target);
    if (!a || !b || a.region === b.region) continue;
    const [left, right] = [a.region, b.region].sort();
    const id = `${left}--${right}`;
    if (!pairs.has(id)) {
      pairs.set(id, {
        id: `galaxy-bridge-${id}`,
        source: left as RegionId,
        target: right as RegionId,
      });
    }
  }

  return Array.from(pairs.values());
}

export function getRelatedIds(
  edges: GraphEdge[],
  id: string,
): string[] {
  const related = new Set<string>();
  for (const e of edges) {
    if (e.source === id) related.add(e.target);
    if (e.target === id) related.add(e.source);
  }
  return Array.from(related);
}
