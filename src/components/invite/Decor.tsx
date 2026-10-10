"use client";

import Image from "next/image";
import { motion as m } from "motion/react";
import { event } from "@/lib/event";
import type { CSSProperties } from "react";

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** Posiciones fijas (no aleatorias) para no romper la hidratación. */
const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37.3) % 100,
  top: (i * 61.7 + 7) % 100,
  size: 2 + (i % 3),
  dur: 3 + (i % 5) * 0.7,
  delay: (i % 7) * 0.45,
}));

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 23.7 + 4) % 100,
  size: 10 + (i % 4) * 4,
  dur: 10 + (i % 5) * 2.2,
  delay: -((i * 1.9) % 14),
  drift: (i % 2 ? 1 : -1) * (30 + (i % 3) * 25),
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

/** Pétalos que caen suavemente por toda la pantalla. */
export function FallingPetals({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              "--size": `${p.size}px`,
              "--dur": `${p.dur}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as CSSVars
          }
        />
      ))}
    </div>
  );
}

/** Flor de cinco pétalos (tipo cerezo). */
export function Blossom({
  size = 40,
  color = "var(--rose)",
  center = "var(--gold)",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  center?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="-20 -20 40 40" width={size} height={size} className={`flower ${className}`} style={style} aria-hidden>
      {[0, 72, 144, 216, 288].map((r) => (
        <path
          key={r}
          d="M0 0 C -7 -6 -6 -16 0 -18 C 6 -16 7 -6 0 0 Z"
          fill={color}
          transform={`rotate(${r})`}
          opacity={0.95}
        />
      ))}
      {[36, 108, 180, 252, 324].map((r) => (
        <line key={r} x1="0" y1="0" x2="0" y2="-7" stroke={center} strokeWidth="0.8" transform={`rotate(${r})`} strokeLinecap="round" />
      ))}
      <circle r="3.2" fill={center} />
      <circle r="1.4" fill="#fff" opacity={0.7} />
    </svg>
  );
}

/** Margarita blanca con centro dorado. */
export function Daisy({ size = 36, className = "", style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-20 -20 40 40" width={size} height={size} className={`flower ${className}`} style={style} aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-10.5" rx="3.4" ry="8" fill="#fff" stroke="rgba(196,124,134,.35)" strokeWidth=".5" transform={`rotate(${i * 30})`} />
      ))}
      <circle r="5" fill="var(--gold-light)" />
      <circle r="5" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="1 1.4" />
    </svg>
  );
}

/** Ramita con hojas salvia. */
export function Sprig({ size = 60, className = "", style }: { size?: number; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 80" width={size / 2} height={size} className={`flower ${className}`} style={style} aria-hidden>
      <path d="M20 80 C 20 55 18 30 22 4" fill="none" stroke="var(--leaf-deep)" strokeWidth="1.4" strokeLinecap="round" />
      {[
        [21, 62, -1],
        [20, 48, 1],
        [21, 34, -1],
        [22, 20, 1],
      ].map(([x, y, s], i) => (
        <path
          key={i}
          d="M0 0 C 6 -8 16 -8 20 -2 C 14 4 6 4 0 0 Z"
          fill="var(--leaf)"
          transform={`translate(${x} ${y}) scale(${s} 1) rotate(${s === 1 ? -25 : -25})`}
        />
      ))}
      <ellipse cx="22" cy="4" rx="3" ry="4.5" fill="var(--leaf)" />
    </svg>
  );
}

/** Ramillete de flores para esquinas y marcos. */
export function FlowerCluster({
  className = "",
  style,
  scale = 1,
  flip = false,
}: {
  className?: string;
  style?: CSSProperties;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={{ width: 120 * scale, height: 110 * scale, transform: flip ? "scaleX(-1)" : undefined, ...style }}
      aria-hidden
    >
      <div className="sway absolute" style={{ left: 8 * scale, top: 10 * scale, rotate: "-35deg" }}>
        <Sprig size={70 * scale} />
      </div>
      <div className="sway absolute" style={{ left: 62 * scale, top: 34 * scale, rotate: "40deg", animationDelay: "-2s" }}>
        <Sprig size={60 * scale} />
      </div>
      <Blossom size={54 * scale} className="spin-slow absolute" style={{ left: 30 * scale, top: 30 * scale }} />
      <Daisy size={38 * scale} className="absolute" style={{ left: 4 * scale, top: 58 * scale }} />
      <Blossom
        size={30 * scale}
        color="var(--rose-light)"
        center="var(--rose-deep)"
        className="absolute"
        style={{ left: 74 * scale, top: 12 * scale }}
      />
      <Blossom size={20 * scale} color="#fff" center="var(--gold)" className="absolute" style={{ left: 80 * scale, top: 72 * scale }} />
    </div>
  );
}

/** Birrete en SVG, en ciruela con borla dorada. */
export function GradCap({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 90" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id="cap-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a4553" />
          <stop offset="1" stopColor="#4d2a34" />
        </linearGradient>
        <linearGradient id="cap-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a07d45" />
          <stop offset=".5" stopColor="#ecd3a3" />
          <stop offset="1" stopColor="#c9a46c" />
        </linearGradient>
      </defs>
      <path d="M30 40 v22 c0 8 60 8 60 0 V40 L60 52 Z" fill="#4d2a34" />
      <path d="M60 8 L116 30 L60 52 L4 30 Z" fill="url(#cap-top)" stroke="url(#cap-gold)" strokeWidth="1.2" />
      <circle cx="60" cy="30" r="3" fill="url(#cap-gold)" />
      <path d="M60 30 Q88 34 96 40 L96 66" fill="none" stroke="url(#cap-gold)" strokeWidth="1.8" />
      <path d="M92 64 h8 l2 14 h-12 Z" fill="url(#cap-gold)" />
      <g transform="translate(36 34) scale(.42)">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d="M0 0 C -7 -6 -6 -16 0 -18 C 6 -16 7 -6 0 0 Z" fill="#f6d6d6" transform={`rotate(${r})`} />
        ))}
        <circle r="3.4" fill="#ecd3a3" />
      </g>
    </svg>
  );
}

const CONFETTI_COLORS = ["#fff", "#f6d6d6", "#e8acae", "#c47c86", "#ecd3a3"];

/** Ráfaga de confeti y pétalos desde el centro del contenedor. */
export function Confetti({ count = 42, spread = 1 }: { count?: number; spread?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[12] overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.3;
        const dist = (160 + ((i * 53) % 220)) * spread;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist * 0.75 - 120;
        const w = 7 + (i % 4) * 2;
        const petal = i % 3 !== 2;
        return (
          <m.span
            key={i}
            className="confetti-piece"
            style={{
              width: w,
              height: petal ? w * 0.75 : w * 0.45,
              borderRadius: petal ? "80% 0 80% 0" : 1,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
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

/** Marco de foto: muestra la imagen o un marco vacío mientras no hay fotos. */
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
      <span className="script text-5xl leading-none text-rose-deep">{event.monogram}</span>
      <span className="text-[0.55rem] uppercase tracking-[0.3em] text-muted">foto pronto</span>
    </div>
  );

  if (variant === "polaroid") {
    return (
      <div className={`photo-polaroid ${className}`}>
        <div className="absolute bottom-[30px] left-2 right-2 top-2 overflow-hidden bg-blush">{inner}</div>
      </div>
    );
  }
  return <div className={`photo-arch ${className}`}>{inner}</div>;
}
