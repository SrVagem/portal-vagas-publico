export type Field =
  | { type: "text"; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: "email"; name: string; label: string; required?: boolean }
  | { type: "textarea"; name: string; label: string; required?: boolean }
  | { type: "select"; name: string; label: string; options: string[]; required?: boolean }
  | { type: "file"; name: string; label: string; required?: boolean };

export type FormSchema = { fields: Field[] };
