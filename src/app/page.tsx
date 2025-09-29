import VagaCard from "@/components/VagaCard";
import VagasFilterBar from "@/components/VagasFilterBar";
import Pagination from "@/components/Pagination";
import type { Vaga } from "@/lib/api";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/server";

const DEFAULT_PAGE_SIZE = 8;

type UpstreamRow = Record<string, unknown>;

function normalize(row: UpstreamRow): Vaga | null {
  const get = (k: string): unknown =>
    row[k] ??
    (row as Record<string, unknown>)[(k as any)?.toUpperCase?.()] ??
    (row as Record<string, unknown>)[(k as any)?.toLowerCase?.()];

  const idRaw = get("id_vaga") ?? get("id") ?? get("codigo") ?? get("idvaga");
  const id = typeof idRaw === "string" ? parseInt(idRaw, 10) : Number(idRaw);
  if (!Number.isFinite(id)) return null;

  const salarioRaw = get("salario");
  const salarioNum =
    typeof salarioRaw === "string" ? Number(salarioRaw.replace(/[^0-9.-]+/g, "")) : Number(salarioRaw);

  return {
    id_vaga: id,
    titulo: (get("titulo") ?? get("title")) as string | undefined,
    descricao: (get("descricao") ?? get("description")) as string | undefined,
    requisitos: (get("requisitos") ?? get("requirements")) as string | undefined,
    local_trabalho: (get("local_trabalho") ?? get("local") ?? get("cidade")) as string | undefined,
    tipo_contrato: (get("tipo_contrato") ?? get("tipo") ?? get("contrato")) as string | undefined,
    salario: Number.isFinite(salarioNum) ? (salarioNum as number) : undefined,
    beneficios: get("beneficios") as string | undefined,
    status: get("status") as string | undefined,
    responsavel: get("responsavel") as string | undefined,
    data_abertura: (get("data_abertura") ?? get("abertura")) as string | undefined,
    data_fechamento: (get("data_fechamento") ?? get("fechamento")) as string | null | undefined,
  };
}

async function fetchVagas(): Promise<Vaga[]> {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/api/vagas/consulta`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({}),
    });
    if (!res.ok) return [];
    const data = (await res.json().catch(() => [])) as unknown;
    const arr: UpstreamRow[] = Array.isArray(data) ? (data as UpstreamRow[]) : [];
    return arr.map(normalize).filter(Boolean) as Vaga[];
  } catch {
    return [];
  }
}

function norm(s?: string) {
  return (s ?? "").toLowerCase();
}

export const metadata: Metadata = {
  title: "Vagas abertas | Portal RH",
  description: "Veja as oportunidades disponíveis e candidate-se online.",
  openGraph: {
    title: "Vagas abertas | Portal RH",
    description: "Veja as oportunidades disponíveis e candidate-se online.",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : "";
  const local = typeof searchParams.local === "string" ? searchParams.local : "";
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = Math.max(1, Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE));

  const all = await fetchVagas();

  const filtered = all.filter((v) => {
    const okQ = q ? norm(v.titulo).includes(norm(q)) || norm(v.descricao).includes(norm(q)) : true;
    const okLocal = local ? norm(v.local_trabalho).includes(norm(local)) : true;
    const okTipo = tipo ? norm(v.tipo_contrato) === norm(tipo) : true;
    return okQ && okLocal && okTipo;
  });

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filtered.slice(start, end);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Vagas abertas</h1>
        <p className="text-sm text-neutral-400">Veja as oportunidades disponíveis e candidate-se.</p>
      </header>

      <section className="mb-6">
        <VagasFilterBar />
      </section>

      {pageItems.length === 0 ? (
        <p className="text-neutral-400">Nenhuma vaga encontrada.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((v) => (
            <VagaCard key={v.id_vaga} vaga={v} />
          ))}
        </section>
      )}

      <Pagination page={page} total={filtered.length} pageSize={pageSize} q={q} tipo={tipo} local={local} />
    </main>
  );
}
