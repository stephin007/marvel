import { NextResponse } from "next/server";
import { fetchMarvelCharacter } from "@/lib/universe";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const characterId = Number(id);

  if (!Number.isFinite(characterId) || characterId <= 0) {
    return NextResponse.json({ error: "Invalid character id" }, { status: 400 });
  }

  if (!process.env.MARVEL_PUBLIC_KEY || !process.env.MARVEL_PRIVATE_KEY) {
    return NextResponse.json(
      {
        error: "Marvel API keys not configured",
        enrichment: null,
      },
      { status: 200 },
    );
  }

  try {
    const enrichment = await fetchMarvelCharacter(characterId);
    return NextResponse.json(
      { enrichment },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch character", enrichment: null },
      { status: 502 },
    );
  }
}
