"use client";

import { motion as m } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { event } from "@/lib/event";
import { Blossom, Confetti, FallingPetals, FlowerCluster, GradCap, Sparkles, Sprig } from "./Decor";
import { easeCinema, easeInOut, easeSoft } from "./motion";

/** Duración de la apertura antes de pasar a la invitación. */
export const OPEN_MS = 3600;

/**
 * Portada: sobre crema con sello de lacre rosado y florcitas, sobre fondo rosa.
 * Al tocar: el sello se levanta, la solapa se abre, la tarjeta sube,
 * el birrete sale volando con confeti y pétalos y se pasa a la invitación.
 */
export function CoverStage({ opening, onOpen, onOpened }: { opening: boolean; onOpen: () => void; onOpened: () => void }) {
  const cb = useRef(onOpened);
  useLayoutEffect(() => {
    cb.current = onOpened;
  });

  useEffect(() => {
    if (!opening) return;
    const id = window.setTimeout(() => cb.current(), OPEN_MS);
    return () => window.clearTimeout(id);
  }, [opening]);

  return (
    <m.section
      className="cover-stage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)", transition: { duration: 1.1, ease: easeSoft } }}
    >
      <div className="cover-bg" aria-hidden />
      <Sparkles />
      <FallingPetals />

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
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-cream/90">{event.classOf}</p>
        <p className="script mt-2 text-5xl text-cream drop-shadow-[0_2px_8px_rgba(155,88,102,0.35)] sm:text-6xl">{event.honoree}</p>
      </m.div>

      <m.div
        className="relative"
        initial={{ y: 40, opacity: 0, scale: 0.94 }}
        animate={
          opening
            ? { y: ["0vh", "-2vh", "6vh"], opacity: 1, scale: [1, 1.04, 1.06], transition: { duration: OPEN_MS / 1000, times: [0, 0.4, 1], ease: easeCinema } }
            : { y: 0, opacity: 1, scale: 1, transition: { duration: 1.4, ease: easeCinema, delay: 0.2 } }
        }
      >
        <div className="parallax" style={{ "--depth": "10px" } as CSSProperties}>
        <div className="envelope">
          <div className="env-back" />

          {/* Birrete: sale volando desde dentro del sobre */}
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

          {/* Tarjeta interior */}
          <m.div
            className="env-card"
            initial={false}
            animate={opening ? { y: "-46%" } : { y: 0 }}
            transition={{ delay: opening ? 1.25 : 0, duration: 1.6, ease: easeInOut }}
          >
            <p className="kicker">te invito a</p>
            <p className="script mt-1 text-4xl text-ink sm:text-5xl">mi graduación</p>
            <p className="serif mt-2 text-sm italic tracking-wide text-muted">{event.dateShort}</p>
          </m.div>

          <div className="env-pocket" />

          {/* Solapa: se abre en 3D y queda detrás de la tarjeta */}
          <m.div
            className="env-flap"
            initial={false}
            animate={opening ? { rotateX: 180, zIndex: [5, 5, 1] } : { rotateX: 0, zIndex: 5 }}
            transition={
              opening
                ? { delay: 0.55, duration: 1.1, ease: easeInOut, zIndex: { delay: 0.55, duration: 1.1, times: [0, 0.5, 0.51] } }
                : { duration: 0.6 }
            }
          />

          <m.div
            className="wax-seal"
            initial={false}
            animate={opening ? { scale: [1, 1.18, 0.4], opacity: [1, 1, 0], rotate: [0, -8, 20] } : { scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.75, ease: easeSoft }}
          >
            <div className="absolute -left-5 -top-6 rotate-[-30deg]">
              <Sprig size={56} />
            </div>
            <div className="wax-seal-disc">{event.monogram}</div>
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
