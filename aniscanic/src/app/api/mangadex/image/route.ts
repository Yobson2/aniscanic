// Image proxy for MangaDex: they serve a wrong image to hotlinked requests, so covers
// and chapter pages are fetched here server-side. Only MangaDex hosts are allowed.

const USER_AGENT = 'Aniscanic/0.1';
const RASTER_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function isAllowed(url: URL) {
  return (
    url.protocol === 'https:' &&
    (url.hostname === 'uploads.mangadex.org' || url.hostname.endsWith('.mangadex.network'))
  );
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('url');
  let target: URL;
  try {
    target = new URL(raw ?? '');
  } catch {
    return new Response('Paramètre url invalide', { status: 400 });
  }
  if (!isAllowed(target)) return new Response('Hôte non autorisé', { status: 403 });

  // No redirects: a 3xx could point outside the host allowlist.
  const upstream = await fetch(target, { headers: { 'User-Agent': USER_AGENT }, redirect: 'manual' });
  const mime = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  // Raster types only: SVG (or anything else) served from our origin could run script.
  if (upstream.status !== 200 || !RASTER_TYPES.includes(mime)) {
    return new Response('Image indisponible', { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': mime,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      // Covers and chapter pages never change for a given URL.
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
