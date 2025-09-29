export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Encaminha para o n8n (ajuste a URL se já existir um webhook de candidatura)
    const url = process.env.N8N_INCLUI_CANDIDATURA || "https://n8n.uninova.ai/webhook/uninova-incluir-candidatura";
    const up = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store"
    });
    const text = await up.text();
    return new Response(text || "{}", {
      status: up.status,
      headers: { "content-type": "application/json" }
    });
  } catch (e: any) {
    console.error("[public/candidatura] erro:", e?.message || e);
    return new Response(JSON.stringify({ ok: false }), { status: 200 });
  }
}
