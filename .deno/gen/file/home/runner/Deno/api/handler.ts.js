import './link-resolver.js';
import './text-rewriter.js';
import './dino.css.js';
import './dino.js';
import './host-bridge.js';
import './highlight.js';
let hostTarget = "deno.land";
let docsTarget = "docs.deno.com";
const skipRequestHeaders = [
    'x-forwarded-for'
];
const skipResponseHeaders = [
    "connection",
    "content-length",
    'x-frame-options',
    'x-content-type-options'
];
let injects = globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + globalThis.dino + globalThis['host-bridge'] + globalThis.highlight;
export default async function(req) {
    try {
        if (req.method == "OPTIONS" || req.url == '*') {
            return new Response("", {
                headers: {
                    Allow: "OPTIONS, GET, HEAD, POST"
                }
            });
        }
        let reqURL = req.url.replace('_root/', '').replace('_root', '');
        let url = reqURL.split('/');
        let flatURL = reqURL.split('?')[0].split('#')[0];
        let localhost = url[2];
        url[2] = hostTarget;
        if (reqURL.includes('hostname=')) {
            url[2] = reqURL.split('hostname=')[1].split('&')[0].split('#')[0];
        }
        if (reqURL.includes('/manual')) {
            url[2] = docsTarget;
        }
        let request = new Request(url.join("/"));
        for(let header in request.headers.keys){
            if (header) {
                if (skipRequestHeaders.includes(header.toLowerCase())) {
                    continue;
                }
                request.headers.set(header, request.headers.get(header).toString().replace(localhost, hostTarget));
            }
        }
        //request = addCacheHeaders(request);
        let res = await fetch(request);
        let body = "";
        let htmlFlag = false;
        if (!res.headers.has('Content-Type') || !res.headers.get('content-type')) {
            body = await res.arrayBuffer();
            const typedArray = new Uint8Array(body);
            let array = [
                ...typedArray
            ];
            array.length = 50;
            //console.log(String.fromCharCode(...array));
            htmlFlag = true;
        } else {
            let ct = res.headers.get('content-type').toLowerCase();
            //console.log(ct);
            if (ct.includes('text')) {
                let headText = injects;
                body = (await res.text()).replaceAll("delete globalThis.Prism", "true").replace('<head>', '<head>' + headText).replace('</head>', headText + '</head>');
                if (body.includes('<html') || ct.includes('plain')) {
                    htmlFlag = true;
                }
            } else if (flatURL.endsWith('.js')) {
                body = (await res.text()).replaceAll(hostTarget, localhost);
            } else if (res.body) {
                body = await res.arrayBuffer();
                const typedArray = new Uint8Array(body);
                let array = [
                    ...typedArray
                ];
                array.length = 50;
            //console.log(String.fromCharCode(...array));
            }
        }
        let response = new Response(body);
        for(let header in response.headers.keys){
            if (header) {
                if (skipResponseHeaders.includes(header.toLowerCase())) {
                    continue;
                }
                request.headers.set(header, response.headers.get(header).toString().replace(hostTarget, localhost));
            }
        }
        if (htmlFlag) {
            response.headers.set('Content-Type', 'text/html');
        }
        if (!response.headers.get('Content-Type')) {
            response.headers.set('Content-Type', 'text/html');
        }
        if (response.headers.get('Content-Type').toLowerCase().includes('plain')) {
            response.headers.set('Content-Type', 'text/html');
        }
        if (flatURL.endsWith('.js')) {
            response.headers.set('Content-Type', 'text/javascript; charset=utf-8');
        }
        if (flatURL.endsWith('.css')) {
            response.headers.set('Content-Type', 'text/css');
        }
        if (flatURL.endsWith('.svg')) {
            response.headers.set('Content-Type', 'image/svg+xml');
        }
        if (flatURL.endsWith('.png')) {
            response.headers.set('Content-Type', 'image/png');
        }
        if (flatURL.endsWith('.jpg') || flatURL.endsWith('.jpeg')) {
            response.headers.set('Content-Type', 'image/jpeg');
        }
        //console.log(response.headers.get('content-type'));
        //response = addCacheHeaders(response);
        return response;
    } catch (e) {
        console.log(e);
        return new Response('Error: ' + e, {
            status: 500
        });
    }
}
function addCacheHeaders(re) {
    re.headers.set("CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Cloudflare-CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Surrogate-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Vercel-CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    return re;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xuaW1wb3J0ICcuL2hvc3QtYnJpZGdlLmpzJztcbmltcG9ydCAnLi9oaWdobGlnaHQuanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xubGV0IGRvY3NUYXJnZXQgPSBcImRvY3MuZGVuby5jb21cIjtcblxuY29uc3Qgc2tpcFJlcXVlc3RIZWFkZXJzOiBzdHJpbmdbXSA9IFsneC1mb3J3YXJkZWQtZm9yJ107XG5jb25zdCBza2lwUmVzcG9uc2VIZWFkZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25uZWN0aW9uXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnQtbGVuZ3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWZyYW1lLW9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1jb250ZW50LXR5cGUtb3B0aW9ucydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5sZXQgaW5qZWN0cyA9IGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rXG4gIGdsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXStcbiAgZ2xvYmFsVGhpcy5kaW5vQ1NTKyBcbiAgZ2xvYmFsVGhpcy5kaW5vK1xuICBnbG9iYWxUaGlzWydob3N0LWJyaWRnZSddK1xuICBnbG9iYWxUaGlzLmhpZ2hsaWdodDtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuICB0cnl7XG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgcmVxVVJMID0gcmVxLnVybC5yZXBsYWNlKCdfcm9vdC8nLCcnKS5yZXBsYWNlKCdfcm9vdCcsJycpO1xuICBsZXQgdXJsPXJlcVVSTC5zcGxpdCgnLycpO1xuICBsZXQgZmxhdFVSTCA9IHJlcVVSTC5zcGxpdCgnPycpWzBdLnNwbGl0KCcjJylbMF07XG4gIGxldCBsb2NhbGhvc3QgPSB1cmxbMl07XG4gIHVybFsyXSA9IGhvc3RUYXJnZXQ7XG4gIGlmKHJlcVVSTC5pbmNsdWRlcygnaG9zdG5hbWU9Jykpe1xuICAgIHVybFsyXT1yZXFVUkwuc3BsaXQoJ2hvc3RuYW1lPScpWzFdLnNwbGl0KCcmJylbMF0uc3BsaXQoJyMnKVswXTtcbiAgfVxuICBpZihyZXFVUkwuaW5jbHVkZXMoJy9tYW51YWwnKSl7XG4gICAgdXJsWzJdPWRvY3NUYXJnZXQ7XG4gIH1cbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy9yZXF1ZXN0ID0gYWRkQ2FjaGVIZWFkZXJzKHJlcXVlc3QpO1xuICBsZXQgcmVzID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG5cbiAgbGV0IGJvZHkgPSBcIlwiO1xuICBsZXQgaHRtbEZsYWcgPSBmYWxzZTtcbiAgaWYoKCFyZXMuaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKXx8KCFyZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSl7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIC8vY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICAgIGh0bWxGbGFnPXRydWU7XG4gIH0gXG4gZWxzZXtcbiAgIGxldCBjdD1yZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpLnRvTG93ZXJDYXNlKCk7XG4gICAvL2NvbnNvbGUubG9nKGN0KTtcbiAgIGlmKGN0LmluY2x1ZGVzKCd0ZXh0Jykpe1xuICAgICAgbGV0IGhlYWRUZXh0PWluamVjdHM7XG4gICAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKVxuICAgICAgICAucmVwbGFjZUFsbChcImRlbGV0ZSBnbG9iYWxUaGlzLlByaXNtXCIsXCJ0cnVlXCIpXG4gICAgICAgIC5yZXBsYWNlKCc8aGVhZD4nLCc8aGVhZD4nK2hlYWRUZXh0KVxuICAgICAgICAucmVwbGFjZSgnPC9oZWFkPicsaGVhZFRleHQrJzwvaGVhZD4nKTtcbiAgICAgIGlmKGJvZHkuaW5jbHVkZXMoJzxodG1sJyl8fGN0LmluY2x1ZGVzKCdwbGFpbicpKXtodG1sRmxhZz10cnVlO31cbiAgICB9XG4gZWxzZSBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZUFsbChob3N0VGFyZ2V0LGxvY2FsaG9zdCk7XG4gIH1cbiAgZWxzZSBpZiAocmVzLmJvZHkpIHtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJvZHkpO1xuICAgIGxldCBhcnJheSA9IFsuLi50eXBlZEFycmF5XTtcbiAgICBhcnJheS5sZW5ndGg9NTA7XG4gICAgLy9jb25zb2xlLmxvZyhTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5KSk7XG4gIH1cbn1cbiAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHkpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVzcG9uc2UuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXNwb25zZUhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShob3N0VGFyZ2V0LCBsb2NhbGhvc3QpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZihodG1sRmxhZyl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKCFyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygncGxhaW4nKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9qYXZhc2NyaXB0OyBjaGFyc2V0PXV0Zi04Jyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmNzcycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9jc3MnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuc3ZnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9zdmcreG1sJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLnBuZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2UvcG5nJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpwZycpfHxmbGF0VVJMLmVuZHNXaXRoKCcuanBlZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2UvanBlZycpO1xuICB9XG4gIC8vY29uc29sZS5sb2cocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKTtcbiAgLy9yZXNwb25zZSA9IGFkZENhY2hlSGVhZGVycyhyZXNwb25zZSk7XG4gIHJldHVybiByZXNwb25zZTtcbiAgfWNhdGNoKGUpe1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoJ0Vycm9yOiAnK2Use3N0YXR1czo1MDB9KTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGFkZENhY2hlSGVhZGVycyhyZSl7XG4gIHJlLmhlYWRlcnMuc2V0KFwiQ0ROLUNhY2hlLUNvbnRyb2xcIixcbiAgICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4gKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJDYWNoZS1Db250cm9sXCIsXG4gICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4pO1xuICByZS5oZWFkZXJzLnNldCggXCJDbG91ZGZsYXJlLUNETi1DYWNoZS1Db250cm9sXCIsXG4gICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJTdXJyb2dhdGUtQ29udHJvbFwiLFxuICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJWZXJjZWwtQ0ROLUNhY2hlLUNvbnRyb2xcIixcbiAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbik7XG4gIHJldHVybiByZTtcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBQ3hCLElBQUksYUFBYTtBQUNqQixJQUFJLGFBQWE7QUFFakIsTUFBTSxxQkFBK0I7SUFBQztDQUFrQjtBQUN4RCxNQUFNLHNCQUFzQjtJQUNFO0lBQ0Q7SUFDQTtJQUNBO0NBQ0E7QUFFN0IsSUFBSSxVQUFVLFVBQVUsQ0FBQyx1QkFBdUIsR0FDOUMsVUFBVSxD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