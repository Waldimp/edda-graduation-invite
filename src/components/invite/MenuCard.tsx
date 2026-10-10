"use client";

import { motion as m } from "motion/react";
import type { ReactNode } from "react";
import { dishes, menu, type DishId } from "@/lib/event";
import { Blossom, Daisy, Sprig } from "./Decor";

/**
 * Carta rosada al estilo del menú de Recién Horneado (sin precios).
 * Con `onSelect` cada plato se vuelve un botón para elegir; `header` y
 * `footer` permiten usarla como la tarjeta completa de un paso.
 */
export function MenuCard({
  selected = null,
  onSelect,
  header,
  footer,
}: {
  selected?: DishId | null;
  onSelect?: (id: DishId) => void;
  header?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="menu-card px-4 pb-6 pt-7">
      {/* Florcitas en las esquinas */}
      <div className="pointer-events-none absolute -right-3 -top-3" aria-hidden>
        <Blossom size={46} color="#fff" center="var(--gold)" className="spin-slow" />
      </div>
      <div className="pointer-events-none absolute right-12 top-7" aria-hidden>
        <Blossom size={20} color="var(--rose-light)" center="var(--rose-dark)" />
      </div>
      <div className="pointer-events-none absolute -bottom-4 -right-2 rotate-[30deg]" aria-hidden>
        <Sprig size={70} className="sway" />
      </div>
      <div className="pointer-events-none absolute -right-3 bottom-8" aria-hidden>
        <Daisy size={34} />
      </div>

      {header && <div className="relative">{header}</div>}

      <div className="relative px-2 text-left">
        <p className="menu-title">{menu.title}</p>
        <p className="menu-subtitle">{menu.subtitle}</p>
        <p className="serif mt-2 text-base italic opacity-90">{menu.note}</p>
      </div>

      <div className="relative mt-4 space-y-1">
        {dishes.map((d) => {
          const on = selected === d.id;
          const body = (
            <>
              <span className="flex items-start justify-between gap-3">
                <span className="menu-dish-name">{d.name}</span>
                {onSelect && <span className="menu-radio mt-0.5">{on ? "✓" : ""}</span>}
              </span>
              <span className="menu-dish-desc block">{d.description}</span>
            </>
          );
          return onSelect ? (
            <m.button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={`menu-dish ${on ? "on" : ""}`}
              whileTap={{ scale: 0.98 }}
              aria-pressed={on}
            >
              {body}
            </m.button>
          ) : (
            <div key={d.id} className="menu-dish">
              {body}
            </div>
          );
        })}
      </div>

      {footer && <div className="relative">{footer}</div>}
    </div>
  );
}
