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
                body = (await res.text()).replaceAll("delete globalThis.Prism", "true").replaceAll('.hasAttribute(', '?.hasAttribute?.(').replace('<head>', '<head>' + headText).replace('</head>', headText + '</head>');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xuaW1wb3J0ICcuL2hvc3QtYnJpZGdlLmpzJztcbmltcG9ydCAnLi9oaWdobGlnaHQuanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xubGV0IGRvY3NUYXJnZXQgPSBcImRvY3MuZGVuby5jb21cIjtcblxuY29uc3Qgc2tpcFJlcXVlc3RIZWFkZXJzOiBzdHJpbmdbXSA9IFsneC1mb3J3YXJkZWQtZm9yJ107XG5jb25zdCBza2lwUmVzcG9uc2VIZWFkZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25uZWN0aW9uXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnQtbGVuZ3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWZyYW1lLW9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1jb250ZW50LXR5cGUtb3B0aW9ucydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5sZXQgaW5qZWN0cyA9IGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rXG4gIGdsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXStcbiAgZ2xvYmFsVGhpcy5kaW5vQ1NTKyBcbiAgZ2xvYmFsVGhpcy5kaW5vK1xuICBnbG9iYWxUaGlzWydob3N0LWJyaWRnZSddK1xuICBnbG9iYWxUaGlzLmhpZ2hsaWdodDtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuICB0cnl7XG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgcmVxVVJMID0gcmVxLnVybC5yZXBsYWNlKCdfcm9vdC8nLCcnKS5yZXBsYWNlKCdfcm9vdCcsJycpO1xuICBsZXQgdXJsPXJlcVVSTC5zcGxpdCgnLycpO1xuICBsZXQgZmxhdFVSTCA9IHJlcVVSTC5zcGxpdCgnPycpWzBdLnNwbGl0KCcjJylbMF07XG4gIGxldCBsb2NhbGhvc3QgPSB1cmxbMl07XG4gIHVybFsyXSA9IGhvc3RUYXJnZXQ7XG4gIGlmKHJlcVVSTC5pbmNsdWRlcygnaG9zdG5hbWU9Jykpe1xuICAgIHVybFsyXT1yZXFVUkwuc3BsaXQoJ2hvc3RuYW1lPScpWzFdLnNwbGl0KCcmJylbMF0uc3BsaXQoJyMnKVswXTtcbiAgfVxuICBpZihyZXFVUkwuaW5jbHVkZXMoJy9tYW51YWwnKSl7XG4gICAgdXJsWzJdPWRvY3NUYXJnZXQ7XG4gIH1cbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgLy9yZXF1ZXN0ID0gYWRkQ2FjaGVIZWFkZXJzKHJlcXVlc3QpO1xuICBsZXQgcmVzID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG5cbiAgbGV0IGJvZHkgPSBcIlwiO1xuICBsZXQgaHRtbEZsYWcgPSBmYWxzZTtcbiAgaWYoKCFyZXMuaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKXx8KCFyZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSl7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIC8vY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICAgIGh0bWxGbGFnPXRydWU7XG4gIH0gXG4gZWxzZXtcbiAgIGxldCBjdD1yZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpLnRvTG93ZXJDYXNlKCk7XG4gICAvL2NvbnNvbGUubG9nKGN0KTtcbiAgIGlmKGN0LmluY2x1ZGVzKCd0ZXh0Jykpe1xuICAgICAgbGV0IGhlYWRUZXh0PWluamVjdHM7XG4gICAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKVxuICAgICAgICAucmVwbGFjZUFsbChcImRlbGV0ZSBnbG9iYWxUaGlzLlByaXNtXCIsXCJ0cnVlXCIpXG4gICAgICAgIC5yZXBsYWNlQWxsKCcuaGFzQXR0cmlidXRlKCcsJz8uaGFzQXR0cmlidXRlPy4oJylcbiAgICAgICAgLnJlcGxhY2UoJzxoZWFkPicsJzxoZWFkPicraGVhZFRleHQpXG4gICAgICAgIC5yZXBsYWNlKCc8L2hlYWQ+JyxoZWFkVGV4dCsnPC9oZWFkPicpO1xuICAgICAgaWYoYm9keS5pbmNsdWRlcygnPGh0bWwnKXx8Y3QuaW5jbHVkZXMoJ3BsYWluJykpe2h0bWxGbGFnPXRydWU7fVxuICAgIH1cbiBlbHNlIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlQWxsKGhvc3RUYXJnZXQsbG9jYWxob3N0KTtcbiAgfVxuICBlbHNlIGlmIChyZXMuYm9keSkge1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgfVxufVxuICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXNwb25zZS5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlc3BvbnNlSGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGhvc3RUYXJnZXQsIGxvY2FsaG9zdCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmKGh0bWxGbGFnKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoIXJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdwbGFpbicpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2phdmFzY3JpcHQ7IGNoYXJzZXQ9dXRmLTgnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuY3NzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2NzcycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5zdmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcucG5nJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9wbmcnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanBnJyl8fGZsYXRVUkwuZW5kc1dpdGgoJy5qcGVnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9qcGVnJyk7XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpO1xuICAvL3Jlc3BvbnNlID0gYWRkQ2FjaGVIZWFkZXJzKHJlc3BvbnNlKTtcbiAgcmV0dXJuIHJlc3BvbnNlO1xuICB9Y2F0Y2goZSl7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSgnRXJyb3I6ICcrZSx7c3RhdHVzOjUwMH0pO1xuICB9XG59XG5cblxuZnVuY3Rpb24gYWRkQ2FjaGVIZWFkZXJzKHJlKXtcbiAgcmUuaGVhZGVycy5zZXQoXCJDRE4tQ2FjaGUtQ29udHJvbFwiLFxuICAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbiApO1xuICByZS5oZWFkZXJzLnNldChcIkNhY2hlLUNvbnRyb2xcIixcbiAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbik7XG4gIHJlLmhlYWRlcnMuc2V0KCBcIkNsb3VkZmxhcmUtQ0ROLUNhY2hlLUNvbnRyb2xcIixcbiAgICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4pO1xuICByZS5oZWFkZXJzLnNldChcIlN1cnJvZ2F0ZS1Db250cm9sXCIsXG4gICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4pO1xuICByZS5oZWFkZXJzLnNldChcIlZlcmNlbC1DRE4tQ2FjaGUtQ29udHJvbFwiLFxuICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmV0dXJuIHJlO1xufSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFCQUFxQjtBQUM1QixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxpQkFBaUI7QUFDeEIsSUFBSSxhQUFhO0FBQ2pCLElBQUksYUFBYTtBQUVqQixNQUFNLHFCQUErQjtJQUFDO0NBQWtCO0FBQ3hELE1BQU0sc0JBQXNCO0lBQ0U7SUFDRDtJ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