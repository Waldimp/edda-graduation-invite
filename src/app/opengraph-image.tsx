import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { event } from "@/lib/event";

export const alt = `${event.title} · ${event.honoree}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Baja de Google Fonts solo las letras que se usan (en TTF, que es lo que entiende ImageResponse). */
async function googleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error(`No se pudo cargar la fuente ${family}`);
  return (await fetch(src)).arrayBuffer();
}

/**
 * Vista previa al compartir el link (WhatsApp, etc.): la hoja de la invitación
 * sobre el durazno de la portada, con la foto de Edda en su arco.
 */
export default async function Image() {
  const kicker = "te invito a celebrar";
  const title = "MI GRADUACIÓN";
  const degree = `${event.degree} · ${event.schoolShort}`;
  const when = `${event.weekday} ${event.dateShort} · ${event.time}`;
  const where = `${event.venue} · San Benito`;
  // Dos líneas parejas: "Edda Stefany" / "Monge Iraheta".
  const words = event.honoree.split(" ");
  const nameLines = [words.slice(0, 2).join(" "), words.slice(2).join(" ")].filter(Boolean);

  const [photo, script, serif, serifBold] = await Promise.all([
    readFile(join(process.cwd(), "public/photos/edda-portada.jpg")),
    googleFont("Great Vibes", 400, event.honoree),
    googleFont("Cormorant Garamond", 500, `${kicker}${degree}${when}${where}`.toUpperCase() + `${when}${where}${degree}`),
    googleFont("Cormorant Garamond", 600, title),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const pink = "#ec4f86";
  const pinkDark = "#c2306a";
  const ink = "#5c2a3c";
  const line = "rgba(236, 79, 134, 0.3)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 34,
          background: "radial-gradient(ellipse at 50% 30%, #fff0db, #ffd094 62%, #ffb978)",
        }}
      >
        {/* La hoja, con su doble línea como la carta del sobre */}
        <div
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            borderRadius: 10,
            background: "#fffbf5",
            border: `2px solid ${line}`,
            boxShadow: "0 20px 50px rgba(194, 48, 106, 0.18)",
          }}
        >
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, bottom: 14, border: `2px solid ${line}`, borderRadius: 6 }} />

          <div style={{ display: "flex", alignItems: "center", padding: "0 56px 0 70px", width: "100%" }}>
            {/* Foto en arco */}
            <div
              style={{
                display: "flex",
                width: 330,
                height: 452,
                flexShrink: 0,
                padding: 10,
                borderRadius: "175px 175px 22px 22px",
                background: "#fff",
                border: `2px solid ${line}`,
                boxShadow: "0 16px 36px rgba(194, 48, 106, 0.18)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo entiende <img> */}
              <img
                src={photoSrc}
                width={306}
                height={428}
                alt=""
                style={{ width: 306, height: 428, objectFit: "cover", borderRadius: "165px 165px 14px 14px" }}
              />
            </div>

            {/* Texto */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, marginLeft: 40 }}>
              <div style={{ fontFamily: "Cormorant", fontSize: 24, letterSpacing: 8, color: pink }}>{kicker.toUpperCase()}</div>
              <div style={{ fontFamily: "CormorantBold", fontSize: 68, marginTop: 6, color: pinkDark, letterSpacing: 2, whiteSpace: "nowrap" }}>
                {title}
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                <div style={{ width: 70, height: 2, background: `linear-gradient(90deg, transparent, ${pink})` }} />
                <div style={{ width: 12, height: 12, margin: "0 16px", borderRadius: 99, background: pink }} />
                <div style={{ width: 70, height: 2, background: `linear-gradient(270deg, transparent, ${pink})` }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
                {nameLines.map((l) => (
                  <div key={l} style={{ fontFamily: "Great Vibes", fontSize: 58, color: ink, lineHeight: 1.05 }}>
                    {l}
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "Cormorant", fontSize: 21, marginTop: 12, letterSpacing: 6, color: pinkDark }}>
                {degree.toUpperCase()}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 20,
                  padding: "10px 30px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #c2306a, #ec4f86 60%, #f47aa3)",
                  color: "#fff",
                }}
              >
                <div style={{ fontFamily: "Cormorant", fontSize: 26 }}>{when}</div>
              </div>
              <div style={{ fontFamily: "Cormorant", fontSize: 24, marginTop: 10, color: ink }}>{where}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Great Vibes", data: script, weight: 400, style: "normal" },
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "CormorantBold", data: serifBold, weight: 600, style: "normal" },
      ],
    },
  );
}
