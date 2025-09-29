export const dynamic = "force-dynamic";

function toNumber(x: unknown) {
  const n = typeof x === "string" ? parseInt(x, 10) : Number(x);
  return Number.isFinite(n) ? n : undefined;
}

export async function POST(req: Request) {
  try {
    const { id_vaga } = (await req.json().catch(() => ({}))) as { id_vaga?: unknown };
    const id = toNumber(id_vaga);
    if (!id) return new Response(JSON.stringify({ error: "id_vaga inválido" }), { status: 400 });

    const up = await fetch("https://n8n.uninova.ai/webhook/uninova-consulta-vagas", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({}), cache: "no-store"
    });
    const arr = (await up.json().catch(() => [])) as unknown;
    const list = Array.isArray(arr) ? arr : [];
    const item = list.find((v: unknown) => {
      const vv = v as Record<string, unknown>;
      const raw = vv?.["id_vaga"];
      const vid = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
      return Number.isFinite(vid) && vid === id;
    }) ?? null;

    return new Response(JSON.stringify(item), {
      status: item ? 200 : 404,
      headers: { "content-type": "application/json" }
    });
  } catch (_e: unknown) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
