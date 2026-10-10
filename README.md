# Invitación de graduación

Next.js 16 (App Router) + motion + Tailwind 4 + Supabase. Misma arquitectura que `../invite`.

## Flujo

1. **Portada**: sobre con sello de lacre → al tocar se abre, sale el birrete con confeti y sube la tarjeta.
2. **Invitación**: "te invito a celebrar mi graduación", foto de la graduada, fecha.
3. **Detalles**: fecha/hora, lugar con mapa (Recién Horneado · San Benito), calendario, vestimenta, recuerdos.
4. **Confirmar** (una decisión por pantalla): ¿vienes? → plato (solo si viene) → nombre → guardar.
5. **Gracias**: mensaje distinto si viene o no.

Navegación: botones, riel superior, deslizar, rueda del mouse y flechas del teclado.

## Dónde se cambia cada cosa

| Qué | Archivo |
| --- | --- |
| Textos, fecha, lugar, fotos, menú | `src/lib/event.ts` |
| Colores y tipografía (tokens) | `src/app/globals.css` (`:root`) y `src/app/layout.tsx` |
| Fotos | `public/photos/…` y su ruta en `event.photos` (`src: null` = marco vacío) |

## Supabase

Se reutiliza el mismo proyecto que `invite` (plan gratuito). La tabla es `invite.gradu_rsvps`;
el schema `invite` ya está expuesto en la API, así que solo hay que correr `supabase/schema.sql`
en el SQL Editor una vez.

Variables en `.env.local` (ver `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` y opcional `NEXT_PUBLIC_SITE_URL` (para las imágenes OG).

## Panel

`/admin` (clave `ADMIN_PASSWORD`): respuestas, asistentes, conteo por plato, búsqueda, filtro y CSV.

## Desarrollo

```bash
npm install
npm run dev   # http://localhost:3002
```
