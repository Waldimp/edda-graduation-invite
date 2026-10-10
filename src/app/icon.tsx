import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Sello dorado con el monograma sobre azul noche. */
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
          background: "#0e1a2b",
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
            background: "linear-gradient(135deg, #8a6b37, #e3cb94 55%, #b8955a)",
            color: "#fff6df",
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
