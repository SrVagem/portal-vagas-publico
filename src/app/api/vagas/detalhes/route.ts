export const dynamic = "force-dynamic";

function toNumber(x: any) {
  const n = typeof x === "string" ? parseInt(x, 10) : Number(x);
  return Number.isFinite(n) ? n : undefined;
}

export async function POST(req: Request) {
  try {
    const { id_vaga } = await req.json().catch(() => ({}));
    const id = toNumber(id_vaga);
    if (!id) return new Response(JSON.stringify({ error: "id_vaga inválido" }), { status: 400 });

    // como ainda não temos webhook dedicado “consulta por id”,
    // reutilizamos a consulta geral e filtramos no app:
    const up = await fetch("https://n8n.uninova.ai/webhook/uninova-consulta-vagas", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({}), cache: "no-store"
    });
    const arr = await up.json().catch(() => []);
    const item = Array.isArray(arr) ? arr.find((v: any) => Number(v?.id_vaga) === id) : null;
    return new Response(JSON.stringify(item ?? null), {
      status: item ? 200 : 404,
      headers: { "content-type": "application/json" }
    });
  } catch (e: any) {
    console.error("[public/detalhe] erro:", e?.message || e);
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
