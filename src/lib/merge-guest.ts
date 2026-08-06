import type { RegionId } from "@/data/universe";
import type { GraphEdge, GraphNode, UniverseGraph } from "@/lib/build-graph";

export type GuestCharacterPayload = {
  comicVineId: number;
  name: string;
  blurb: string;
  imageUrl: string | null;
  teams: string[];
  friendIds: number[];
  enemyIds: number[];
  role?: "hero" | "villain";
};

function pairKey(a: string, b: string) {
  return [a, b].sort().join("--");
}

function sharedTeamName(a: string[], b: string[]): string | null {
  const lower = new Set(b.map((t) => t.toLowerCase()));
  for (const t of a) {
    if (lower.has(t.toLowerCase())) return t;
  }
  return null;
}

function edgeLabel(parts: {
  team: string | null;
  ally: boolean;
  rival: boolean;
}): string {
  const labels: string[] = [];
  if (parts.team) labels.push(parts.team);
  if (parts.rival) labels.push("rivals");
  else if (parts.ally && !parts.team) labels.push("allies");
  return labels.join(" · ") || "linked";
}

function edgeKind(parts: {
  team: string | null;
  ally: boolean;
  rival: boolean;
}): GraphEdge["kind"] {
  if (parts.rival) return "rival";
  if (parts.team) return "teammate";
  return "ally";
}

export function guestNodeId(comicVineId: number) {
  return `guest-${comicVineId}`;
}

/** Place a guest near the center of characters already in the galaxy. */
export function guestPosition(
  graph: UniverseGraph,
  galaxy: RegionId,
): { x: number; y: number } {
  const locals = graph.nodes.filter((n) => n.region === galaxy);
  if (locals.length === 0) {
    const hub = graph.galaxies.find((g) => g.id === galaxy)?.hubPosition;
    return hub ? { x: hub.x + 80, y: hub.y + 80 } : { x: 520, y: 300 };
  }
  const avgX =
    locals.reduce((sum, n) => sum + n.position.x, 0) / locals.length;
  const avgY =
    locals.reduce((sum, n) => sum + n.position.y, 0) / locals.length;
  const angle = (locals.length * 2.4) % (Math.PI * 2);
  return {
    x: avgX + Math.cos(angle) * 160,
    y: avgY + Math.sin(angle) * 120,
  };
}

/**
 * Pick a galaxy for a searched character: prefer active, else most Vine links,
 * else first available galaxy.
 */
export function pickGuestGalaxy(
  graph: UniverseGraph,
  guest: GuestCharacterPayload,
  preferred: RegionId | null,
): RegionId {
  if (preferred && graph.galaxies.some((g) => g.id === preferred)) {
    return preferred;
  }

  const friendSet = new Set(guest.friendIds);
  const enemySet = new Set(guest.enemyIds);
  const scores = new Map<RegionId, number>();

  for (const n of graph.nodes) {
    let score = 0;
    if (friendSet.has(n.comicVineId) || enemySet.has(n.comicVineId)) {
      score += 3;
    }
    if (sharedTeamName(guest.teams, n.teams)) score += 2;
    if (score === 0) continue;
    scores.set(n.region, (scores.get(n.region) ?? 0) + score);
  }

  let best: RegionId | null = null;
  let bestScore = 0;
  for (const [region, score] of scores) {
    if (score > bestScore) {
      best = region;
      bestScore = score;
    }
  }

  if (best) return best;
  if (graph.galaxies.some((g) => g.id === "earth")) return "earth";
  return graph.galaxies[0]?.id ?? "earth";
}

/**
 * Merge a Comic Vine guest into the session graph.
 * Edges only when Vine friends/enemies/shared teams match someone already mapped.
 */
export function mergeGuestIntoGraph(
  graph: UniverseGraph,
  guest: GuestCharacterPayload,
  galaxy: RegionId,
): { graph: UniverseGraph; nodeId: string; alreadyPresent: boolean } {
  const existing = graph.nodes.find((n) => n.comicVineId === guest.comicVineId);
  if (existing) {
    return {
      graph,
      nodeId: existing.id,
      alreadyPresent: true,
    };
  }

  const nodeId = guestNodeId(guest.comicVineId);
  const node: GraphNode = {
    id: nodeId,
    label: guest.name,
    type: guest.role === "villain" ? "villain" : "hero",
    region: galaxy,
    core: true,
    position: guestPosition(graph, galaxy),
    blurb:
      guest.blurb ||
      `${guest.name} appears in Marvel comics continuity.`,
    whyItMatters: "Added from Comic Vine search.",
    imageUrl: guest.imageUrl,
    comicVineId: guest.comicVineId,
    teams: guest.teams,
    canon: "comics",
  };

  const friendSet = new Set(guest.friendIds);
  const enemySet = new Set(guest.enemyIds);
  const newEdges: GraphEdge[] = [];
  const seen = new Set(
    graph.edges.map((e) => pairKey(e.source, e.target)),
  );

  for (const other of graph.nodes) {
    const team = sharedTeamName(guest.teams, other.teams);
    const ally = friendSet.has(other.comicVineId);
    const rival = enemySet.has(other.comicVineId);
    if (!team && !ally && !rival) continue;

    const key = pairKey(nodeId, other.id);
    if (seen.has(key)) continue;
    seen.add(key);

    const parts = { team, ally, rival };
    const [source, target] = [nodeId, other.id].sort();
    newEdges.push({
      id: `e-${key}`,
      source,
      target,
      label: edgeLabel(parts),
      kind: edgeKind(parts),
    });
  }

  const nodes = [...graph.nodes, node];
  const edges = [...graph.edges, ...newEdges];
  const galaxies = graph.galaxies.map((g) =>
    g.id === galaxy
      ? { ...g, count: nodes.filter((n) => n.region === g.id).length }
      : g,
  );

  return {
    graph: {
      ...graph,
      nodes,
      edges,
      galaxies,
    },
    nodeId,
    alreadyPresent: false,
  };
}
