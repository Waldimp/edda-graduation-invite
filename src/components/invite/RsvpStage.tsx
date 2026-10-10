"use client";

import { AnimatePresence, motion as m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import { dishShort, type DishId } from "@/lib/event";
import { Blossom, Daisy, FlowerCluster, Sprig } from "./Decor";
import { MenuDishes } from "./MenuDishes";
import { easeCinema, easeInOut, playWhoosh } from "./motion";

type Attending = "si" | "no";
type Step = "attending" | "dish" | "name";
type Point = { x: number; y: number };

export type RsvpResult = { name: string; attending: Attending; dish: DishId | null };

/** Duración del "florecer" del rosado dentro de la card. */
const BLOOM_S = 1.35;

/**
 * El contenido de cada paso se desvanece dentro de la misma card. Al entrar a
 * la carta espera a que el rosado cubra la card para que el texto blanco se lea.
 */
const contentVariants = {
  enter: ({ dir }: { dir: number }) => ({ opacity: 0, x: dir * 28, filter: "blur(8px)" }),
  center: ({ toRose }: { toRose: boolean }) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: easeCinema,
      delay: toRose ? 0.45 : 0.2,
      staggerChildren: 0.09,
      delayChildren: toRose ? 0.55 : 0.25,
    },
  }),
  exit: ({ dir }: { dir: number }) => ({
    opacity: 0,
    x: dir * -28,
    filter: "blur(8px)",
    transition: { duration: 0.45, ease: easeInOut },
  }),
};

/** Pétalos que se abren desde el punto donde se tocó cuando florece el rosado. */
const BURST = Array.from({ length: 9 }, (_, i) => {
  const angle = (i / 9) * Math.PI * 2 + 0.35;
  const dist = 90 + (i % 3) * 45;
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, size: 12 + (i % 3) * 6, spin: i % 2 ? 140 : -160 };
});

/**
 * Confirmación en pasos, una decisión por pantalla:
 * 1. ¿Vienes? (sí / no)  2. Plato (solo si viene)  3. Nombre → guardar.
 * Todo vive en una sola card que cambia de papel a rosado y de vuelta.
 */
