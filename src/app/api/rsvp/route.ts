import { NextResponse } from "next/server";
import { dishIds, type DishId } from "@/lib/event";
import { hasSupabaseConfig, RSVP_TABLE, supabaseAdmin, supabasePublic } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      { error: "La confirmación todavía no está conectada." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    attending?: string;
    dish?: string | null;
  } | null;

  const name = body?.name?.trim().replace(/\s+/g, " ") ?? "";
  const attending = body?.attending;
  const dish = body?.dish ?? null;

  if (attending !== "si" && attending !== "no") {
    return NextResponse.json({ error: "Elige si vienes o no." }, { status: 400 });
  }
  if (attending === "si" && !dishIds.includes(dish as DishId)) {
    return NextResponse.json({ error: "Elige tu plato." }, { status: 400 });
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  }

  const payload = {
    name,
    attending,
    dish: attending === "si" ? dish : null,
  };

  const client = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? supabaseAdmin()
    : supabasePublic();

  const { error } = await client.from(RSVP_TABLE).insert(payload);
  if (error) {
    return NextResponse.json({ error: "No se pudo guardar tu confirmación." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
