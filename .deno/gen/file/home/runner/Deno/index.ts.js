import * as handler from "./api/handler.ts";
if (Deno.serve) {
    Deno.serve(handler.default);
} else {
    async function handleHttp(conn) {
        let lastE;
        try {
            for await (let e of Deno.serveHttp(conn)){
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
    for await (let conn of Deno.listen({
        port: 80
    })){
        try {
            handleHttp(conn);
        } catch (e) {
            continue;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBoYW5kbGVyIGZyb20gXCIuL2FwaS9oYW5kbGVyLnRzXCI7XG5cbmlmIChEZW5vLnNlcnZlKSB7XG4gIERlbm8uc2VydmUoaGFuZGxlci5kZWZhdWx0KTtcbn0gZWxzZSB7XG4gIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUh0dHAoY29ubjogRGVuby5Db25uKSB7XG4gICAgbGV0IGxhc3RFO1xuICAgIHRyeSB7XG4gICAgICBmb3IgYXdhaXQgKGxldCBlIG9mIERlbm8uc2VydmVIdHRwKGNvbm4pKSB7XG4gICAgICAgIGxhc3RFID0gZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBlLnJlc3BvbmRXaXRoKGhhbmRsZXIuZGVmYXVsdChlLnJlcXVlc3QpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxhc3RFLnJlc3BvbmRXaXRoKG5ldyBSZXNwb25zZShlcnIubWVzc2FnZSkpO1xuICAgIH1cbiAgfVxuXG4gIGZvciBhd2FpdCAobGV0IGNvbm4gb2YgRGVuby5saXN0ZW4oeyBwb3J0OiA4MCB9KSkge1xuICAgIHRyeSB7XG4gICAgICBoYW5kbGVIdHRwKGNvbm4pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksYUFBYSxtQkFBbUI7QUFFNUMsSUFBSSxLQUFLLE9BQU87SUFDZCxLQUFLLE1BQU0sUUFBUTtBQUNyQixPQUFPO0lBQ0wsZUFBZSxXQUFXLElBQWU7UUFDdkMsSUFBSTtRQUNKLElBQUk7WUFDRixXQUFXLElBQUksS0FBSyxLQUFLLFVBQVUsTUFBTztnQkFDeEMsUUFBUTtnQkFDUixJQUFJO29CQUNGLEVBQUUsWUFBWSxRQUFRLFFBQVEsRUFBRTtnQkFDbEMsRUFBRSxPQUFPLEtBQUs7b0JBQ1o7Z0JBQ0Y7WUFDRjtRQUNGLEVBQUUsT0FBTyxLQUFLO1lBQ1osTUFBTSxZQUFZLElBQUksU0FBUyxJQUFJO1FBQ3JDO0lBQ0Y7SUFFQSxXQUFXLElBQUksUUFBUSxLQUFLLE9BQU87UUFBRSxNQUFNO0lBQUcsR0FBSTtRQUNoRCxJQUFJO1lBQ0YsV0FBVztRQUNiLEVBQUUsT0FBTyxHQUFHO1lBQ1Y7UUFDRjtJQUNGO0FBQ0YifQ==