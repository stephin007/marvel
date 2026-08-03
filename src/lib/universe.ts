import { createHash } from "crypto";
import {
  universeEdges,
  universeNodes,
  type UniverseEdge,
  type UniverseNode,
} from "@/data/universe";

export function getNodeById(id: string): UniverseNode | undefined {
  return universeNodes.find((n) => n.id === id);
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
