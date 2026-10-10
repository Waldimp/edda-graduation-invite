"use client";

import Image from "next/image";
import { motion as m } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { event } from "@/lib/event";
import { Blossom, Confetti, FallingPetals, FlowerCluster, GradCap, Sparkles, Sprig } from "./Decor";
import { invitePaperRect } from "./InviteStage";
import { easeCinema, easeInOut, easeSoft } from "./motion";

/** Momento en que la carta, ya fuera del sobre, empieza a extenderse como hoja. */
const SHEET_AT_MS = 3000;
/** Cuánto tarda la carta en extenderse hasta ser la hoja de la invitación. */
const SHEET_S = 1.4;
/** Duración total de la apertura; al terminar, la hoja ya es la pantalla de Invitación. */
export const OPEN_MS = SHEET_AT_MS + SHEET_S * 1000 + 100;

/** Las piezas del sobre se desvanecen y caen un poco cuando la carta ya salió. */
const ENVELOPE_AWAY = { opacity: 0, y: 26 };
const ENVELOPE_AWAY_T = { delay: 2.3, duration: 0.7, ease: easeSoft };

type Rect = { top: number; left: number; width: number; height: number };

/**
 * Portada: sobre crema con el botón de tela y florcitas, sobre fondo durazno.
 * Al tocar: el botón se desabrocha, la solapa se abre, la carta sube y el sobre
 * se desvanece; la misma carta se extiende hasta ser la hoja de la invitación.
 */
