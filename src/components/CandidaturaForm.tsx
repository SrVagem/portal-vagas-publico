"use client";
import DynamicForm from "@/components/DynamicForm";
import { incluirCandidatura } from "@/lib/api";
import { useState } from "react";
import { type FormSchema } from "@/lib/form-schema";

const schema: FormSchema = {
  fields: [
    { type: "text", name: "nome", label: "Nome", required: true },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "text", name: "telefone", label: "Telefone" },
    { type: "text", name: "cv_url", label: "Link do currículo (Drive/LinkedIn)" },
    { type: "textarea", name: "mensagem", label: "Mensagem" }
  ]
};

export default function CandidaturaForm({ id_vaga }:{ id_vaga: number }) {
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div>
      {ok && <p className="mb-3 text-green-400 text-sm">{ok}</p>}
      {err && <p className="mb-3 text-red-400 text-sm">{err}</p>}
      <DynamicForm
        schema={schema}
        onSubmit={async (values) => {
          setOk(null); setErr(null);
          try {
            const r = await incluirCandidatura({
              id_vaga,
              nome: String(values.nome || ""),
              email: String(values.email || ""),
              telefone: values.telefone ? String(values.telefone) : undefined,
              cv_url: values.cv_url ? String(values.cv_url) : undefined,
              respostas: { mensagem: values.mensagem ?? "" }
            });
            setOk(r?.message || "Candidatura enviada com sucesso!");
          } catch (e: any) {
            setErr(e?.message || "Não foi possível enviar sua candidatura. Tente novamente.");
          }
        }}
      />
    </div>
  );
}
