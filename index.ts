import * as handler from './api/handler.ts';

async function handleHttp(conn: Deno.Conn) {
  for await (const e of Deno.serveHttp(conn)) {
    e.respondWith(handler.default(e.request));
  }
}

for await (const conn of Deno.listen({ port: 80 })) {
  handleHttp(conn);
}