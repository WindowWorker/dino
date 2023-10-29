import * as handler from "./api/handler.ts";

if (Deno.serve) {
  Deno.serve(handler.default);
} else {
  async function handleHttp(conn: Deno.Conn) {
    let lastE;
    try {
      for await (let e of Deno.serveHttp(conn)) {
        lastE = e;
        try {
          e.respondWith(handler.default(e.request));
        } catch (err) {
          continue;
        }
      }
    } catch (err) {
      lastE.respondWith(new Response(err.message));
    }
  }

  for await (let conn of Deno.listen({ port: 80 })) {
    try {
      handleHttp(conn);
    } catch (e) {
      continue;
    }
  }
}
