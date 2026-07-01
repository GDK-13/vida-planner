import { Redis } from '@upstash/redis';

// Credenciais vêm da integração Vercel Marketplace (Upstash/KV), que já
// injeta essas variáveis automaticamente no projeto — nada pra configurar
// manualmente:
//   KV_REST_API_URL
//   KV_REST_API_TOKEN

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
const KEY = 'vida:db';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'GET') {
    const data = (await redis.get(KEY)) ?? { db: [], updatedAt: Date.now() };
    return Response.json(data);
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    if (!body || !Array.isArray(body.db)) {
      return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 });
    }
    await redis.set(KEY, body);
    return Response.json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
}
