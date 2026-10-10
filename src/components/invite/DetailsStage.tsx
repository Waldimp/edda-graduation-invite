"use client";

import { motion as m } from "motion/react";
import { event, googleCalendarUrl } from "@/lib/event";
import { Blossom, Daisy, FlowerCluster, PhotoFrame } from "./Decor";
import { rise, stagger } from "./motion";

/** Detalles: fecha, hora, lugar con mapa y recuerdos. */
export function DetailsStage({ onNext }: { onNext: () => void }) {
  const mapEmbed = `https://maps.google.com/maps?q=${event.lat},${event.lng}&z=16&output=embed`;

  return (
    <m.div
      className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center px-5 pb-28 pt-12 text-center"
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
        <FlowerCluster className="-left-8 -top-10" scale={0.85} />
        <div className="pointer-events-none absolute -bottom-4 -right-3">
          <Daisy size={40} className="spin-slow" />
        </div>
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
      <m.div variants={rise} className="card mt-8 w-full overflow-hidden">
        <div className="px-6 pb-5 pt-8">
          <p className="kicker">el lugar</p>
          <p className="display mt-3 text-4xl text-ink">{event.venue}</p>
          <p className="serif mt-1 text-lg italic text-rose-deep">{event.venueDetail}</p>
          <p className="mt-2 text-sm text-muted">{event.address}</p>
        </div>
        <div className="relative mx-4 h-56 overflow-hidden rounded-2xl border border-rose/30" data-no-swipe>
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

      {/* Florcitas de separación antes de los recuerdos */}
      <m.div variants={rise} className="mt-10 flex justify-center gap-1" aria-hidden>
        <Blossom size={18} />
        <Blossom size={14} color="var(--rose-light)" center="var(--rose-deep)" />
        <Blossom size={18} />
      </m.div>

      {/* Recuerdos en filas de 3 (la del centro más grande); una fila de 2 va con fotos grandes */}
      {galleryRows.map((row, r) => (
        <m.div
          key={r}
          variants={rise}
          className={`flex justify-center ${r === 0 ? "mt-10" : "mt-2"} ${row.length === 3 ? "items-center gap-1.5 sm:gap-5" : "items-start gap-5 sm:gap-8"}`}
        >
          {row.map((p, i) => (
            <Polaroid
              key={p.alt}
              photo={p}
              className={
                row.length !== 3
                  ? "h-44 w-36 sm:h-56 sm:w-44"
                  : i === 1
                    ? "h-44 w-32 sm:h-60 sm:w-44"
                    : "h-[8.5rem] w-[6.25rem] sm:h-48 sm:w-36"
              }
            />
          ))}
        </m.div>
      ))}

      <m.div variants={rise} className="mt-12 flex flex-col items-center gap-3">
        <p className="serif text-lg italic text-muted">{event.rsvp.deadlineNote}</p>
        <button type="button" onClick={onNext} className="btn-gold">
          confirmar asistencia <span aria-hidden>→</span>
        </button>
      </m.div>
    </m.div>
  );
}

const galleryRows = Array.from({ length: Math.ceil(event.photos.gallery.length / 3) }, (_, r) =>
  event.photos.gallery.slice(r * 3, r * 3 + 3),
);

function Polaroid({ photo, className }: { photo: (typeof event.photos.gallery)[number]; className: string }) {
  return (
    <m.div
      style={{ rotate: photo.rotate }}
      whileHover={{ y: -8, rotate: "0deg", scale: 1.04 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <PhotoFrame src={photo.src} alt={photo.alt} variant="polaroid" className={className} sizes="240px" />
    </m.div>
  );
}
