/**
 * Todo el contenido de la invitación vive aquí. Cuando tengamos nombre, fotos
 * y menú definitivos, solo se cambia este archivo.
 */
export const event = {
  honoree: "Nombre de la graduada",
  /** Iniciales para el sello y los marcos de foto vacíos. */
  monogram: "G",
  degree: "Licenciatura en …",
  school: "Universidad …",
  classOf: "Promoción 2026",
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
  time: "9:00 a. m.",
  /** Inicio y fin en hora de El Salvador (UTC-6) para el calendario. */
  startsAt: "2026-11-01T09:00:00-06:00",
  endsAt: "2026-11-01T12:00:00-06:00",
  venue: "Recién Horneado",
  venueDetail: "Bakery · San Benito",
  address: "Colonia San Benito, San Salvador",
  lat: 13.6953718,
  lng: -89.2430306,
  mapsUrl:
    "https://www.google.com/maps/place/Reci%C3%A9n+Horneado+Bakery+%E2%80%A2+San+Benito/@13.6953718,-89.2430306,17z/data=!3m1!4b1!4m6!3m5!1s0x8f63313a1da857cd:0xf91bda0d856c9c59!8m2!3d13.6953718!4d-89.2430306!16s%2Fg%2F11rt_m5rhc",
  dressCode: "Elegante casual",
  /** Fotos de la graduada. `src: null` muestra un marco elegante vacío. */
  photos: {
    cover: { src: null as string | null, alt: "La graduada" },
    gallery: [
      { src: null as string | null, alt: "Recuerdo 1", rotate: "-6deg" },
      { src: null as string | null, alt: "Recuerdo 2", rotate: "4deg" },
      { src: null as string | null, alt: "Recuerdo 3", rotate: "-2deg" },
    ],
  },
  rsvp: {
    deadlineNote: "Por favor confirma antes del 20 de octubre.",
  },
} as const;

export type DishId = "plato_1" | "plato_2" | "plato_3";

/** Menú de desayuno de Recién Horneado (página 7 de la carta, sin precios). */
export const menu = {
  title: "Nuestro menú",
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
    id: "plato_2",
    name: "Omelette Recién Horneado",
    short: "Omelette",
    description:
      "Tocino, jamón, pierna mechada, cebolla salteada, queso cheddar. Acompañado de frijoles molidos y plátano.",
  },
  {
    id: "plato_3",
    name: "Croissant Recién Horneado",
    short: "Croissant",
    description:
      "Croissant de mantequilla, omelette, jamón de pavo y queso cheddar. Acompañado con yogurt, granola y miel.",
  },
];

export const dishIds = dishes.map((d) => d.id);

export function dishName(id: string | null) {
  return dishes.find((d) => d.id === id)?.name ?? "—";
}

export function dishShort(id: string | null) {
  return dishes.find((d) => d.id === id)?.short ?? "—";
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