export function RsvpStage({ onDone }: { onDone: (result: RsvpResult) => void }) {
  const [step, setStep] = useState<Step>("attending");
  const [dir, setDir] = useState(1);
  const [attending, setAttending] = useState<Attending | null>(null);
  const [dish, setDish] = useState<DishId | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState<Point>({ x: 200, y: 320 });
  const [bloomId, setBloomId] = useState(0);
  const [height, setHeight] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef<Point | null>(null);
  const reduce = useReducedMotion();

  const steps: Step[] = attending === "no" ? ["attending", "name"] : ["attending", "dish", "name"];
  const index = steps.indexOf(step);
  const rose = step === "dish";

  // La card sigue la altura del contenido con una transición suave.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight;
      if (h > 0) setHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Guarda dónde se tocó (relativo a la card) para que el color nazca ahí. */
  function rememberTap(e: PointerEvent) {
    const r = cardRef.current?.getBoundingClientRect();
    if (r) tapRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function moveTo(next: Step, direction: number) {
    if (tapRef.current) setOrigin(tapRef.current);
    if (next === "dish") setBloomId((n) => n + 1);
    setDir(direction);
    setStep(next);
    playWhoosh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function go(next: Step) {
    moveTo(next, steps.indexOf(next) >= index ? 1 : -1);
  }

  function chooseAttending(value: Attending) {
    setAttending(value);
    if (value === "no") setDish(null);
    window.setTimeout(() => moveTo(value === "si" ? "dish" : "name", 1), 420);
  }

  function chooseDish(value: DishId) {
    setDish(value);
    window.setTimeout(() => go("name"), 420);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!attending || status === "saving") return;
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attending, dish: attending === "si" ? dish : null }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error || "No se pudo enviar.");
        setStatus("error");
        return;
      }
      onDone({ name: name.trim(), attending, dish: attending === "si" ? dish : null });
    } catch {
      setError("Revisa tu conexión e intenta de nuevo.");
      setStatus("error");
    }
  }

  const bloom = reduce ? { duration: 0 } : { duration: BLOOM_S, ease: easeInOut };
  const at = `${origin.x}px ${origin.y}px`;

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 pb-14 pt-24">
      <m.div
        ref={cardRef}
        className="rsvp-card"
        data-no-swipe
        onPointerDownCapture={rememberTap}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1, height: height ?? "auto" }}
        transition={{
          default: { duration: 1.1, ease: easeCinema, delay: 0.15 },
          height: reduce ? { duration: 0 } : { duration: 0.8, ease: easeInOut },
        }}
      >
        {/* Capa rosada: florece desde el toque con un degradé que se asienta en el rosa del menú. */}
        <m.div
          className="rsvp-rose"
          aria-hidden
          initial={false}
          animate={{
            clipPath: rose ? `circle(1400px at ${at})` : `circle(0px at ${at})`,
            backgroundPosition: rose ? "55% 55%" : "0% 0%",
          }}
          transition={{ clipPath: bloom, backgroundPosition: reduce ? { duration: 0 } : { duration: BLOOM_S * 1.6, ease: easeCinema } }}
        >
          {rose && !reduce && (
            <m.div
              key={`sheen-${bloomId}`}
              className="rsvp-sheen"
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.6, ease: easeInOut, delay: 0.55 }}
            />
          )}

          {/* Florcitas de la carta, aparecen cuando ya hay rosado */}
          <m.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: rose ? 1 : 0 }}
            transition={{ duration: 0.8, delay: rose ? 0.7 : 0 }}
          >
            <div className="absolute -right-3 -top-3">
              <Blossom size={46} color="#fff" center="var(--gold)" className="spin-slow" />
            </div>
            <div className="absolute right-12 top-7">
              <Blossom size={20} color="var(--rose-light)" center="var(--rose-dark)" />
            </div>
            <div className="absolute -bottom-4 -right-2 rotate-[30deg]">
              <Sprig size={70} className="sway" />
            </div>
            <div className="absolute -right-3 bottom-8">
              <Daisy size={34} />
            </div>
          </m.div>
        </m.div>

        {/* Pétalos que se abren al florecer */}
        {rose && !reduce && (
          <div key={`burst-${bloomId}`} className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
            {BURST.map((p, i) => (
              <m.span
                key={i}
                className="absolute"
                style={{ left: origin.x, top: origin.y }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                animate={{ x: p.x, y: p.y, scale: [0, 1, 0.7], opacity: [0, 1, 0], rotate: p.spin }}
                transition={{ duration: 1.5, ease: easeCinema, delay: 0.05 + i * 0.02 }}
              >
                <Blossom size={p.size} color={i % 3 ? "#fff" : "var(--rose-light)"} center="var(--gold)" />
              </m.span>
            ))}
          </div>
        )}

        {/* Marco punteado: pasa de rosa a blanco con la card */}
        <m.div
          className="rsvp-frame"
          aria-hidden
          initial={false}
          animate={{ borderColor: rose ? "rgba(255,255,255,0.55)" : "rgba(196,124,134,0.28)" }}
          transition={{ duration: 0.9, delay: rose ? 0.4 : 0 }}
        />

        {/* Florcitas de papel por fuera de la card */}
        <FlowerCluster className="-left-10 -top-12 z-10" scale={0.9} />
        <div className="pointer-events-none absolute -bottom-5 -right-4 z-10">
          <Blossom size={44} className="spin-slow" />
        </div>

        <div ref={contentRef} className="relative">
          <AnimatePresence mode="wait" custom={{ dir, toRose: rose }} initial={false}>
            <m.div
              key={step}
              custom={{ dir, toRose: rose }}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={rose ? "px-4 pb-7 pt-7" : "px-6 pb-8 pt-9"}
            >
              <div className="flex justify-center gap-2" aria-hidden>
                {steps.map((s, i) => (
                  <span key={s} className={`step-dot ${rose ? "light" : ""} ${i <= index ? "on" : ""}`} />
                ))}
              </div>

              {step === "attending" && (
                <div className="mt-6 text-center">
                  <p className="kicker">confirmación</p>
                  <h2 className="script mt-2 text-5xl text-ink">¿Me acompañas?</h2>
                  <p className="serif mt-3 text-lg italic text-muted">Tu respuesta me ayuda a preparar todo.</p>
                  <div className="mt-8 space-y-3">
                    <Choice
                      on={attending === "si"}
                      mark="✓"
                      title="Sí, ahí estaré"
                      subtitle="¡No me lo pierdo!"
                      onClick={() => chooseAttending("si")}
                    />
                    <Choice
                      on={attending === "no"}
                      mark="✕"
                      title="No podré asistir"
                      subtitle="Te acompaño de corazón"
                      onClick={() => chooseAttending("no")}
                    />
                  </div>
                </div>
              )}

              {step === "dish" && (
                <>
                  <p className="mb-5 mt-5 text-center text-[0.7rem] font-medium uppercase tracking-[0.35em] text-white/90">
                    elige tu plato
                  </p>
                  <MenuDishes selected={dish} onSelect={chooseDish} />
                  <div className="text-center">
                    <BackLink light onClick={() => go("attending")} />
                  </div>
                </>
              )}

              {step === "name" && (
                <form onSubmit={submit} className="mt-6 text-center">
                  <p className="kicker">último paso</p>
                  <h2 className="script mt-2 text-5xl text-ink">¿Cómo te llamas?</h2>
                  <p className="serif mt-3 text-lg italic text-muted">Nombre y apellido, por favor.</p>
                  <input
                    autoFocus
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="name-input mt-8"
                  />
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <button type="button" className="chip" onClick={() => go("attending")}>
                      {attending === "si" ? "Asistiré" : "No asistiré"} <span className="text-rose-deep">✎</span>
                    </button>
                    {attending === "si" && (
                      <button type="button" className="chip" onClick={() => go("dish")}>
                        {dishShort(dish)} <span className="text-rose-deep">✎</span>
                      </button>
                    )}
                  </div>
                  {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
                  <button
                    type="submit"
                    disabled={status === "saving" || name.trim().length < 2}
                    className="btn-gold mt-8 w-full"
                  >
                    {status === "saving" ? "enviando…" : "confirmar"}
                  </button>
                  <BackLink onClick={() => go(attending === "si" ? "dish" : "attending")} />
                </form>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  );
}

function Choice({
  on,
  mark,
  title,
  subtitle,
  onClick,
}: {
  on: boolean;
  mark: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <m.button type="button" onClick={onClick} className={`choice ${on ? "on" : ""}`} whileTap={{ scale: 0.97 }} aria-pressed={on}>
      <span className="choice-mark">{mark}</span>
      <span>
        <span className="serif block text-xl font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{subtitle}</span>
      </span>
    </m.button>
  );
}

function BackLink({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={`btn-link mt-6 ${light ? "light" : ""}`}>
      ← atrás
    </button>
  );
}
