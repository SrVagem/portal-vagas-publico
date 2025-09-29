"use client";
import { useState } from "react";
import { type FormSchema } from "@/lib/form-schema";

export default function DynamicForm({ schema, onSubmit }:{
  schema: FormSchema;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [sending, setSending] = useState(false);

  const set = (name: string, v: any) => setValues(prev => ({ ...prev, [name]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try { await onSubmit(values); } finally { setSending(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {schema.fields.map((f) => {
        // … (aqui ficam os cases que te passei antes: text, email, select, etc.)
      })}
      <button
        type="submit"
        disabled={sending}
        className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
