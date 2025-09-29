import Link from "next/link";

function buildQuery(params: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default function Pagination({
  page,
  total,
  pageSize,
  q,
  tipo,
  local,
}: {
  page: number;
  total: number;
  pageSize: number;
  q?: string;
  tipo?: string;
  local?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const prev = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);
  const base = { q, tipo, local, pageSize };

  return (
    <nav className="mt-6 flex items-center justify-center gap-3 text-sm">
      <Link
        href={buildQuery({ ...base, page: prev })}
        className="rounded-md border border-neutral-800 px-3 py-1 hover:border-neutral-600"
        aria-disabled={page === 1}
      >
        ← Anterior
      </Link>
      <span className="text-neutral-400">
        Página {page} de {pages}
      </span>
      <Link
        href={buildQuery({ ...base, page: next })}
        className="rounded-md border border-neutral-800 px-3 py-1 hover:border-neutral-600"
        aria-disabled={page === pages}
      >
        Próxima →
      </Link>
    </nav>
  );
}
