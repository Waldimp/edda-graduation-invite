"use client";

import Image from "next/image";
import { motion as m } from "motion/react";
import { event } from "@/lib/event";
import type { CSSProperties } from "react";

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** Posiciones fijas (no aleatorias) para no romper la hidratación. */
const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37.3) % 100,
  top: (i * 61.7 + 7) % 100,
  size: 2 + (i % 3),
  dur: 3 + (i % 5) * 0.7,
  delay: (i % 7) * 0.45,
}));

export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              "--size": `${s.size}px`,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}

/** Birrete dorado en SVG. */
export function GradCap({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 90" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="cap-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#21364f" />
          <stop offset="1" stopColor="#0e1a2b" />
        </linearGradient>
        <linearGradient id="cap-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a6b37" />
          <stop offset=".5" stopColor="#e3cb94" />
          <stop offset="1" stopColor="#b8955a" />
        </linearGradient>
      </defs>
      <path d="M30 40 v22 c0 8 60 8 60 0 V40 L60 52 Z" fill="#0e1a2b" />
      <path d="M60 8 L116 30 L60 52 L4 30 Z" fill="url(#cap-top)" stroke="url(#cap-gold)" strokeWidth="1.2" />
      <circle cx="60" cy="30" r="3" fill="url(#cap-gold)" />
      <path d="M60 30 Q88 34 96 40 L96 66" fill="none" stroke="url(#cap-gold)" strokeWidth="1.8" />
      <path d="M92 64 h8 l2 14 h-12 Z" fill="url(#cap-gold)" />
    </svg>
  );
}

const CONFETTI_COLORS = ["#e3cb94", "#b8955a", "#f8f4ec", "#8a6b37", "#f1dca6"];

/** Ráfaga de confeti dorado desde el centro del contenedor. */
export function Confetti({ count = 42, spread = 1 }: { count?: number; spread?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[12] overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.3;
        const dist = (160 + ((i * 53) % 220)) * spread;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist * 0.75 - 120;
        const w = 5 + (i % 4) * 2;
        return (
          <m.span
            key={i}
            className="confetti-piece"
            style={{ width: w, height: w * (i % 2 ? 0.45 : 1.6), background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
            animate={{
              x: [0, x, x * 1.08],
              y: [0, y, y + 260],
              opacity: [0, 1, 0],
              rotate: [0, (i % 2 ? 1 : -1) * 260, (i % 2 ? 1 : -1) * 520],
              scale: [0.4, 1, 0.9],
            }}
            transition={{ duration: 2.8 + (i % 5) * 0.25, ease: "easeOut", times: [0, 0.35, 1], delay: (i % 6) * 0.03 }}
          />
        );
      })}
    </div>
  );
}

/** Marco de foto: muestra la imagen o un marco elegante vacío mientras no hay fotos. */
export function PhotoFrame({
  src,
  alt,
  variant = "arch",
  className = "",
  sizes = "320px",
  priority = false,
}: {
  src: string | null;
  alt: string;
  variant?: "arch" | "polaroid";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const inner = src ? (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  ) : (
    <div className="photo-empty">
      <span className="script text-5xl leading-none text-gold">{event.monogram}</span>
      <span className="text-[0.55rem] uppercase tracking-[0.3em] text-muted">foto pronto</span>
    </div>
  );

  if (variant === "polaroid") {
    return (
      <div className={`photo-polaroid ${className}`}>
        <div className="absolute bottom-[30px] left-2 right-2 top-2 overflow-hidden bg-paper">{inner}</div>
      </div>
    );
  }
  return <div className={`photo-arch ${className}`}>{inner}</div>;
}
