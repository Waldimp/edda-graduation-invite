import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Monograma en rosa intenso sobre el durazno de la paleta. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffd094",
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #c2306a, #ec4f86 60%, #f47aa3)",
            color: "#fffbf5",
            fontSize: 240,
            fontFamily: "serif",
            fontStyle: "italic",
          }}
        >
          {event.monogram}
        </div>
      </div>
    ),
    { ...size },
  );
}
