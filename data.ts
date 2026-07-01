import { Redis } from '@upstash/redis';

// Credenciais do Upstash ficam em variáveis de ambiente na Vercel:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// (o Upstash te dá essas duas ao criar o banco — copie e cole nas envs da Vercel)

const redis = Redis.fromEnv();
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
