import { NextResponse } from "next/server";
import { buildUniverseGraph } from "@/lib/build-graph";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const graph = await buildUniverseGraph({ includeSecondary: true });
    return NextResponse.json(graph, {
      headers: {
        // Short browser cache; Comic Vine responses are cached in fetch revalidate
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to build universe graph";
    return NextResponse.json(
      {
        configured: Boolean(process.env.COMIC_VINE_API_KEY),
        nodes: [],
        edges: [],
        galaxies: [],
        error: message,
      },
      { status: 500 },
    );
  }
}
