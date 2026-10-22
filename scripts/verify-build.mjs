import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const basePath = normalizeBase(process.env.BASE_PATH ?? '/');
const siteURL = process.env.SITE_URL ?? 'http://localhost:4321';
const expectedPages = [
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

const failures = [];

if (!fs.existsSync(dist)) {
  fail('dist does not exist. Run the Astro build first.');
  finish();
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
const htmlByRoute = new Map(
  htmlFiles.map((file) => [routeForFile(file), fs.readFileSync(file, 'utf8')]),
);

for (const route of expectedPages) {
  if (!htmlByRoute.has(route)) fail(`Missing generated page: ${route}`);
}

for (const [route, html] of htmlByRoute) {
  if (!html.includes('<meta name="description"')) fail(`${route}: missing description`);
  if (!html.includes('<link rel="canonical"')) fail(`${route}: missing canonical URL`);
  if (route !== '/404.html') {
    if (!html.includes('hreflang="ja"')) fail(`${route}: missing Japanese alternate`);
    if (!html.includes('hreflang="en"')) fail(`${route}: missing English alternate`);
    if (!html.includes('hreflang="x-default"')) fail(`${route}: missing x-default alternate`);
  }

  for (const href of attributes(html, 'href')) {
    if (href.startsWith('mailto:') || /^(https?:)?\/\//.test(href)) continue;
    if (!href.startsWith(basePath)) continue;

    const [pathname, fragment] = href.slice(basePath.length).split('#');
    const targetRoute = pathname ? `/${pathname}` : '/';
    const normalizedTarget = targetRoute.endsWith('/') || path.extname(targetRoute)
      ? targetRoute
      : `${targetRoute}/`;
    const targetHTML = htmlByRoute.get(normalizedTarget);

    if (!targetHTML && !assetExists(pathname)) {
      fail(`${route}: unresolved internal link ${href}`);
      continue;
    }

    if (fragment && targetHTML && !targetHTML.includes(`id="${fragment}"`)) {
      fail(`${route}: unresolved fragment ${href}`);
    }
  }
}

const privacyPairs = [
  ['/privacy/', '/en/privacy/'],
  ['/terms/', '/en/terms/'],
  ['/account-deletion/', '/en/account-deletion/'],
];
for (const [ja, en] of privacyPairs) {
  for (const route of [ja, en]) {
    const html = htmlByRoute.get(route) ?? '';
    if (!html.includes('datetime="2026-10-22"')) fail(`${route}: missing document revision date`);
    if (!html.includes('class="draft-notice"')) fail(`${route}: missing draft disclosure`);
  }
}

const allHTML = [...htmlByRoute.values()].join('\n');
if (allHTML.includes('example.com')) fail('Generated site contains example.com placeholder');
if (allHTML.includes('support@example')) fail('Generated site contains placeholder support email');

const robots = readOptional(path.join(dist, 'robots.txt'));
if (!robots) fail('Missing robots.txt');
if (allHTML.includes('noindex, nofollow') && !robots.includes('Disallow: /')) {
  fail('Draft pages are noindex but robots.txt does not disallow crawling');
}

const sitemap = readOptional(path.join(dist, 'sitemap.xml'));
for (const route of expectedPages) {
  const expectedPath = `${basePath}${stripLeadingSlash(route)}`.replace(/\/{2,}/g, '/');
  const expectedURL = new URL(expectedPath, new URL(siteURL).origin).toString();
  if (!sitemap.includes(expectedURL)) fail(`sitemap.xml is missing ${expectedURL}`);
}

finish();

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function routeForFile(file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function attributes(html, name) {
  return [...html.matchAll(new RegExp(`${name}="([^"]+)"`, 'g'))].map((match) => match[1]);
}

function assetExists(relativePath) {
  return fs.existsSync(path.join(dist, relativePath));
}

function readOptional(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function normalizeBase(value) {
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function stripLeadingSlash(value) {
  return value.replace(/^\//, '');
}

function fail(message) {
  failures.push(message);
}

function finish() {
  if (failures.length) {
    console.error(`Build verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Build verification passed: ${htmlFiles.length} HTML files and ${expectedPages.length} public routes checked.`);
}
