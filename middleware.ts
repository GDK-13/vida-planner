// Middleware de borda da Vercel — roda antes de qualquer página ou API.
// Funciona em projetos estáticos (não precisa ser um app Next.js completo).
//
// Configure em: Vercel → seu projeto → Settings → Environment Variables
//   SITE_USER = seu usuário
//   SITE_PASS = sua senha

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

export default function middleware(req: Request): Response {
  const auth = req.headers.get('authorization');
  const expectedUser = process.env.SITE_USER;
  const expectedPass = process.env.SITE_PASS;

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (user === expectedUser && pass === expectedPass) {
        return new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } });
      }
    }
  }

  return new Response('Autenticação necessária.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Vida"' },
  });
}
