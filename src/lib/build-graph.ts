import { galaxyMeta } from "@/data/galaxies";
import { characterSeeds, type CharacterSeed } from "@/data/seeds";
import type { NodeType, RegionId } from "@/data/universe";
import {
  fetchCharacterDetail,
  isComicVineConfigured,
  pickImageUrl,
  plainText,
  searchMarvelCharacter,
  type ComicVineCharacter,
  type ComicVineRef,
} from "@/lib/comicvine";

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  region: RegionId;
  core: boolean;
  position: { x: number; y: number };
  blurb: string;
  whyItMatters: string;
  imageUrl: string | null;
  comicVineId: number;
  teams: string[];
  /** Always mixed/comics for Vine-backed rows */
  canon: "comics";
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  kind: "teammate" | "ally" | "rival";
};

export type GraphGalaxy = {
  id: RegionId;
  label: string;
  description: string;
  hubPosition: { x: number; y: number };
  labelPosition: { x: number; y: number };
  count: number;
};

export type UniverseGraph = {
  configured: boolean;
  nodes: GraphNode[];
  edges: GraphEdge[];
  galaxies: GraphGalaxy[];
  error?: string;
};

type Resolved = {
  seed: CharacterSeed;
  detail: ComicVineCharacter;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function refIds(refs?: ComicVineRef[] | null): Set<number> {
  return new Set((refs ?? []).map((r) => r.id));
}

function teamNames(refs?: ComicVineRef[] | null): string[] {
  return (refs ?? []).map((r) => r.name).filter(Boolean);
}

function sharedTeam(
  a?: ComicVineRef[] | null,
  b?: ComicVineRef[] | null,
): string | null {
  const bIds = refIds(b);
  for (const t of a ?? []) {
    if (bIds.has(t.id)) return t.name;
  }
  return null;
}

function pairKey(a: string, b: string) {
  return [a, b].sort().join("--");
}

async function resolveSeed(seed: CharacterSeed): Promise<Resolved | null> {
  try {
    const summary = await searchMarvelCharacter(seed.searchName);
    if (!summary?.id) return null;

    const detail = await fetchCharacterDetail(summary.id);
    if (!detail) return null;
    return { seed, detail };
  } catch {
    return null;
  }
}

function toGraphNode(resolved: Resolved): GraphNode {
  const { seed, detail } = resolved;
  const deck = plainText(detail.deck, 220);
  const desc = plainText(detail.description, 220);

  return {
    id: seed.id,
    label: detail.name || seed.searchName,
    type: seed.role === "villain" ? "villain" : "hero",
    region: seed.galaxy,
    core: seed.core,
    position: seed.position,
    blurb: deck || desc || `${detail.name} appears in Marvel comics continuity.`,
    whyItMatters: seed.whyItMatters,
    imageUrl: pickImageUrl(detail.image),
    comicVineId: detail.id,
    teams: teamNames(detail.teams),
    canon: "comics",
  };
}

type EdgeDraft = {
  source: string;
  target: string;
  team: string | null;
  ally: boolean;
  rival: boolean;
};

function edgeLabel(draft: EdgeDraft): string {
  const parts: string[] = [];
  if (draft.team) parts.push(draft.team);
  if (draft.rival) parts.push("rivals");
  else if (draft.ally && !draft.team) parts.push("allies");
  return parts.join(" · ") || "linked";
}

function edgeKind(draft: EdgeDraft): GraphEdge["kind"] {
  if (draft.rival) return "rival";
  if (draft.team) return "teammate";
  return "ally";
}

function buildEdges(resolved: Resolved[]): GraphEdge[] {
  // One undirected edge per character pair — multiple Vine links used to
  // stack identical Bezier paths and make labels unreadable.
  const drafts = new Map<string, EdgeDraft>();

  const touch = (sourceSeedId: string, targetSeedId: string) => {
    if (sourceSeedId === targetSeedId) return null;
    const key = pairKey(sourceSeedId, targetSeedId);
    let draft = drafts.get(key);
    if (!draft) {
      const [source, target] = [sourceSeedId, targetSeedId].sort();
      draft = { source, target, team: null, ally: false, rival: false };
      drafts.set(key, draft);
    }
    return draft;
  };

  for (const a of resolved) {
    const friendIds = refIds(a.detail.character_friends);
    const enemyIds = refIds(a.detail.character_enemies);

    for (const b of resolved) {
      if (a.seed.id === b.seed.id) continue;

      const team = sharedTeam(a.detail.teams, b.detail.teams);
      if (team) {
        const draft = touch(a.seed.id, b.seed.id);
        if (draft && !draft.team) draft.team = team;
      }

      if (friendIds.has(b.detail.id)) {
        const draft = touch(a.seed.id, b.seed.id);
        if (draft) draft.ally = true;
      }

      if (enemyIds.has(b.detail.id)) {
        const draft = touch(a.seed.id, b.seed.id);
        if (draft) draft.rival = true;
      }
    }
  }

  return Array.from(drafts.entries()).map(([key, draft]) => ({
    id: `e-${key}`,
    source: draft.source,
    target: draft.target,
    label: edgeLabel(draft),
    kind: edgeKind(draft),
  }));
}

/**
 * Build the navigable universe from Comic Vine.
 * Galaxies with zero resolved characters are omitted.
 * Edges exist only when Comic Vine reports a team/friend/enemy link.
 */
export async function buildUniverseGraph(options?: {
  /** Include secondary seeds (Reveal more). Default true for server cache completeness. */
  includeSecondary?: boolean;
}): Promise<UniverseGraph> {
  if (!isComicVineConfigured()) {
    return {
      configured: false,
      nodes: [],
      edges: [],
      galaxies: [],
      error: "Add COMIC_VINE_API_KEY to enable the galaxy map.",
    };
  }

  const includeSecondary = options?.includeSecondary ?? true;
  const seeds = includeSecondary
    ? characterSeeds
    : characterSeeds.filter((s) => s.core);

  const resolved: Resolved[] = [];

  // Sequential + short delay to respect Comic Vine velocity limits
  for (const seed of seeds) {
    const item = await resolveSeed(seed);
    if (item) resolved.push(item);
    await sleep(350);
  }

  if (resolved.length === 0) {
    return {
      configured: true,
      nodes: [],
      edges: [],
      galaxies: [],
      error:
        "Comic Vine returned no characters for the seed list. Check the API key or try again later.",
    };
  }

  const nodes = resolved.map(toGraphNode);
  const edges = buildEdges(resolved);

  const galaxies = galaxyMeta
    .map((g) => ({
      ...g,
      count: nodes.filter((n) => n.region === g.id).length,
    }))
    .filter((g) => g.count > 0);

  return {
    configured: true,
    nodes,
    edges,
    galaxies,
  };
}
