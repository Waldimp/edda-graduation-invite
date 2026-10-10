"use client";

import { motion as m } from "motion/react";
import { dishes, menu, type DishId } from "@/lib/event";
import { easeCinema } from "./motion";

/** Cada plato entra un poquito después del anterior cuando aparece la carta. */
const dishVariants = {
  enter: { opacity: 0, y: 16, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeCinema } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/**
 * Contenido de la carta de Recién Horneado (sin precios), en letra blanca.
 * El fondo rosado lo pone quien la contiene; con `onSelect` cada plato es un botón.
 */
export function MenuDishes({
  selected = null,
  onSelect,
}: {
  selected?: DishId | null;
  onSelect?: (id: DishId) => void;
}) {
  return (
    <div className="text-white">
      <m.div variants={dishVariants} className="px-2 text-left">
        <p className="menu-title">{menu.title}</p>
        <p className="menu-subtitle">{menu.subtitle}</p>
        <p className="serif mt-2 text-base italic opacity-90">{menu.note}</p>
      </m.div>

      <div className="mt-4 space-y-1">
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
              variants={dishVariants}
              onClick={() => onSelect(d.id)}
              className={`menu-dish ${on ? "on" : ""}`}
              whileTap={{ scale: 0.98 }}
              aria-pressed={on}
            >
              {body}
            </m.button>
          ) : (
            <m.div key={d.id} variants={dishVariants} className="menu-dish">
              {body}
            </m.div>
          );
        })}
      </div>
    </div>
  );
}
