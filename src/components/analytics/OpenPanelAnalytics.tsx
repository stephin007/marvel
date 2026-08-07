import { OpenPanelComponent } from "@openpanel/nextjs";

/**
 * OpenPanel bootstrap. Disabled until NEXT_PUBLIC_OPENPANEL_CLIENT_ID is set
 * so hooks like useOpenPanel stay safe during local/dev setup.
 */
export function OpenPanelAnalytics() {
  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID ?? "";

  return (
    <OpenPanelComponent
      clientId={clientId || "pending"}
      apiUrl="/api/op"
      scriptUrl="/api/op/op1.js"
      trackScreenViews
      trackOutgoingLinks
      trackAttributes
      disabled={!clientId}
      globalProperties={{
        app: "marvel-universe-map",
      }}
    />
  );
}
