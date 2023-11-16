import './link-resolver.js';
import './text-rewriter.js';
import './dino.css.js';
import './dino.js';
import './host-bridge.js';
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
let injects = globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + globalThis.dino + globalThis['host-bridge'];
export default async function(req) {
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
    request = addCacheHeaders(request);
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
            body = (await res.text()).replace('<head>', '<head>' + headText).replace('</head>', headText + '</head>');
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
        response.headers.set('Content-Type', 'text/javascript');
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
    response = addCacheHeaders(response);
    return response;
}
function addCacheHeaders(re) {
    re.headers.set("CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Cloudflare-CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Surrogate-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    re.headers.set("Vercel-CDN-Cache-Control", "public, max-age=96400, s-max-age=96400, stale-if-error=31535000, stale-while-revalidate=31535000");
    return re;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xuaW1wb3J0ICcuL2hvc3QtYnJpZGdlLmpzJztcbmxldCBob3N0VGFyZ2V0ID0gXCJkZW5vLmxhbmRcIjtcbmxldCBkb2NzVGFyZ2V0ID0gXCJkb2NzLmRlbm8uY29tXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbJ3gtZm9yd2FyZGVkLWZvciddO1xuY29uc3Qgc2tpcFJlc3BvbnNlSGVhZGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29ubmVjdGlvblwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250ZW50LWxlbmd0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1mcmFtZS1vcHRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtY29udGVudC10eXBlLW9wdGlvbnMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxubGV0IGluamVjdHMgPSBnbG9iYWxUaGlzWydsaW5rLXJlc29sdmVyLWltcG9ydCddK1xuICBnbG9iYWxUaGlzWyd0ZXh0LXJld3JpdGVyJ10rXG4gIGdsb2JhbFRoaXMuZGlub0NTUysgXG4gIGdsb2JhbFRoaXMuZGlubytcbiAgZ2xvYmFsVGhpc1snaG9zdC1icmlkZ2UnXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuXG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgcmVxVVJMID0gcmVxLnVybC5yZXBsYWNlKCdfcm9vdC8nLCcnKS5yZXBsYWNlKCdfcm9vdCcsJycpO1xuICBsZXQgdXJsPXJlcVVSTC5zcGxpdCgnLycpO1xuICBsZXQgZmxhdFVSTCA9IHJlcVVSTC5zcGxpdCgnPycpWzBdLnNwbGl0KCcjJylbMF07XG4gIGxldCBsb2NhbGhvc3QgPSB1cmxbMl07XG4gIHVybFsyXSA9IGhvc3RUYXJnZXQ7XG4gIGlmKHJlcVVSTC5pbmNsdWRlcygnaG9zdG5hbWU9Jykpe1xuICAgIHVybFsyXT1yZXFVUkwuc3BsaXQoJ2hvc3RuYW1lPScpWzFdLnNwbGl0KCcmJylbMF0uc3BsaXQoJyMnKVswXTtcbiAgfVxuICBpZihyZXFVUkwuaW5jbHVkZXMoJy9tYW51YWwnKSl7XG4gICAgdXJsWzJdPWRvY3NUYXJnZXQ7XG4gIH1cbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmVxdWVzdCA9IGFkZENhY2hlSGVhZGVycyhyZXF1ZXN0KTtcbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gIGxldCBib2R5ID0gXCJcIjtcbiAgbGV0IGh0bWxGbGFnID0gZmFsc2U7XG4gIGlmKCghcmVzLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSl8fCghcmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkpe1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgICBodG1sRmxhZz10cnVlO1xuICB9IFxuIGVsc2V7XG4gICBsZXQgY3Q9cmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKS50b0xvd2VyQ2FzZSgpO1xuICAgLy9jb25zb2xlLmxvZyhjdCk7XG4gICBpZihjdC5pbmNsdWRlcygndGV4dCcpKXtcbiAgICAgIGxldCBoZWFkVGV4dD1pbmplY3RzO1xuICAgICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSlcbiAgICAgICAgLnJlcGxhY2UoJzxoZWFkPicsJzxoZWFkPicraGVhZFRleHQpXG4gICAgICAgIC5yZXBsYWNlKCc8L2hlYWQ+JyxoZWFkVGV4dCsnPC9oZWFkPicpO1xuICAgICAgaWYoYm9keS5pbmNsdWRlcygnPGh0bWwnKXx8Y3QuaW5jbHVkZXMoJ3BsYWluJykpe2h0bWxGbGFnPXRydWU7fVxuICAgIH1cbiBlbHNlIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlQWxsKGhvc3RUYXJnZXQsbG9jYWxob3N0KTtcbiAgfVxuICBlbHNlIGlmIChyZXMuYm9keSkge1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgfVxufVxuICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXNwb25zZS5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlc3BvbnNlSGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGhvc3RUYXJnZXQsIGxvY2FsaG9zdCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmKGh0bWxGbGFnKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoIXJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdwbGFpbicpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuY3NzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2NzcycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5zdmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcucG5nJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9wbmcnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanBnJyl8fGZsYXRVUkwuZW5kc1dpdGgoJy5qcGVnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9qcGVnJyk7XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpO1xuICByZXNwb25zZSA9IGFkZENhY2hlSGVhZGVycyhyZXNwb25zZSk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cblxuXG5mdW5jdGlvbiBhZGRDYWNoZUhlYWRlcnMocmUpe1xuICByZS5oZWFkZXJzLnNldChcIkNETi1DYWNoZS1Db250cm9sXCIsXG4gICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuICk7XG4gIHJlLmhlYWRlcnMuc2V0KFwiQ2FjaGUtQ29udHJvbFwiLFxuICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmUuaGVhZGVycy5zZXQoIFwiQ2xvdWRmbGFyZS1DRE4tQ2FjaGUtQ29udHJvbFwiLFxuICAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbik7XG4gIHJlLmhlYWRlcnMuc2V0KFwiU3Vycm9nYXRlLUNvbnRyb2xcIixcbiAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbik7XG4gIHJlLmhlYWRlcnMuc2V0KFwiVmVyY2VsLUNETi1DYWNoZS1Db250cm9sXCIsXG4gICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4pO1xuICByZXR1cm4gcmU7XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sWUFBWTtBQUNuQixPQUFPLG1CQUFtQjtBQUMxQixJQUFJLGFBQWE7QUFDakIsSUFBSSxhQUFhO0FBRWpCLE1BQU0scUJBQStCO0lBQUM7Q0FBa0I7QUFDeEQsTUFBTSxzQkFBc0I7SUFDRTtJQUNEO0lBQ0E7SUFDQTtDQUNBO0FBRTdCLElBQUksVUFBVSxVQUFVLENBQUMsdUJBQXVCLEdBQzlDLFVBQVUsQ0FBQyxnQkFBZ0IsR0FDM0IsV0FBVyxVQUNYLFdBQVcsT0FDWCxVQUFVLENBQUMsY0FBYztBQUUzQixlQUFlLGVBQWdCLEdBQVk7SUFFekMsSUFBSSxBQUFDLElBQUksVUFBVSxhQUFhLElBQUksT0FBSyxLQUFNO1FBQzdDLE9BQU8sSUFBSSxTQUFTLElBQUc7WUFBQyxTQUFRO2dCQUFDLE9BQU87WUFBMEI7UUFBQztJQUNyRTtJQUNBLElBQUksU0FBUyxJQUFJLElBQUksUUFBUSxVQUFTLElBQUksUUFBUSxTQUFRO0lBQzFELElBQUks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