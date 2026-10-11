/**
 * Todo el contenido de la invitación vive aquí. Cuando tengamos nombre, fotos
 * y menú definitivos, solo se cambia este archivo.
 */
export const event = {
  honoree: "Edda Stefany Monge Iraheta",
  /** Versión corta para la portada, donde el nombre completo no cabe en grande. */
  honoreeShort: "Edda Stefany",
  /** Iniciales para el sello y los marcos de foto vacíos. */
  monogram: "E",
  degree: "Ingeniera Industrial",
  school: "Universidad Centroamericana José Simeón Cañas",
  schoolShort: "UCA",
  classOf: "Graduación 2026",
  title: "Mi graduación",
  coverKicker: "Con mucha alegría",
  coverHeadline: "te invito a celebrar",
  coverSubline: "mi graduación",
  coverNote: "Cerramos una etapa y quiero celebrarla con quienes me acompañaron en el camino.",
  dateLabel: "Domingo 1 de noviembre de 2026",
  dateShort: "01 · 11 · 26",
  weekday: "Domingo",
  day: "01",
  month: "Noviembre",
  year: "2026",
  time: "8:30 a. m.",
  /** Inicio y fin en hora de El Salvador (UTC-6) para el calendario. */
  startsAt: "2026-11-01T08:30:00-06:00",
  endsAt: "2026-11-01T11:30:00-06:00",
  venue: "Recién Horneado",
  venueDetail: "Bakery · San Benito",
  address: "Colonia San Benito, San Salvador",
  lat: 13.6953718,
  lng: -89.2430306,
  mapsUrl:
    "https://www.google.com/maps/place/Reci%C3%A9n+Horneado+Bakery+%E2%80%A2+San+Benito/@13.6953718,-89.2430306,17z/data=!3m1!4b1!4m6!3m5!1s0x8f63313a1da857cd:0xf91bda0d856c9c59!8m2!3d13.6953718!4d-89.2430306!16s%2Fg%2F11rt_m5rhc",
  /** Fotos de la graduada. `src: null` muestra un marco elegante vacío. */
  photos: {
    cover: { src: "/photos/edda-portada.jpg" as string | null, alt: "Edda en la UCA" },
    /**
     * Arriba, 3 fotos de Edda (la del centro más grande); abajo, 2 memes.
     * `src: null` muestra el marco vacío mientras llegan las fotos.
     */
    gallery: [
      { src: "/photos/edda-selfie.jpg" as string | null, alt: "Selfie de Edda", rotate: "-6deg" },
      { src: "/photos/edda-bebe.jpg" as string | null, alt: "Edda de bebé", rotate: "3deg" },
      { src: "/photos/edda-espejo.jpg" as string | null, alt: "Edda frente al espejo", rotate: "-2deg" },
      { src: "/photos/meme-graduation-era.jpg" as string | null, alt: "In my graduation era", rotate: "5deg" },
      { src: "/photos/meme-mami-ya-me-gradue.jpg" as string | null, alt: "Mami ya me gradué", rotate: "-4deg" },
    ],
  },
  rsvp: {
    deadlineNote: "Por favor confirma antes del martes 13 de octubre.",
  },
} as const;

export type DishId = "plato_1" | "plato_2" | "plato_3";

/**
 * Menú de desayuno de Recién Horneado (página 7 de la carta, sin precios).
 * El Omelette (plato_2) se quitó; los ids no se renumeran para no tocar la tabla.
 */
export const menu = {
  title: "Menú",
  subtitle: "Desayuno",
  note: "Incluye café y jugo de naranja.",
};

export const dishes: { id: DishId; name: string; short: string; description: string }[] = [
  {
    id: "plato_1",
    name: "Típico Recién Horneado",
    short: "Típico",
    description:
      "Dos huevos revueltos, frijoles molidos, crema o queso, plátano y salsa ranchera. Acompañado con un croissant recién horneado.",
  },
  {
    id: "plato_3",
    name: "Croissant Recién Horneado",
    short: "Croissant",
    description:
      "Croissant de mantequilla, omelette, jamón de pavo y queso cheddar. Acompañado con yogurt, granola y miel.",
  },
];

/**
 * Platos que ya no se ofrecen. Solo sirven para nombrar en el admin las
 * respuestas que los eligieron antes de quitarlos.
 */
export const retiredDishes: { id: DishId; name: string; short: string }[] = [
  { id: "plato_2", name: "Omelette Recién Horneado", short: "Omelette" },
];

/** Solo los platos vigentes se aceptan en la API. */
export const dishIds = dishes.map((d) => d.id);

function findDish(id: string | null) {
  return dishes.find((d) => d.id === id) ?? retiredDishes.find((d) => d.id === id);
}

export function dishName(id: string | null) {
  return findDish(id)?.name ?? "—";
}

export function dishShort(id: string | null) {
  return findDish(id)?.short ?? "—";
}

export function googleCalendarUrl() {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${event.honoree}`,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt)}`,
    details: "¡Te espero para celebrar!",
    location: `${event.venue}, ${event.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
