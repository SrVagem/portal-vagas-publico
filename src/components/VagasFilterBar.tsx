"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VagasFilterBar() {
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [tipo, setTipo] = useState(sp.get("tipo") ?? "");
  const [local, setLocal] = useState(sp.get("local") ?? "");

  // keep inputs in sync if user navigates via back/forward
  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setTipo(sp.get("tipo") ?? "");
    setLocal(sp.get("local") ?? "");
  }, [sp]);

  return (
    <form method="GET" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      <input
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busque por título ou descrição..."
        className="rounded-xl border border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-600"
      />

      <input
        name="local"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Cidade/Local"
        className="rounded-xl border border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-600"
      />

      <select
        name="tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="rounded-xl border border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-600"
      >
        <option value="">Tipo de contrato (todos)</option>
        <option value="CLT">CLT</option>
        <option value="PJ">PJ</option>
        <option value="Estágio">Estágio</option>
        <option value="Temporário">Temporário</option>
      </select>

      <button
        type="submit"
        className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/15 transition"
      >
        Filtrar
      </button>
    </form>
  );
}
