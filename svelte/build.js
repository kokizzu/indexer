import chokidar from 'chokidar';
import esbuild from 'esbuild';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import sveltePlugin from 'esbuild-svelte';
import svelteConfig from './svelte.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');
const serveOnly = process.argv.includes('--serve-only');
const minify = process.argv.includes('--minify');

const appCss = join(__dirname, 'app.css');
const rootPage = join(__dirname, 'index.svelte');
const rootEntry = join(__dirname, 'index.svelte.ts');
const componentsDir = join(__dirname, '_components');
const statesDir = join(__dirname, '_states');
const helpersDir = join(__dirname, '_helpers');
const layoutPath = join(__dirname, '_layout.html');
const faviconPath = join(__dirname, 'favicon.svg');
const svelteConfigPath = join(__dirname, 'svelte.config.js');
const jsApiPath = join(__dirname, 'jsApi.GEN.js');
const appControllerPath = join(__dirname, 'appController.js');
const mimeByExt = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

function normalizeRel(path) {
  return path.replaceAll('\\', '/');
}

function pageDir(pageRel) {
  return dirname(join(__dirname, pageRel));
}

function htmlPathFor(pageRel) {
  return join(pageDir(pageRel), `${basename(pageRel, '.svelte')}.html`);
}

function jsPathFor(pageRel) {
  return join(pageDir(pageRel), `${basename(pageRel, '.svelte')}.js`);
}

function basename(path, suffix = '') {
  const normalized = normalizeRel(path);
  const base = normalized.split('/').pop() || '';
  return suffix && base.endsWith(suffix) ? base.slice(0, -suffix.length) : base;
}

function safeFilePath(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0]);
  const normalized = pathname === '/' ? '/index.html' : pathname;
  const fullPath = join(__dirname, normalized.replace(/^\/+/, ''));
  if (!fullPath.startsWith(__dirname)) {
    return '';
  }
  return fullPath;
}

function contentTypeFor(pathname) {
  const idx = pathname.lastIndexOf('.');
  if (idx < 0) return 'application/octet-stream';
  return mimeByExt[pathname.slice(idx).toLowerCase()] || 'application/octet-stream';
}

function startStaticServer(port = 3900, attempts = 20) {
  const server = http.createServer((req, res) => {
    try {
      let filePath = safeFilePath(req.url || '/');
      if ((req.url || '').split('?')[0] === '/favicon.ico') {
        filePath = join(__dirname, 'favicon.svg');
      }
      if (!filePath || !existsSync(filePath)) {
        res.statusCode = 404;
        res.setHeader('content-type', 'text/plain; charset=utf-8');
        res.end('Not found');
        return;
      }
      const body = readFileSync(filePath);
      res.statusCode = 200;
      res.setHeader('content-type', contentTypeFor(filePath));
      res.end(body);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain; charset=utf-8');
      res.end(String(err?.message || err));
    }
  });
  const tryListen = currentPort => new Promise((resolve, reject) => {
    const onError = err => {
      server.off('listening', onListening);
      if (err?.code === 'EADDRINUSE' && currentPort < port + attempts) {
        resolve(tryListen(currentPort + 1));
        return;
      }
      reject(err);
    };
    const onListening = () => {
      server.off('error', onError);
      console.log(`dev server listening at http://127.0.0.1:${currentPort}`);
      resolve(server);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(currentPort, '127.0.0.1');
  });
  return tryListen(port);
}

function discoverPages(dir = __dirname, relDir = '') {
  const fullDir = join(dir, relDir);
  const entries = readdirSync(fullDir, { withFileTypes: true });
  const pages = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.svelte-gen' || entry.name.startsWith('.')) {
      continue;
    }
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_')) continue;
      pages.push(...discoverPages(dir, join(relDir, entry.name)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.svelte')) continue;
    if (entry.name.startsWith('_')) continue;
    pages.push(normalizeRel(join(relDir, entry.name)));
  }
  return pages.sort();
}

function nearestLayout(pageRel) {
  let dir = pageDir(pageRel);
  while (true) {
    const candidate = join(dir, '_layout.html');
    if (existsSync(candidate)) return candidate;
    if (dir === __dirname) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return layoutPath;
}

function scriptPathFor(pageRel) {
  return './' + basename(pageRel, '.svelte') + '.js';
}

function buildHtml(pageRel, buildToken) {
  const layout = readFileSync(nearestLayout(pageRel), 'utf8');
  return layout
    .replace('<!-- content_goes_here -->', '<main id="app"></main>')
    .replace('href="/app.css"', `href="/app.css?v=${buildToken}"`)
    .replace('href="/favicon.svg"', `href="/favicon.svg?v=${buildToken}"`)
    .replace('<!-- scripts_go_here -->', `  <script src="${scriptPathFor(pageRel)}?v=${buildToken}"></script>`);
}

function entrySource(pageRel) {
  if (pageRel === 'index.svelte') {
    return `import './index.svelte.ts';`;
  }
  return [
    `import { mount } from 'svelte';`,
    `import Page from './${normalizeRel(pageRel)}';`,
    `import './jsApi.GEN.js';`,
    `const target = document.getElementById('app');`,
    `if (target) {`,
    `  target.innerHTML = '';`,
    `  mount(Page, { target });`,
    `}`,
  ].join('\n');
}

async function bundlePage(pageRel, buildToken) {
  const outfile = jsPathFor(pageRel);
  mkdirSync(dirname(outfile), { recursive: true });
  await esbuild.build({
    stdin: {
      contents: entrySource(pageRel),
      resolveDir: __dirname,
      sourcefile: pageRel.replace(/\.svelte$/, '.entry.js'),
      loader: 'js',
    },
    bundle: true,
    outfile,
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    minify,
    sourcemap: false,
    write: true,
    plugins: [sveltePlugin(svelteConfig)],
    logLevel: 'silent',
  });
  writeFileSync(htmlPathFor(pageRel), buildHtml(pageRel, buildToken));
}

async function buildClient() {
  if (!existsSync(appCss)) throw new Error('missing svelte/app.css');
  if (!existsSync(rootPage)) throw new Error('missing svelte/index.svelte');
  if (!existsSync(rootEntry)) throw new Error('missing svelte/index.svelte.ts');
  const buildToken = String(Date.now());
  const pages = discoverPages();
  if (!pages.includes('index.svelte')) {
    throw new Error('missing root page index.svelte');
  }
  for (const pageRel of pages) {
    await bundlePage(pageRel, buildToken);
  }
}

async function runOnce() {
  try {
    await buildClient();
    console.log('built svelte pages and assets');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
}

async function runWatch() {
  await runOnce();
  const watcher = chokidar.watch(
    [appCss, faviconPath, rootEntry, rootPage, componentsDir, statesDir, helpersDir, layoutPath, svelteConfigPath, jsApiPath, appControllerPath, join(__dirname, 'build.js')],
    { ignoreInitial: true }
  );
  watcher.on('all', async () => {
    await runOnce();
  });
  if (serve) {
    const server = await startStaticServer(3900);
    process.on('SIGINT', () => {
      watcher.close();
      server?.close?.();
      process.exit(0);
    });
  }
}

async function runServeOnly() {
  await runOnce();
  const server = await startStaticServer(3900);
  process.on('SIGINT', () => {
    server?.close?.();
    process.exit(0);
  });
}

if (serveOnly) {
  await runServeOnly();
} else if (!watch) {
  await runOnce();
} else {
  await runWatch();
}
