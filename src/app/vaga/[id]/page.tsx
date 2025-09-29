import type { Vaga } from "@/lib/api";
import CandidaturaForm from "@/components/CandidaturaForm";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/server";
import Link from "next/link";

async function getVaga(id: number): Promise<Vaga | null> {
  const base = getBaseUrl();
  try {
    const res = await fetch(`${base}/api/vagas/detalhes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ id_vaga: id }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = Number(params.id);
  const vaga = Number.isFinite(id) ? await getVaga(id) : null;
  const title = vaga?.titulo ? `${vaga.titulo} | Vaga #${vaga.id_vaga} | Portal RH` : `Vaga #${params.id} | Portal RH`;
  const description = vaga?.descricao ?? "Detalhes da vaga e formulário de candidatura.";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function VagaDetalhePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const vaga = Number.isFinite(id) ? await getVaga(id) : null;

  if (!vaga) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-neutral-400">Vaga não encontrada.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-neutral-400 hover:underline">
        &larr; Voltar
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{vaga.titulo ?? `Vaga #${vaga.id_vaga}`}</h1>
      <div className="mt-2 text-sm text-neutral-400 flex gap-3">
        {vaga.local_trabalho && <span>{vaga.local_trabalho}</span>}
        {vaga.tipo_contrato && <span>&middot; {vaga.tipo_contrato}</span>}
      </div>
      {vaga.salario && <p className="mt-1 text-sm">Salário: R$ {vaga.salario.toLocaleString("pt-BR")}</p>}

      <section className="prose prose-invert mt-6">
        <h2>Descrição</h2>
        <p>{vaga.descricao ?? "Sem descrição."}</p>
        {vaga.requisitos && (
          <>
            <h3>Requisitos</h3>
            <p className="whitespace-pre-wrap">{vaga.requisitos}</p>
          </>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-800 p-6">
        <h2 className="text-lg font-semibold">Candidate-se</h2>
        <p className="text-sm text-neutral-400">Preencha seus dados e enviaremos ao RH.</p>
        <div className="mt-4">
          <CandidaturaForm id_vaga={vaga.id_vaga} />
        </div>
      </section>
    </main>
  );
}
