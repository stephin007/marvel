import { createRouteHandler } from "@openpanel/nextjs/server";

/** Proxy OpenPanel script + track calls (avoids common ad-blockers). */
export const { GET, POST } = createRouteHandler();
