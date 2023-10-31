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
    let flatURL = reqURL.split('?')[0].split('#')[0];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5sZXQgaG9zdFRhcmdldCA9IFwiZGVuby5sYW5kXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbJ3gtZm9yd2FyZGVkLWZvciddO1xuY29uc3Qgc2tpcFJlc3BvbnNlSGVhZGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29ubmVjdGlvblwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250ZW50LWxlbmd0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1mcmFtZS1vcHRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtY29udGVudC10eXBlLW9wdGlvbnMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuXG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgcmVxVVJMID0gcmVxLnVybC5yZXBsYWNlKCdfcm9vdC8nLCcnKS5yZXBsYWNlKCdfcm9vdCcsJycpO1xuICBsZXQgdXJsPXJlcVVSTC5zcGxpdCgnLycpO1xuICBsZXQgZmxhdFVSTCA9IHJlcVVSTC5zcGxpdCgnPycpWzBdLnNwbGl0KCcjJylbMF07XG4gIGxldCBsb2NhbGhvc3QgPSB1cmxbMl07XG4gIHVybFsyXSA9IGhvc3RUYXJnZXQ7XG4gIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLmpvaW4oXCIvXCIpKTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlcXVlc3QuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXF1ZXN0SGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UobG9jYWxob3N0LCBob3N0VGFyZ2V0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIGxldCByZXMgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcblxuICBsZXQgYm9keSA9IFwiXCI7XG4gIGxldCBodG1sRmxhZyA9IGZhbHNlO1xuICBpZigoIXJlcy5oZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpfHwoIXJlcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpKXtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJvZHkpO1xuICAgIGxldCBhcnJheSA9IFsuLi50eXBlZEFycmF5XTtcbiAgICBhcnJheS5sZW5ndGg9NTA7XG4gICAgY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICAgIGh0bWxGbGFnPXRydWU7XG4gIH0gXG4gZWxzZXtcbiAgIGxldCBjdD1yZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpLnRvTG93ZXJDYXNlKCk7XG4gICBjb25zb2xlLmxvZyhjdCk7XG4gICBpZihjdC5pbmNsdWRlcygnaHRtbCcpKXtcbiAgIGJvZHk9KGF3YWl0IHJlcy50ZXh0KCkpLnJlcGxhY2UoJzwvaGVhZD4nLGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rZ2xvYmFsVGhpc1sndGV4dC1yZXdyaXRlciddKyc8L2hlYWQ+Jyk7XG4gfVxuIGVsc2UgaWYoY3QuaW5jbHVkZXMoJ3RleHQnKSl7XG4gICAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlKCc8L2hlYWQ+JyxnbG9iYWxUaGlzWydsaW5rLXJlc29sdmVyLWltcG9ydCddK2dsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXSsnPC9oZWFkPicpO1xuICAgICAgaWYoYm9keS5pbmNsdWRlcygnPGh0bWwnKXx8Y3QuaW5jbHVkZXMoJ3BsYWluJykpe2h0bWxGbGFnPXRydWU7fVxuICAgIH1cbiBlbHNlIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlQWxsKGhvc3RUYXJnZXQsbG9jYWxob3N0KTtcbiAgfVxuICBlbHNlIGlmIChyZXMuYm9keSkge1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICBjb25zb2xlLmxvZyhTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5KSk7XG4gIH1cbn1cbiAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHkpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVzcG9uc2UuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXNwb25zZUhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShob3N0VGFyZ2V0LCBsb2NhbGhvc3QpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZihodG1sRmxhZyl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKCFyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygncGxhaW4nKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9qYXZhc2NyaXB0Jyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLnN2ZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2Uvc3ZnK3htbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5wbmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3BuZycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcGcnKXx8ZmxhdFVSTC5lbmRzV2l0aCgnLmpwZWcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL2pwZWcnKTtcbiAgfVxuICBjb25zb2xlLmxvZyhyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpO1xuICByZXR1cm4gcmVzcG9uc2U7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6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