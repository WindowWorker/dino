

async function handleHttp(conn: Deno.Conn) {
  for await (const e of Deno.serveHttp(conn)) {
    e.respondWith(new Response(e.request.url));
  }
}

for await (const conn of Deno.listen({ port: 80 })) {
  handleHttp(conn);
}