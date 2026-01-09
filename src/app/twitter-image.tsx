import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
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
            marginTop: 30,
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Compress images in your browser
        </div>

        <div style={{ marginTop: 16, fontSize: 26, color: "hsl(215 20% 65%)" }}>
          JPG • PNG • WebP • AVIF • JXL — No uploads
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
