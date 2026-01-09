import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

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
          justifyContent: "center",
          padding: 80,
          background: "hsl(222 84% 5%)",
          color: "hsl(214 32% 91%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "hsl(160 84% 39%)",
              color: "white",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              display: "flex",
              gap: 10,
            }}
          >
            <span>OptiImage</span>
            <span style={{ color: "hsl(215 16% 47%)" }}>Local</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Free Image Compressor &amp; Resizer
        </div>

        <div style={{ marginTop: 18, fontSize: 28, color: "hsl(215 20% 65%)" }}>
          Compress • Resize • Convert (JPG, PNG, WebP, AVIF, JXL) — 100%
          in-browser
        </div>

        <div
          style={{ marginTop: 42, display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {["No uploads", "Private", "Unlimited", "Fast WASM"].map((pill) => (
            <div
              key={pill}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid hsl(215 28% 17%)",
                background: "hsl(215 28% 17%)",
                color: "hsl(214 32% 91%)",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
