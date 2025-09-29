export const dynamic = "force-dynamic";

type CandidaturaBody = {
  id_vaga: number;
  nome: string;
  email: string;
  telefone?: string;
  cv_url?: string;
  respostas?: Record<string, unknown>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<CandidaturaBody>;
    if (!body?.nome || !body?.email || !body?.id_vaga) {
      return new Response(JSON.stringify({
        ok: false,
        message: "Preencha nome, email e tente novamente."
      }), { status: 400, headers: { "content-type": "application/json" } });
    }

    const url = process.env.N8N_INCLUI_CANDIDATURA;
    if (!url) {
      return new Response(JSON.stringify({
        ok: false,
        message: "Destino de candidatura não configurado."
      }), { status: 500, headers: { "content-type": "application/json" } });
    }

    const up = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await up.text();
    let payload: unknown = {};
    try { payload = text ? JSON.parse(text) : {}; } catch { payload = { raw: text } as unknown; }

    if (up.ok) {
      const msg = (payload as { msg?: string })?.msg ?? "Candidatura enviada com sucesso!";
      return new Response(JSON.stringify({ ok: true, message: msg }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }

    const message = (payload as { message?: string })?.message ?? "Não foi possível enviar sua candidatura. Tente novamente em instantes.";
    return new Response(JSON.stringify({ ok: false, message }), {
      status: 502, headers: { "content-type": "application/json" }
    });

  } catch (_e: unknown) {
    return new Response(JSON.stringify({
      ok: false,
      message: "Erro inesperado ao enviar sua candidatura."
    }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
