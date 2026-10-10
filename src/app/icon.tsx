import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Sello de lacre rosado con el monograma sobre el rosa del menú. */
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
          background: "#e8acae",
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
            background: "linear-gradient(135deg, #a85d6c, #d38d97 55%, #c47c86)",
            color: "#fff4f2",
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
