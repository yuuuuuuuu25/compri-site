import type { APIRoute } from 'astro';

const routes = [
  '/',
  '/support/',
  '/privacy/',
  '/terms/',
  '/account-deletion/',
  '/en/',
  '/en/support/',
  '/en/privacy/',
  '/en/terms/',
  '/en/account-deletion/',
];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('http://localhost:4321');
  const urls = routes
    .map((route) => `  <url><loc>${new URL(route.replace(/^\//, ''), `${base.toString().replace(/\/$/, '')}/`).toString()}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
