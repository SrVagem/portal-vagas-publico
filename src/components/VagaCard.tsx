import Link from "next/link";
import { type Vaga } from "@/lib/api";

export default function VagaCard({ vaga }: { vaga: Vaga }) {
  return (
    <article className="rounded-2xl border border-neutral-700 bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 hover:shadow-lg hover:shadow-indigo-500/20 transition">
  <div className="flex items-start justify-between gap-4">
    <div>
      <h3 className="text-lg font-semibold leading-tight text-white">
        <Link href={`/vaga/${vaga.id_vaga}`} className="hover:text-indigo-400 transition">
          {vaga.titulo ?? `Vaga #${vaga.id_vaga}`}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-neutral-400 line-clamp-3">
        {vaga.descricao ?? "Sem descrição."}
      </p>
    </div>
    {typeof vaga.salario === "number" && (
      <span className="shrink-0 text-sm font-medium text-emerald-400">
        R$ {vaga.salario.toLocaleString("pt-BR")}
      </span>
    )}
  </div>
  <div className="mt-3 flex flex-wrap gap-2 text-xs">
    {vaga.local_trabalho && <span className="rounded-full bg-indigo-600/20 px-2 py-1 text-indigo-400">{vaga.local_trabalho}</span>}
    {vaga.tipo_contrato && <span className="rounded-full bg-emerald-600/20 px-2 py-1 text-emerald-400">{vaga.tipo_contrato}</span>}
    {vaga.status && <span className={`rounded-full px-2 py-1 ${
      vaga.status.toLowerCase() === "aberta" ? "bg-green-600/20 text-green-400" :
      vaga.status.toLowerCase() === "fechada" ? "bg-red-600/20 text-red-400" :
      "bg-amber-600/20 text-amber-400"
    }`}>{vaga.status}</span>}
  </div>
</article>
  );
}
