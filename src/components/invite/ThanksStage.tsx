"use client";

import { motion as m } from "motion/react";
import { dishName, event, googleCalendarUrl } from "@/lib/event";
import { Blossom, Confetti, FlowerCluster, GradCap } from "./Decor";
import { rise, stagger } from "./motion";
import type { RsvpResult } from "./RsvpStage";

export function ThanksStage({ result, onHome }: { result: RsvpResult; onHome: () => void }) {
  const firstName = result.name.split(" ")[0];
  const coming = result.attending === "si";

  return (
    <m.div
      className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 pb-14 pt-20 text-center"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {coming && (
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-0 w-0">
          <Confetti count={56} spread={1.2} />
        </div>
      )}

      <m.div variants={rise} className="relative w-24">
        <GradCap className="floaty h-auto w-full drop-shadow-lg" />
        <FlowerCluster className="-bottom-12 -left-24" scale={0.8} />
        <FlowerCluster className="-bottom-12 -right-24" scale={0.8} flip />
      </m.div>

      <m.p variants={rise} className="kicker mt-6">
        {coming ? "confirmado" : "gracias por avisar"}
      </m.p>
      <m.h2 variants={rise} className="script mt-2 text-[clamp(3rem,13vw,4.4rem)] text-ink">
        {coming ? `¡Gracias, ${firstName}!` : `Gracias, ${firstName}`}
      </m.h2>
      <m.p variants={rise} className="serif mt-4 text-xl italic leading-relaxed text-muted">
        {coming
          ? `Te espero el ${event.dateLabel.toLowerCase()} a las ${event.time} en ${event.venue}.`
          : "Te voy a extrañar. Gracias por acompañarme siempre, aunque sea a la distancia."}
      </m.p>

      {coming && (
        <m.div variants={rise} className="mt-6 flex flex-col items-center gap-2">
          <span className="chip">Tu plato: {dishName(result.dish)}</span>
        </m.div>
      )}

      <m.div variants={rise} className="ornament mt-8">
        <Blossom size={18} />
        <span className="display text-sm tracking-[0.3em] text-rose-deep">{event.dateShort}</span>
        <Blossom size={18} />
      </m.div>

      <m.div variants={rise} className="mt-10 flex flex-col items-center gap-4">
        {coming && (
          <a href={googleCalendarUrl()} target="_blank" rel="noreferrer" className="btn-gold">
            agregar al calendario
          </a>
        )}
        <button type="button" onClick={onHome} className="btn-link">
          volver al inicio
        </button>
      </m.div>
    </m.div>
  );
}
