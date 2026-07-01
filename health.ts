export const config = { runtime: 'edge' };

export default function handler(): Response {
  return Response.json({ ok: true, time: Date.now() });
}