export function CoverStage({ opening, onOpen, onOpened }: { opening: boolean; onOpen: () => void; onOpened: () => void }) {
  const cb = useRef(onOpened);
  const cardRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState<{ from: Rect; to: Rect } | null>(null);
  useLayoutEffect(() => {
    cb.current = onOpened;
  });

  useEffect(() => {
    if (!opening) return;
    const grow = window.setTimeout(() => {
      const r = cardRef.current?.getBoundingClientRect();
      if (r) setSheet({ from: { top: r.top, left: r.left, width: r.width, height: r.height }, to: invitePaperRect() });
    }, SHEET_AT_MS);
    const done = window.setTimeout(() => cb.current(), OPEN_MS);
    return () => {
      window.clearTimeout(grow);
      window.clearTimeout(done);
    };
  }, [opening]);

  return (
    <m.section className="cover-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Fondo durazno: se funde con el papel de la invitación mientras la hoja se extiende */}
      <m.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: sheet ? 0 : 1 }}
        transition={{ duration: SHEET_S, ease: easeInOut }}
      >
        <div className="cover-bg" aria-hidden />
        <Sparkles />
        <FallingPetals />
      </m.div>

      {/* Ramilletes en las esquinas: se abren hacia afuera al abrir el sobre */}
      <m.div
        className="pointer-events-none absolute left-0 top-0 z-[2]"
        initial={{ opacity: 0, x: -30, y: -30 }}
        animate={opening ? { opacity: 0, x: -60, y: -60 } : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.4, ease: easeCinema, delay: opening ? 0.2 : 0.6 }}
      >
        <FlowerCluster className="-left-6 top-20 sm:left-6 sm:top-10" scale={1.25} />
      </m.div>
      <m.div
        className="pointer-events-none absolute bottom-0 right-0 z-[2]"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={opening ? { opacity: 0, x: 60, y: 60 } : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.4, ease: easeCinema, delay: opening ? 0.2 : 0.8 }}
      >
        <FlowerCluster className="-right-6 bottom-24 rotate-180 sm:right-6 sm:bottom-14" scale={1.25} />
      </m.div>

      <m.div
        className="cover-top"
        initial={{ opacity: 0, y: -16 }}
        animate={opening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: easeCinema, delay: opening ? 0 : 0.4 }}
      >
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-rose-dark/90">{event.classOf}</p>
        <p className="script mt-2 text-5xl text-rose-dark drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)] sm:text-6xl">{event.honoreeShort}</p>
      </m.div>

      <m.div
        className="relative"
        initial={{ y: 40, opacity: 0, scale: 0.94 }}
        animate={
          opening
            ? { y: "-2vh", opacity: 1, scale: 1, transition: { duration: 2, ease: easeCinema } }
            : { y: 0, opacity: 1, scale: 1, transition: { duration: 1.4, ease: easeCinema, delay: 0.2 } }
        }
      >
        <div className="parallax" style={{ "--depth": "10px" } as CSSProperties}>
        <div className="envelope">
          <m.div
            className="env-back"
            initial={false}
            animate={opening ? ENVELOPE_AWAY : { opacity: 1, y: 0 }}
            transition={opening ? ENVELOPE_AWAY_T : { duration: 0.6 }}
          />

          {/* Birrete: sale volando desde dentro del sobre y se va con el sobre */}
          <m.div
            className="absolute inset-0 z-[2]"
            initial={false}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={opening ? { delay: 2.4, duration: 0.6 } : { duration: 0 }}
          >
            <m.div
              className="grad-cap"
              initial={false}
              animate={
                opening
                  ? { y: [0, -260, -230], x: [0, 30, 20], rotate: [0, -25, -12], opacity: [0, 1, 1], scale: [0.6, 1.1, 1] }
                  : { y: 0, x: 0, rotate: 0, opacity: 0, scale: 0.6 }
              }
              transition={{ delay: opening ? 1.2 : 0, duration: 1.8, times: [0, 0.6, 1], ease: easeCinema }}
            >
              <GradCap className="h-auto w-full" />
            </m.div>
          </m.div>

          {/* Carta interior: al extenderse, la reemplaza la hoja idéntica de abajo */}
          <m.div
            ref={cardRef}
            className="env-card letter"
            style={{ visibility: sheet ? "hidden" : "visible" }}
            initial={false}
            animate={opening ? { y: "-46%" } : { y: 0 }}
            transition={{ delay: opening ? 1.25 : 0, duration: 1.6, ease: easeInOut }}
          >
            <CardText />
          </m.div>

          <m.div
            className="env-pocket"
            initial={false}
            animate={opening ? ENVELOPE_AWAY : { opacity: 1, y: 0 }}
            transition={opening ? ENVELOPE_AWAY_T : { duration: 0.6 }}
          />

          {/* Solapa: se abre en 3D, queda detrás de la carta y se va con el sobre */}
          <m.div
            className="env-flap"
            initial={false}
            animate={opening ? { rotateX: 180, zIndex: [5, 5, 1], ...ENVELOPE_AWAY } : { rotateX: 0, zIndex: 5, opacity: 1, y: 0 }}
            transition={
              opening
                ? {
                    delay: 0.55,
                    duration: 1.1,
                    ease: easeInOut,
                    zIndex: { delay: 0.55, duration: 1.1, times: [0, 0.5, 0.51] },
                    opacity: ENVELOPE_AWAY_T,
                    y: ENVELOPE_AWAY_T,
                  }
                : { duration: 0.6 }
            }
          />

          <m.div
            className="wax-seal"
            initial={false}
            animate={opening ? { scale: [1, 1.18, 0.4], opacity: [1, 1, 0], rotate: [0, -25, 160] } : { scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.75, ease: easeSoft }}
          >
            <div className="absolute -left-5 -top-6 rotate-[-30deg]">
              <Sprig size={56} />
            </div>
            <Image src="/decor/boton.png" alt="" fill sizes="96px" priority className="cover-button" />
            <div className="absolute -right-3 -top-4">
              <Blossom size={30} color="#fff" center="var(--gold)" />
            </div>
          </m.div>

          {opening && (
            <m.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <Confetti />
            </m.div>
          )}
        </div>
        </div>
      </m.div>

      {/*
        La misma carta, ahora libre del sobre: se estira hasta el lugar exacto de la
        hoja de Invitación y se vuelve un poquito translúcida, como esa hoja.
      */}
      {sheet && (
        <m.div
          className="letter letter-sheet absolute z-[17] overflow-hidden"
          initial={{ ...sheet.from, backgroundColor: "rgba(255, 251, 245, 1)" }}
          animate={{ ...sheet.to, backgroundColor: "rgba(255, 251, 245, 0.86)" }}
          transition={{ duration: SHEET_S, ease: easeInOut }}
        >
          <m.div
            className="absolute inset-x-0 top-0 flex flex-col items-center justify-center text-center"
            style={{ height: sheet.from.height }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: easeSoft }}
          >
            <CardText />
          </m.div>
        </m.div>
      )}

      <button type="button" onClick={onOpen} className="cover-hit" aria-label="Abrir la invitación" disabled={opening} />

      <m.p
        className="cover-cta"
        initial={{ opacity: 0, y: 12 }}
        animate={opening ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: opening ? 0 : 1.4 }}
      >
        <span className="pulse-soft inline-block">toca para abrir</span>
      </m.p>
    </m.section>
  );
}

function CardText() {
  return (
    <>
      <p className="kicker">te invito a</p>
      <p className="script mt-1 text-4xl text-ink sm:text-5xl">mi graduación</p>
      <p className="serif mt-2 text-sm italic tracking-wide text-muted">{event.dateShort}</p>
    </>
  );
}
