"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { dishes, dishName, event, retiredDishes } from "@/lib/event";
import type { RsvpRow } from "@/lib/supabase";

const labels = {
  si: "Asiste",
  no: "No asiste",
} as const;

type Filter = "todos" | "si" | "no";
type LoadResult = { status: number; rsvps?: RsvpRow[]; error?: string };

async function fetchRsvps(): Promise<LoadResult> {
  const res = await fetch("/api/admin/rsvps");
  if (res.status === 401) return { status: 401 };
  const data = (await res.json().catch(() => ({}))) as { rsvps?: RsvpRow[]; error?: string };
  if (!res.ok) return { status: res.status, error: data.error || "No se pudo cargar." };
  return { status: res.status, rsvps: data.rsvps ?? [] };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [error, setError] = useState("");

  function apply(result: LoadResult) {
    if (result.status === 401) {
      setAuthed(false);
    } else {
      setError(result.error ?? "");
      if (result.rsvps) setRsvps(result.rsvps);
      setAuthed(true);
    }
    setChecking(false);
  }

  async function load() {
    apply(await fetchRsvps());
  }

  useEffect(() => {
    void fetchRsvps().then(apply);
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error || "No se pudo entrar.");
      return;
    }
    setPassword("");
    await load();
  }

  const filtered = rsvps.filter(
    (row) =>
      (filter === "todos" || row.attending === filter) &&
      `${row.name} ${dishName(row.dish)}`.toLowerCase().includes(query.toLowerCase()),
  );

  const stats = useMemo(() => {
    const going = rsvps.filter((r) => r.attending === "si");
    return {
      responses: rsvps.length,
      going: going.length,
      declined: rsvps.length - going.length,
      // Los platos retirados solo aparecen si alguien los eligió antes de quitarlos.
      byDish: [
        ...dishes.map((d) => ({ ...d, count: going.filter((r) => r.dish === d.id).length })),
        ...retiredDishes
          .map((d) => ({ ...d, short: `${d.short} (retirado)`, count: going.filter((r) => r.dish === d.id).length }))
          .filter((d) => d.count > 0),
      ],
    };
  }, [rsvps]);

  function exportCsv() {
    const header = "nombre,asistencia,plato,fecha";
    const rows = rsvps.map((r) =>
      [r.name, labels[r.attending], r.dish ? dishName(r.dish) : "", r.created_at]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["﻿" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graduacion-confirmaciones.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (checking) {
    return (
      <main className="stage-root grid min-h-dvh place-items-center">
        <div className="paper-bg" />
        <p className="serif relative z-10 text-lg italic text-muted">Cargando…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="stage-root grid min-h-dvh place-items-center px-5">
        <div className="paper-bg" />
        <form onSubmit={login} className="card card-frame relative z-10 w-full max-w-sm space-y-5 p-9 text-center">
          <p className="kicker">panel</p>
          <h1 className="script text-5xl text-ink">Confirmaciones</h1>
          <p className="text-sm text-muted">Solo para ver quién confirmó y qué plato eligió.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Clave"
            className="w-full rounded-full border border-rose/40 bg-white/80 px-5 py-3 text-center outline-none focus:border-rose-deep"
          />
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <button className="btn-gold w-full">entrar</button>
        </form>
      </main>
    );
  }

  return (
    <main className="stage-root min-h-dvh px-5 py-10">
      <div className="paper-bg" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">panel · {event.dateShort}</p>
            <h1 className="script mt-1 text-5xl text-ink sm:text-6xl">Invitados</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void load()} className="btn-ghost">
              actualizar
            </button>
            <button onClick={exportCsv} className="btn-ghost">
              exportar csv
            </button>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                setAuthed(false);
              }}
              className="btn-link px-3"
            >
              salir
            </button>
          </div>
        </div>

        {error && <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat label="Respuestas" value={stats.responses} />
          <Stat label="Asisten" value={stats.going} />
          <Stat label="No asisten" value={stats.declined} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {stats.byDish.map((d) => (
            <Stat key={d.id} label={d.short} value={d.count} accent />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o plato"
            className="w-full rounded-full border border-rose/30 bg-white/80 px-5 py-3 outline-none focus:border-rose-deep"
          />
          <div className="flex gap-2">
            {(["todos", "si", "no"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rail-step whitespace-nowrap border border-rose/30 ${filter === f ? "active" : "bg-white/70"}`}
              >
                {f === "todos" ? "todos" : labels[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-5 py-4">Nombre</th>
                <th className="px-5 py-4">Asistencia</th>
                <th className="px-5 py-4">Plato</th>
                <th className="px-5 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-rose/20">
                  <td className="serif px-5 py-3 text-lg text-ink">{row.name}</td>
                  <td className="px-5 py-3">
                    <span className={row.attending === "si" ? "text-rose-deep" : "text-muted"}>{labels[row.attending]}</span>
                  </td>
                  <td className="px-5 py-3">{dishName(row.dish)}</td>
                  <td className="px-5 py-3 text-muted">{new Date(row.created_at).toLocaleString("es-SV")}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="serif px-5 py-12 text-center text-lg italic text-muted">
                    Todavía no hay confirmaciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-3xl border border-rose/25 p-4 sm:p-5 ${accent ? "bg-rose text-white" : "bg-white/75"}`}>
      <p className={`text-[0.6rem] uppercase tracking-[0.25em] ${accent ? "text-white" : "text-muted"}`}>{label}</p>
      <p className={`display mt-2 text-4xl ${accent ? "text-white" : "text-rose-deep"}`}>{value}</p>
    </div>
  );
}
