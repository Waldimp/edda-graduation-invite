"use client";

import { motion as m } from "motion/react";
import { event, googleCalendarUrl } from "@/lib/event";
import { PhotoFrame } from "./Decor";
import { rise, stagger } from "./motion";

/** Detalles: fecha, hora, lugar con mapa, código de vestimenta y recuerdos. */
export function DetailsStage({ onNext }: { onNext: () => void }) {
  const mapEmbed = `https://maps.google.com/maps?q=${event.lat},${event.lng}&z=16&output=embed`;

  return (
    <m.div
      className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center px-5 pb-16 pt-24 text-center"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <m.p variants={rise} className="kicker">
        los detalles
      </m.p>
      <m.h2 variants={rise} className="script mt-2 text-[clamp(2.8rem,12vw,4rem)] text-ink">
        ¿Cuándo y dónde?
      </m.h2>

      {/* Fecha y hora */}
      <m.div variants={rise} className="card card-frame mt-8 w-full px-6 py-9">
        <p className="kicker">{event.weekday}</p>
        <div className="mt-3 flex items-center justify-center gap-5">
          <span className="serif text-lg uppercase tracking-[0.25em] text-ink">{event.month}</span>
          <span className="display gold-text text-7xl">{event.day}</span>
          <span className="serif text-lg uppercase tracking-[0.25em] text-ink">{event.year}</span>
        </div>
        <div className="ornament mt-5">
          <span className="serif text-xl italic text-ink">{event.time}</span>
        </div>
        <a href={googleCalendarUrl()} target="_blank" rel="noreferrer" className="btn-ghost mt-6">
          agregar al calendario
        </a>
      </m.div>

      {/* Lugar */}
      <m.div variants={rise} className="card mt-6 w-full overflow-hidden">
        <div className="px-6 pb-5 pt-8">
          <p className="kicker">el lugar</p>
          <p className="display mt-3 text-4xl text-ink">{event.venue}</p>
          <p className="serif mt-1 text-lg italic text-gold-deep">{event.venueDetail}</p>
          <p className="mt-2 text-sm text-muted">{event.address}</p>
        </div>
        <div className="relative mx-4 h-56 overflow-hidden rounded-2xl border border-gold/30" data-no-swipe>
          <iframe
            title={`Mapa de ${event.venue}`}
            src={mapEmbed}
            className="h-full w-full grayscale-[35%] sepia-[15%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="p-5">
          <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="btn-gold w-full">
            cómo llegar
          </a>
        </div>
      </m.div>

      {/* Código de vestimenta */}
      <m.div variants={rise} className="mt-10">
        <p className="kicker">código de vestimenta</p>
        <p className="serif mt-2 text-2xl italic text-ink">{event.dressCode}</p>
      </m.div>

      {/* Recuerdos */}
      <m.div variants={rise} className="mt-10 flex items-end justify-center gap-2 sm:gap-5">
        {event.photos.gallery.map((p, i) => (
          <m.div
            key={p.alt}
            style={{ rotate: p.rotate }}
            whileHover={{ y: -8, rotate: "0deg", scale: 1.04 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <PhotoFrame
              src={p.src}
              alt={p.alt}
              variant="polaroid"
              className={i === 1 ? "h-40 w-28 sm:h-52 sm:w-40" : "h-32 w-24 sm:h-44 sm:w-32"}
              sizes="160px"
            />
          </m.div>
        ))}
      </m.div>

      <m.div variants={rise} className="mt-12 flex flex-col items-center gap-3">
        <p className="serif text-lg italic text-muted">{event.rsvp.deadlineNote}</p>
        <button type="button" onClick={onNext} className="btn-gold">
          confirmar asistencia <span aria-hidden>→</span>
        </button>
      </m.div>
    </m.div>
  );
}
