export type Vaga = {
  id_vaga: number;
  titulo?: string;
  descricao?: string;
  requisitos?: string;
  local_trabalho?: string;
  tipo_contrato?: string;
  salario?: number;
  beneficios?: string;
  status?: string;
  responsavel?: string;
  data_abertura?: string;
  data_fechamento?: string | null;
};

const JSON_HEADERS = { "content-type": "application/json" };

export async function consultarVagas(): Promise<Vaga[]> {
  const res = await fetch("/api/vagas/consulta", {
    method: "POST",
    headers: JSON_HEADERS,
    cache: "no-store",
    body: JSON.stringify({})
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function detalheVaga(id_vaga: number): Promise<Vaga | null> {
  const res = await fetch("/api/vagas/detalhes", {
    method: "POST",
    headers: JSON_HEADERS,
    cache: "no-store",
    body: JSON.stringify({ id_vaga })
  });
  if (!res.ok) return null;
  const item = await res.json().catch(() => null);
  return item && typeof item === "object" ? item as Vaga : null;
}

export type Candidatura = {
  id_vaga: number;
  nome: string;
  email: string;
  telefone?: string;
  cv_url?: string;
  respostas?: Record<string, unknown>;
};

export async function incluirCandidatura(c: Candidatura) {
  const res = await fetch("/api/candidaturas/inclui", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(c)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Erro ao enviar candidatura: ${res.status} ${text}`);
  }
  return await res.json().catch(() => ({}));
}
