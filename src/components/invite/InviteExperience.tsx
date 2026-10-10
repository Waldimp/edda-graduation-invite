"use client";

import { AnimatePresence, motion as m } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CoverStage } from "./CoverStage";
import { DetailsStage } from "./DetailsStage";
import { InviteStage } from "./InviteStage";
import { easeCinema, easeSoft, playWhoosh, prefersReducedMotion, stageVariants } from "./motion";
import { RsvpStage, type RsvpResult } from "./RsvpStage";
import { ThanksStage } from "./ThanksStage";

type Stage = "cover" | "invite" | "details" | "rsvp" | "thanks";

const ORDER: Stage[] = ["cover", "invite", "details", "rsvp", "thanks"];
const JOURNEY = [
  { id: "invite" as const, label: "invitación" },
  { id: "details" as const, label: "detalles" },
  { id: "rsvp" as const, label: "confirmar" },
];

function isSwipeBlocked(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [data-no-swipe]"));
}

export function InviteExperience() {
  const [stage, setStage] = useState<Stage>("cover");
  const [dir, setDir] = useState(1);
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<RsvpResult | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef(stage);
  const openingRef = useRef(opening);
  useLayoutEffect(() => {
    stageRef.current = stage;
    openingRef.current = opening;
  }, [stage, opening]);

  function goToStage(next: Stage) {
    const current = stageRef.current;
    if (next === current || openingRef.current) return;
    if (next === "thanks" && !result) return;
    playWhoosh();
    setDir(ORDER.indexOf(next) > ORDER.indexOf(current) ? 1 : -1);
    if (next === "cover") {
      openingRef.current = false;
      setOpening(false);
    }
    stageRef.current = next;
    setStage(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function openCover() {
    if (openingRef.current || stageRef.current !== "cover") return;
    openingRef.current = true;
    setOpening(true);
    playWhoosh();
  }

  function finishOpening() {
    openingRef.current = false;
    setOpening(false);
    setDir(1);
    stageRef.current = "invite";
    setStage("invite");
    window.scrollTo(0, 0);
  }

  function goNext() {
    const s = stageRef.current;
    if (s === "cover") openCover();
    else if (s === "invite") goToStage("details");
    else if (s === "details") goToStage("rsvp");
  }

  function goPrev() {
    const s = stageRef.current;
    if (s === "invite") goToStage("cover");
    else if (s === "details") goToStage("invite");
    else if (s === "rsvp") goToStage("details");
  }

  // Gestos: deslizar, rueda, teclado y un leve parallax con el puntero.
  useEffect(() => {
    const root = rootRef.current;
    let startX = 0;
    let startY = 0;
    let lastNav = 0;

    function canNav() {
      const now = Date.now();
      if (now - lastNav < 1000) return false;
      lastNav = now;
      return true;
    }

    function onPointerMove(e: PointerEvent) {
      if (!root || prefersReducedMotion()) return;
      root.style.setProperty("--px", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      root.style.setProperty("--py", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    }

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }

    function onTouchEnd(e: TouchEvent) {
      if (isSwipeBlocked(e.target)) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (stageRef.current === "cover" && dy < -70 && Math.abs(dy) > Math.abs(dx)) {
        if (canNav()) goNext();
        return;
      }
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      if (!canNav()) return;
      if (dx < 0) goNext();
      else goPrev();
    }

    function onWheel(e: WheelEvent) {
      if (isSwipeBlocked(e.target) || Math.abs(e.deltaY) < 40) return;
      const s = stageRef.current;
      if (s === "cover") {
        if (e.deltaY > 0 && canNav()) goNext();
        return;
      }
      if (s === "rsvp" || s === "thanks") return;
      const atTop = window.scrollY <= 12;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12;
      if (e.deltaY > 0 && atBottom) {
        if (canNav()) goNext();
      } else if (e.deltaY < 0 && atTop) {
        if (canNav()) goPrev();
      }
    }

    function onKey(e: KeyboardEvent) {
      if (isSwipeBlocked(e.target)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (canNav()) goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (canNav()) goPrev();
      } else if (stageRef.current === "cover" && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
        e.preventDefault();
        openCover();
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
    // Los handlers leen el estado por refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCover = stage === "cover";

  return (
    <main ref={rootRef} className={`stage-root ${isCover ? "is-cover" : ""}`}>
      {!isCover && <div className="paper-bg" aria-hidden />}

      <AnimatePresence>
        {!isCover && (
          <m.div
            key="rail"
            className="rail-wrap"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: easeSoft, delay: 0.3 }}
          >
            <JourneyRail stage={stage} onGo={goToStage} />
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCover && <CoverStage key="cover" opening={opening} onOpen={openCover} onOpened={finishOpening} />}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={dir}>
        {!isCover && (
          <m.section
            key={stage}
            custom={dir}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: easeCinema }}
            className="relative"
          >
            {stage === "invite" && <InviteStage onNext={() => goToStage("details")} />}
            {stage === "details" && <DetailsStage onNext={() => goToStage("rsvp")} />}
            {stage === "rsvp" && (
              <RsvpStage
                onDone={(r) => {
                  setResult(r);
                  playWhoosh();
                  setDir(1);
                  stageRef.current = "thanks";
                  setStage("thanks");
                  window.scrollTo(0, 0);
                }}
              />
            )}
            {stage === "thanks" && result && <ThanksStage result={result} onHome={() => goToStage("cover")} />}
          </m.section>
        )}
      </AnimatePresence>
    </main>
  );
}

function JourneyRail({ stage, onGo }: { stage: Stage; onGo: (stage: Stage) => void }) {
  const current = stage === "thanks" ? JOURNEY.length : JOURNEY.findIndex((step) => step.id === stage);
  return (
    <nav className="rail" aria-label="Secciones de la invitación">
      {JOURNEY.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <div key={step.id} className="contents">
            {index > 0 && <span className="rail-thread" />}
            <button
              type="button"
              onClick={() => onGo(step.id)}
              className={`rail-step ${done ? "done" : ""} ${active ? "active" : ""}`}
              aria-current={active ? "step" : undefined}
            >
              {step.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
