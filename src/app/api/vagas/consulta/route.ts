export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const upstream = await fetch("https://n8n.uninova.ai/webhook/uninova-consulta-vagas", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
      cache: "no-store",
    });
    const text = await upstream.text();
    return new Response(text || "[]", {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  } catch (_e: unknown) {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
