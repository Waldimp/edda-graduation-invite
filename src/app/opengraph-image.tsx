import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const alt = `${event.title} · ${event.honoree}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 35%, #fff0db, #ffd094 70%)",
          color: "#c2306a",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 14, textTransform: "uppercase" }}>te invito a celebrar</div>
        <div style={{ fontSize: 110, marginTop: 18, color: "#ec4f86", textTransform: "uppercase" }}>mi graduación</div>
        <div style={{ fontSize: 56, marginTop: 18, fontStyle: "italic" }}>{event.honoree}</div>
        <div style={{ fontSize: 30, marginTop: 30, letterSpacing: 10, color: "#ec4f86" }}>{event.dateShort}</div>
      </div>
    ),
    { ...size },
  );
}
