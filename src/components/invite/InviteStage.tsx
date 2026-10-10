"use client";

import { motion as m } from "motion/react";
import type { CSSProperties } from "react";
import { event } from "@/lib/event";
import { GradCap, PhotoFrame } from "./Decor";
import { rise, stagger } from "./motion";

/** Pantalla principal: "te invito a mi graduación" con la foto de la graduada. */
export function InviteStage({ onNext }: { onNext: () => void }) {
  return (
    <m.div
      className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 pb-14 pt-24 text-center"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <m.p variants={rise} className="kicker">
        {event.coverKicker}
      </m.p>

      <m.div variants={rise} className="relative mt-6">
        <div className="parallax" style={{ "--depth": "-8px" } as CSSProperties}>
          <PhotoFrame
            src={event.photos.cover.src}
            alt={event.photos.cover.alt}
            className="h-[min(40vh,320px)] w-[min(56vw,240px)]"
            sizes="260px"
            priority
          />
        </div>
        <m.div
          className="absolute -right-8 -top-6 w-20 sm:-right-12 sm:w-24"
          initial={{ rotate: 18, y: -20, opacity: 0 }}
          animate={{ rotate: 14, y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2, type: "spring", bounce: 0.4 }}
        >
          <GradCap className="floaty h-auto w-full drop-shadow-lg" />
        </m.div>
      </m.div>

      <m.p variants={rise} className="serif mt-9 text-xl italic text-muted sm:text-2xl">
        {event.coverHeadline}
      </m.p>
      <m.h1 variants={rise} className="display gold-text mt-2 text-[clamp(2.6rem,11vw,4.6rem)]">
        {event.coverSubline}
      </m.h1>

      <m.div variants={rise} className="ornament mt-5">
        <span className="text-xs">✦</span>
      </m.div>

      <m.p variants={rise} className="script mt-4 text-[clamp(2.4rem,10vw,3.6rem)] text-ink">
        {event.honoree}
      </m.p>
      <m.p variants={rise} className="mt-2 text-xs uppercase tracking-[0.3em] text-muted">
        {event.degree} · {event.school}
      </m.p>

      <m.p variants={rise} className="serif mt-6 max-w-sm text-lg leading-relaxed text-ink/80">
        {event.coverNote}
      </m.p>

      <m.div variants={rise} className="mt-8 flex items-center gap-5 text-ink">
        <span className="serif text-lg uppercase tracking-[0.2em]">{event.weekday}</span>
        <span className="h-10 w-px bg-gold/50" />
        <span className="display text-4xl text-gold-deep">{event.day}</span>
        <span className="h-10 w-px bg-gold/50" />
        <span className="serif text-lg uppercase tracking-[0.2em]">{event.month.slice(0, 3)}</span>
      </m.div>

      <m.div variants={rise} className="mt-10">
        <button type="button" onClick={onNext} className="btn-gold">
          ver detalles <span aria-hidden>→</span>
        </button>
      </m.div>
    </m.div>
  );
}
