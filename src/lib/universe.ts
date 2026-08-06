import {
  galaxies,
  universeEdges,
  universeNodes,
  type RegionId,
  type UniverseEdge,
  type UniverseNode,
} from "@/data/universe";
import { createHash } from "crypto";

export function getNodeById(id: string): UniverseNode | undefined {
  return universeNodes.find((n) => n.id === id);
}

export function getGalaxyById(id: RegionId) {
  return galaxies.find((g) => g.id === id);
}

export function getRelatedNodeIds(id: string): string[] {
  const related = new Set<string>();
  for (const edge of universeEdges) {
    if (edge.source === id) related.add(edge.target);
    if (edge.target === id) related.add(edge.source);
  }
  return Array.from(related);
}

export function getVisibleNodes(showSecondary: boolean): UniverseNode[] {
  return showSecondary
    ? universeNodes
    : universeNodes.filter((n) => n.core);
}

export function getNodesInGalaxy(
  galaxyId: RegionId,
  showSecondary: boolean,
): UniverseNode[] {
  return getVisibleNodes(showSecondary).filter((n) => n.region === galaxyId);
}

export function isBridgeEdge(edge: UniverseEdge): boolean {
  const a = getNodeById(edge.source);
  const b = getNodeById(edge.target);
  if (!a || !b) return false;
  return a.region !== b.region;
}

export function getLocalEdges(
  galaxyId: RegionId,
  visibleIds: Set<string>,
): UniverseEdge[] {
  return universeEdges.filter((e) => {
    if (!visibleIds.has(e.source) || !visibleIds.has(e.target)) return false;
    const a = getNodeById(e.source);
    const b = getNodeById(e.target);
    return a?.region === galaxyId && b?.region === galaxyId;
  });
}

/** Edges that leave this galaxy; both endpoints must exist in the full curated set. */
export function getBridgeEdgesFromGalaxy(
  galaxyId: RegionId,
  showSecondary: boolean,
): UniverseEdge[] {
  const allowed = new Set(getVisibleNodes(showSecondary).map((n) => n.id));
  return universeEdges.filter((e) => {
    if (!allowed.has(e.source) || !allowed.has(e.target)) return false;
    if (!isBridgeEdge(e)) return false;
    const a = getNodeById(e.source);
    const b = getNodeById(e.target);
    return a?.region === galaxyId || b?.region === galaxyId;
  });
}

export function getBridgePartnerNodes(
  galaxyId: RegionId,
  showSecondary: boolean,
): UniverseNode[] {
  const bridges = getBridgeEdgesFromGalaxy(galaxyId, showSecondary);
  const partners = new Map<string, UniverseNode>();
  for (const e of bridges) {
    const a = getNodeById(e.source);
    const b = getNodeById(e.target);
    if (a && a.region !== galaxyId) partners.set(a.id, a);
    if (b && b.region !== galaxyId) partners.set(b.id, b);
  }
  return Array.from(partners.values());
}

/** Galaxy pairs that share at least one bridge (for overview hints). */
export function getGalaxyBridgePairs(
  showSecondary: boolean,
): Array<{ id: string; source: RegionId; target: RegionId }> {
  const allowed = new Set(getVisibleNodes(showSecondary).map((n) => n.id));
  const pairs = new Map<string, { id: string; source: RegionId; target: RegionId }>();

  for (const e of universeEdges) {
    if (!allowed.has(e.source) || !allowed.has(e.target)) continue;
    const a = getNodeById(e.source);
    const b = getNodeById(e.target);
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

export function getVisibleEdges(
  showSecondary: boolean,
  visibleIds: Set<string>,
): UniverseEdge[] {
  return universeEdges.filter(
    (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
  );
}

export type MarvelCharacterEnrichment = {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string | null;
};

function marvelAuthParams() {
  const publicKey = process.env.MARVEL_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return null;
  }
  const ts = Date.now().toString();
  const hash = createHash("md5")
    .update(ts + privateKey + publicKey)
    .digest("hex");
  return { ts, apikey: publicKey, hash };
}

export async function fetchMarvelCharacter(
  characterId: number,
): Promise<MarvelCharacterEnrichment | null> {
  const auth = marvelAuthParams();
  if (!auth) {
    return null;
  }

  const params = new URLSearchParams({
    ts: auth.ts,
    apikey: auth.apikey,
    hash: auth.hash,
  });

  const url = `https://gateway.marvel.com/v1/public/characters/${characterId}?${params}`;
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as {
    data?: {
      results?: Array<{
        id: number;
        name: string;
        description: string;
        thumbnail?: { path: string; extension: string };
      }>;
    };
  };

  const character = json.data?.results?.[0];
  if (!character) {
    return null;
  }

  const path = character.thumbnail?.path;
  const extension = character.thumbnail?.extension;
  const unavailable = path?.includes("image_not_available");
  const thumbnailUrl =
    path && extension && !unavailable
      ? `${path}/portrait_uncanny.${extension}`
      : null;

  return {
    id: character.id,
    name: character.name,
    description: character.description?.trim() || "",
    thumbnailUrl,
  };
}
