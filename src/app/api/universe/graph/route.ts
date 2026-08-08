import { NextResponse } from "next/server";
import { buildUniverseGraph } from "@/lib/build-graph";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const graph = await buildUniverseGraph({ includeSecondary: true });
    return NextResponse.json(graph, {
      headers: {
        // The seed graph changes only on deploy. Keep it at the edge for a day
        // so abusive traffic cannot repeatedly trigger Comic Vine graph builds.
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
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
