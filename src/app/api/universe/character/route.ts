import { NextResponse } from "next/server";
import {
  fetchCharacterDetail,
  isComicVineConfigured,
  pickImageUrl,
  plainText,
  searchMarvelCharacter,
} from "@/lib/comicvine";
import type { GuestCharacterPayload } from "@/lib/merge-guest";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isComicVineConfigured()) {
    return NextResponse.json(
      { error: "COMIC_VINE_API_KEY is not configured" },
      { status: 503 },
    );
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json(
      { error: "Enter at least 2 characters to search." },
      { status: 400 },
    );
  }

  try {
    const summary = await searchMarvelCharacter(q);
    if (!summary?.id) {
      return NextResponse.json(
        { error: `No Marvel character found for “${q}”.` },
        { status: 404 },
      );
    }

    const detail = await fetchCharacterDetail(summary.id);
    if (!detail) {
      return NextResponse.json(
        { error: `No Marvel character found for “${q}”.` },
        { status: 404 },
      );
    }

    const deck = plainText(detail.deck, 220);
    const desc = plainText(detail.description, 220);

    const payload: GuestCharacterPayload = {
      comicVineId: detail.id,
      name: detail.name || q,
      blurb: deck || desc || `${detail.name} appears in Marvel comics continuity.`,
      imageUrl: pickImageUrl(detail.image),
      teams: (detail.teams ?? []).map((t) => t.name).filter(Boolean),
      friendIds: (detail.character_friends ?? []).map((f) => f.id),
      enemyIds: (detail.character_enemies ?? []).map((e) => e.id),
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Comic Vine lookup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
