export const easeCinema = [0.16, 1, 0.3, 1] as const;
export const easeSoft = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

/** Transición entre pantallas: entra desde el lado hacia donde se avanza. */
export const stageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 80, filter: "blur(10px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, x: dir * -80, filter: "blur(10px)" }),
};

/** Entrada escalonada de los hijos de una pantalla. */
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

export const rise = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: easeCinema } },
};

let whooshCtx: AudioContext | null = null;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Soplido suave al cambiar de pantalla (Web Audio, sin archivos). */
export function playWhoosh() {
  if (typeof window === "undefined" || prefersReducedMotion()) return;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  try {
    if (!whooshCtx) whooshCtx = new AC();
    void whooshCtx.resume();
    const t = whooshCtx.currentTime;
    const osc = whooshCtx.createOscillator();
    const filter = whooshCtx.createBiquadFilter();
    const gain = whooshCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.28);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(380, t + 0.28);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(whooshCtx.destination);
    osc.start(t);
    osc.stop(t + 0.34);
  } catch {
    /* El sonido nunca debe frenar la invitación. */
  }
}
