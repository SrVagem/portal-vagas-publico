"use client";
import { useState } from "react";
import { type FormSchema } from "@/lib/form-schema";

type Values = Record<string, string | File | undefined>;

export default function DynamicForm({
  schema,
  onSubmit,
}: {
  schema: FormSchema;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Values>({});
  const [sending, setSending] = useState(false);

  const setField = (name: string, v: string | File | undefined) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      await onSubmit(values as Record<string, unknown>);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {schema.fields.map((f) => {
        if (f.type === "text") {
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-neutral-300">{f.label}</label>
              <input
                required={!!f.required}
                placeholder={f.placeholder}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={(values[f.name] as string) ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "email") {
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-neutral-300">{f.label}</label>
              <input
                type="email"
                required={!!f.required}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={(values[f.name] as string) ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "textarea") {
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-neutral-300">{f.label}</label>
              <textarea
                required={!!f.required}
                className="min-h-24 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={(values[f.name] as string) ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            </div>
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-neutral-300">{f.label}</label>
              <select
                required={!!f.required}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={(values[f.name] as string) ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
              >
                <option value="">Selecione...</option>
                {f.options.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        if (f.type === "file") {
          return (
            <div key={f.name} className="grid gap-1">
              <label className="text-sm text-neutral-300">{f.label}</label>
              <input
                type="file"
                required={!!f.required}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setField(f.name, e.target.files?.[0])}
              />
            </div>
          );
        }
        return null;
      })}
      <button
        type="submit"
        disabled={sending}
        className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
