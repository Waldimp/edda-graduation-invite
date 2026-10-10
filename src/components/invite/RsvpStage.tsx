"use client";

import { AnimatePresence, motion as m } from "motion/react";
import { useState, type FormEvent } from "react";
import { dishShort, type DishId } from "@/lib/event";
import { Blossom, FlowerCluster } from "./Decor";
import { MenuCard } from "./MenuCard";
import { easeCinema, playWhoosh } from "./motion";

type Attending = "si" | "no";
type Step = "attending" | "dish" | "name";

export type RsvpResult = { name: string; attending: Attending; dish: DishId | null };

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60, filter: "blur(6px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60, filter: "blur(6px)" }),
};

/**
 * Confirmación en pasos, una decisión por pantalla:
 * 1. ¿Vienes? (sí / no)  2. Plato (solo si viene)  3. Nombre → guardar.
 */
export function RsvpStage({ onDone }: { onDone: (result: RsvpResult) => void }) {
  const [step, setStep] = useState<Step>("attending");
  const [dir, setDir] = useState(1);
  const [attending, setAttending] = useState<Attending | null>(null);
  const [dish, setDish] = useState<DishId | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  const steps: Step[] = attending === "no" ? ["attending", "name"] : ["attending", "dish", "name"];
  const index = steps.indexOf(step);

  function go(next: Step) {
    setDir(steps.indexOf(next) >= index ? 1 : -1);
    setStep(next);
    playWhoosh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAttending(value: Attending) {
    setAttending(value);
    if (value === "no") setDish(null);
    window.setTimeout(() => {
      setDir(1);
      setStep(value === "si" ? "dish" : "name");
      playWhoosh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 420);
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

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 pb-14 pt-24">
      <m.div
        className="card card-frame px-6 pb-8 pt-9"
        data-no-swipe
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: easeCinema, delay: 0.15 }}
      >
        <FlowerCluster className="-left-10 -top-12" scale={0.9} />
        <div className="pointer-events-none absolute -bottom-5 -right-4">
          <Blossom size={44} className="spin-slow" />
        </div>
        <div className="flex justify-center gap-2" aria-hidden>
          {steps.map((s, i) => (
            <span key={s} className={`step-dot ${i <= index ? "on" : ""}`} />
          ))}
        </div>

        <div className="relative mt-6 min-h-[22rem]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <m.div
              key={step}
              custom={dir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: easeCinema }}
            >
              {step === "attending" && (
                <div className="text-center">
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
                <div className="text-center">
                  <h2 className="script text-5xl text-ink">Elige tu plato</h2>
                  <p className="serif mt-2 text-lg italic text-muted">Para tenerlo listo cuando llegues.</p>
                  <div className="-mx-3 mt-5">
                    <MenuCard selected={dish} onSelect={chooseDish} compact />
                  </div>
                  <BackLink onClick={() => go("attending")} />
                </div>
              )}

              {step === "name" && (
                <form onSubmit={submit} className="text-center">
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

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn-link mt-6">
      ← atrás
    </button>
  );
}
