import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Marvel Universe Map — interactive guide for newcomers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "#06080f",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(230,36,41,0.35), transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(40,70,140,0.4), transparent 45%)",
          }}
        />
        {/* Constellation dots */}
        <div
          style={{
            position: "absolute",
            top: 120,
            right: 160,
            width: 12,
            height: 12,
            borderRadius: 999,
            background: "#e62429",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 180,
            right: 280,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#c9a227",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 360,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#e62429",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: 10,
              color: "#e62429",
              lineHeight: 1,
            }}
          >
            MARVEL
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: "#f5f1e8",
              letterSpacing: 1,
              maxWidth: 900,
              lineHeight: 1.2,
            }}
          >
            Universe Map
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#a8a296",
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            An interactive constellation that helps newcomers understand how
            heroes, teams, and galaxies connect.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
