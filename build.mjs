/* Assembles dist/ — the files that belong on a public web server.
 *
 * Used by:
 *   · Cloudflare build command   →  node build.mjs   (then npx wrangler deploy)
 *   · make-upload.ps1            →  for manual drag-and-drop deploys
 *
 * Keeping one script means the automatic and manual routes can never
 * disagree about what gets published.
 */
import { existsSync, cpSync, rmSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

// Local tooling, docs and database SQL — none of it belongs on the web server.
const EXCLUDE = new Set([
  'dist', 'node_modules', '.git', '.gitignore', '.github',
  'build.mjs', 'wrangler.jsonc', 'wrangler.toml', 'vercel.json',
  'serve.js', 'START WEBSITE.bat',
  'README.md', 'PHOTO-CREDITS.md',
  'supabase'
]);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const entry of readdirSync(root)) {
  if (EXCLUDE.has(entry)) continue;
  cpSync(join(root, entry), join(dist, entry), { recursive: true });
}

// Fail the build loudly rather than deploying something broken.
const REQUIRED = [
  'index.html', 'product.html', 'cart.html', 'checkout.html',
  'account.html', 'favourites.html', 'admin.html', '404.html',
  '_headers', 'assets/css/style.css', 'assets/js/store.js', 'assets/img/logo.jpg'
];
const missing = REQUIRED.filter(f => !existsSync(join(dist, f)));
if (missing.length) {
  console.error('BUILD FAILED — missing from dist/: ' + missing.join(', '));
  process.exit(1);
}

let count = 0, bytes = 0;
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p); else { count++; bytes += s.size; }
  }
})(dist);

console.log(`dist/ ready — ${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
