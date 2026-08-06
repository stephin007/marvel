const BASE = "https://comicvine.gamespot.com/api";
const USER_AGENT = "MarvelUniverseMap/1.0 (educational; contact via github.com/stephin007/marvel)";

export type ComicVineImage = {
  icon_url?: string;
  medium_url?: string;
  screen_url?: string;
  small_url?: string;
  super_url?: string;
  thumb_url?: string;
  original_url?: string;
};

export type ComicVineRef = {
  id: number;
  name: string;
  api_detail_url?: string;
};

export type ComicVineCharacter = {
  id: number;
  name: string;
  real_name?: string | null;
  deck?: string | null;
  description?: string | null;
  image?: ComicVineImage | null;
  publisher?: { id: number; name: string } | null;
  teams?: ComicVineRef[] | null;
  character_friends?: ComicVineRef[] | null;
  character_enemies?: ComicVineRef[] | null;
};

type ListResponse<T> = {
  error: string;
  status_code: number;
  results: T[] | T;
};

function getApiKey() {
  return process.env.COMIC_VINE_API_KEY?.trim() || "";
}

export function isComicVineConfigured() {
  return Boolean(getApiKey());
}

async function comicVineFetch<T>(
  path: string,
  query: Record<string, string> = {},
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("COMIC_VINE_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    format: "json",
    ...query,
  });

  const url = `${BASE}${path}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!res.ok) {
    throw new Error(`Comic Vine HTTP ${res.status} for ${path}`);
  }

  return (await res.json()) as T;
}

function isMarvelPublisher(publisher?: { name: string } | null) {
  const name = publisher?.name?.toLowerCase() ?? "";
  return name.includes("marvel");
}

/** Resolve a Marvel character via search, preferring exact name + Marvel publisher. */
export async function searchMarvelCharacter(
  searchName: string,
): Promise<ComicVineCharacter | null> {
  const data = await comicVineFetch<ListResponse<ComicVineCharacter>>(
    "/characters/",
    {
      filter: `name:${searchName}`,
      limit: "10",
      field_list: "id,name,deck,image,publisher,api_detail_url,real_name",
    },
  );

  if (data.status_code !== 1 || !Array.isArray(data.results)) {
    return null;
  }

  const marvelResults = data.results.filter((r) => isMarvelPublisher(r.publisher));
  const pool = marvelResults.length > 0 ? marvelResults : data.results;
  const exact = pool.find(
    (r) => r.name.toLowerCase() === searchName.toLowerCase(),
  );
  return exact ?? pool[0] ?? null;
}

export async function fetchCharacterDetail(
  id: number,
): Promise<ComicVineCharacter | null> {
  const data = await comicVineFetch<ListResponse<ComicVineCharacter>>(
    `/character/4005-${id}/`,
    {
      field_list:
        "id,name,real_name,deck,description,image,publisher,teams,character_friends,character_enemies",
    },
  );

  if (data.status_code !== 1) return null;
  const result = data.results;
  return Array.isArray(result) ? result[0] ?? null : result;
}

export function pickImageUrl(image?: ComicVineImage | null): string | null {
  if (!image) return null;
  return (
    image.super_url ||
    image.screen_url ||
    image.medium_url ||
    image.small_url ||
    image.original_url ||
    null
  );
}

/** Strip simple HTML from Comic Vine descriptions. */
export function plainText(html?: string | null, max = 280): string {
  if (!html) return "";
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
