import './link-resolver.js';
import './text-rewriter.js';
let hostTarget = "deno.land";
const skipRequestHeaders = [
    'x-forwarded-for'
];
const skipResponseHeaders = [
    "connection",
    "content-length",
    'x-frame-options',
    'x-content-type-options'
];
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
    let flatURL = req.url.split('?')[0].split('#')[0];
    let localhost = url[2];
    url[2] = hostTarget;
    let request = new Request(url.join("/"));
    for(let header in request.headers.keys){
        if (header) {
            if (skipRequestHeaders.includes(header.toLowerCase())) {
                continue;
            }
            request.headers.set(header, request.headers.get(header).toString().replace(localhost, hostTarget));
        }
    }
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
        console.log(String.fromCharCode(...array));
        htmlFlag = true;
    } else {
        let ct = res.headers.get('content-type').toLowerCase();
        console.log(ct);
        if (ct.includes('html')) {
            body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + globalThis['text-rewriter'] + '</head>');
        } else if (ct.includes('text')) {
            body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + globalThis['text-rewriter'] + '</head>');
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
            console.log(String.fromCharCode(...array));
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
    if (flatURL.endsWith('.svg')) {
        response.headers.set('Content-Type', 'image/svg+xml');
    }
    if (flatURL.endsWith('.png')) {
        response.headers.set('Content-Type', 'image/png');
    }
    if (flatURL.endsWith('.jpg') || flatURL.endsWith('.jpeg')) {
        response.headers.set('Content-Type', 'image/jpeg');
    }
    console.log(response.headers.get('content-type'));
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5sZXQgaG9zdFRhcmdldCA9IFwiZGVuby5sYW5kXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbJ3gtZm9yd2FyZGVkLWZvciddO1xuY29uc3Qgc2tpcFJlc3BvbnNlSGVhZGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29ubmVjdGlvblwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250ZW50LWxlbmd0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1mcmFtZS1vcHRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtY29udGVudC10eXBlLW9wdGlvbnMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuXG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgcmVxVVJMID0gcmVxLnVybC5yZXBsYWNlKCdfcm9vdC8nLCcnKS5yZXBsYWNlKCdfcm9vdCcsJycpO1xuICBsZXQgdXJsPXJlcVVSTC5zcGxpdCgnLycpO1xuICBsZXQgZmxhdFVSTCA9IHJlcS51cmwuc3BsaXQoJz8nKVswXS5zcGxpdCgnIycpWzBdO1xuICBsZXQgbG9jYWxob3N0ID0gdXJsWzJdO1xuICB1cmxbMl0gPSBob3N0VGFyZ2V0O1xuICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybC5qb2luKFwiL1wiKSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXF1ZXN0LmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVxdWVzdEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGxvY2FsaG9zdCwgaG9zdFRhcmdldCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBsZXQgcmVzID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG5cbiAgbGV0IGJvZHkgPSBcIlwiO1xuICBsZXQgaHRtbEZsYWcgPSBmYWxzZTtcbiAgaWYoKCFyZXMuaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKXx8KCFyZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSl7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIGNvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgICBodG1sRmxhZz10cnVlO1xuICB9IFxuIGVsc2V7XG4gICBsZXQgY3Q9cmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKS50b0xvd2VyQ2FzZSgpO1xuICAgY29uc29sZS5sb2coY3QpO1xuICAgaWYoY3QuaW5jbHVkZXMoJ2h0bWwnKSl7XG4gICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlKCc8L2hlYWQ+JyxnbG9iYWxUaGlzWydsaW5rLXJlc29sdmVyLWltcG9ydCddK2dsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXSsnPC9oZWFkPicpO1xuIH1cbiBlbHNlIGlmKGN0LmluY2x1ZGVzKCd0ZXh0Jykpe1xuICAgICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZSgnPC9oZWFkPicsZ2xvYmFsVGhpc1snbGluay1yZXNvbHZlci1pbXBvcnQnXStnbG9iYWxUaGlzWyd0ZXh0LXJld3JpdGVyJ10rJzwvaGVhZD4nKTtcbiAgICAgIGlmKGJvZHkuaW5jbHVkZXMoJzxodG1sJyl8fGN0LmluY2x1ZGVzKCdwbGFpbicpKXtodG1sRmxhZz10cnVlO31cbiAgICB9XG4gZWxzZSBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZUFsbChob3N0VGFyZ2V0LGxvY2FsaG9zdCk7XG4gIH1cbiAgZWxzZSBpZiAocmVzLmJvZHkpIHtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJvZHkpO1xuICAgIGxldCBhcnJheSA9IFsuLi50eXBlZEFycmF5XTtcbiAgICBhcnJheS5sZW5ndGg9NTA7XG4gICAgY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICB9XG59XG4gIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5KTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlc3BvbnNlLmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVzcG9uc2VIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UoaG9zdFRhcmdldCwgbG9jYWxob3N0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYoaHRtbEZsYWcpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZighcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYocmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3BsYWluJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvamF2YXNjcmlwdCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5zdmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcucG5nJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9wbmcnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanBnJyl8fGZsYXRVUkwuZW5kc1dpdGgoJy5qcGVnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9qcGVnJyk7XG4gIH1cbiAgY29uc29sZS5sb2cocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKTtcbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3Mi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