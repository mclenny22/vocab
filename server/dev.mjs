import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { createTopicsHandler } from './topics.mjs';

const root = fileURLToPath(new URL('../vocabulary-app/dist/', import.meta.url));
const handle = createTopicsHandler();
const types = { '.html': 'text/html', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const port = Number(process.env.PORT || 4173);
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/api/topics') {
      const controller = new AbortController();
      response.on('close', () => { if (!response.writableEnded) controller.abort(); });
      const webRequest = new Request(url, { method: request.method, headers: request.headers,
        ...(request.method !== 'GET' && request.method !== 'HEAD' ? { body: Readable.toWeb(request), duplex: 'half' } : {}), signal: controller.signal });
      const result = await handle(webRequest);
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(Buffer.from(await result.arrayBuffer()));
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(url.pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root.endsWith(sep) ? root : `${root}${sep}`) || !types[extname(file)]) { response.writeHead(404).end('Not found'); return; }
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': `${types[extname(file)]}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Permissions-Policy': 'microphone=(self)' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (!response.headersSent) response.writeHead(error?.code === 'ENOENT' ? 404 : 500);
    response.end('Request could not be completed.');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Vocab is running at http://127.0.0.1:${port}`);
  console.log(`Topic practice: ${process.env.OPENAI_API_KEY?.trim() ? 'API key configured' : 'add OPENAI_API_KEY to .env'}`);
});
