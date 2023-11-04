import './link-resolver.js';
import './text-rewriter.js';
import './dino.css.js';
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
    if (reqURL.includes('hostname=')) {
        url[2] = reqURL.split('hostname=')[1].split('&')[0].split('#')[0];
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
        if (ct.includes('html')) {
            body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + '</head>');
        } else if (ct.includes('text')) {
            body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + '</head>');
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
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xuXG5jb25zdCBza2lwUmVxdWVzdEhlYWRlcnM6IHN0cmluZ1tdID0gWyd4LWZvcndhcmRlZC1mb3InXTtcbmNvbnN0IHNraXBSZXNwb25zZUhlYWRlcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbm5lY3Rpb25cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGVudC1sZW5ndGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtZnJhbWUtb3B0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWNvbnRlbnQtdHlwZS1vcHRpb25zJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChyZXE6IFJlcXVlc3QpIHtcblxuICBpZiAoKHJlcS5tZXRob2QgPT0gXCJPUFRJT05TXCIpfHwocmVxLnVybD09JyonKSkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJcIix7aGVhZGVyczp7QWxsb3c6IFwiT1BUSU9OUywgR0VULCBIRUFELCBQT1NUXCJ9fSk7XG4gIH1cbiAgbGV0IHJlcVVSTCA9IHJlcS51cmwucmVwbGFjZSgnX3Jvb3QvJywnJykucmVwbGFjZSgnX3Jvb3QnLCcnKTtcbiAgbGV0IHVybD1yZXFVUkwuc3BsaXQoJy8nKTtcbiAgbGV0IGZsYXRVUkwgPSByZXFVUkwuc3BsaXQoJz8nKVswXS5zcGxpdCgnIycpWzBdO1xuICBsZXQgbG9jYWxob3N0ID0gdXJsWzJdO1xuICB1cmxbMl0gPSBob3N0VGFyZ2V0O1xuICBpZihyZXFVUkwuaW5jbHVkZXMoJ2hvc3RuYW1lPScpKXtcbiAgICB1cmxbMl09cmVxVVJMLnNwbGl0KCdob3N0bmFtZT0nKVsxXS5zcGxpdCgnJicpWzBdLnNwbGl0KCcjJylbMF07XG4gIH1cbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gIGxldCBib2R5ID0gXCJcIjtcbiAgbGV0IGh0bWxGbGFnID0gZmFsc2U7XG4gIGlmKCghcmVzLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSl8fCghcmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkpe1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgICBodG1sRmxhZz10cnVlO1xuICB9IFxuIGVsc2V7XG4gICBsZXQgY3Q9cmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKS50b0xvd2VyQ2FzZSgpO1xuICAgLy9jb25zb2xlLmxvZyhjdCk7XG4gICBpZihjdC5pbmNsdWRlcygnaHRtbCcpKXtcbiAgIGJvZHk9KGF3YWl0IHJlcy50ZXh0KCkpLnJlcGxhY2UoJzwvaGVhZD4nLGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rZ2xvYmFsVGhpc1sndGV4dC1yZXdyaXRlciddK2dsb2JhbFRoaXMuZGlub0NTUysnPC9oZWFkPicpO1xuIH1cbiBlbHNlIGlmKGN0LmluY2x1ZGVzKCd0ZXh0Jykpe1xuICAgICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZSgnPC9oZWFkPicsZ2xvYmFsVGhpc1snbGluay1yZXNvbHZlci1pbXBvcnQnXStnbG9iYWxUaGlzWyd0ZXh0LXJld3JpdGVyJ10rZ2xvYmFsVGhpcy5kaW5vQ1NTKyc8L2hlYWQ+Jyk7XG4gICAgICBpZihib2R5LmluY2x1ZGVzKCc8aHRtbCcpfHxjdC5pbmNsdWRlcygncGxhaW4nKSl7aHRtbEZsYWc9dHJ1ZTt9XG4gICAgfVxuIGVsc2UgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIGJvZHk9KGF3YWl0IHJlcy50ZXh0KCkpLnJlcGxhY2VBbGwoaG9zdFRhcmdldCxsb2NhbGhvc3QpO1xuICB9XG4gIGVsc2UgaWYgKHJlcy5ib2R5KSB7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIC8vY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICB9XG59XG4gIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5KTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlc3BvbnNlLmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVzcG9uc2VIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UoaG9zdFRhcmdldCwgbG9jYWxob3N0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYoaHRtbEZsYWcpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZighcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYocmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3BsYWluJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvamF2YXNjcmlwdCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5jc3MnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvY3NzJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLnN2ZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2Uvc3ZnK3htbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5wbmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3BuZycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcGcnKXx8ZmxhdFVSTC5lbmRzV2l0aCgnLmpwZWcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL2pwZWcnKTtcbiAgfVxuICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFCQUFxQjtBQUM1QixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGdCQUFnQjtBQUN2QixJQUFJLGFBQWE7QUFFakIsTUFBTSxxQkFBK0I7SUFBQztDQUFrQjtBQUN4RCxNQUFNLHNCQUFzQjtJQUNFO0lBQ0Q7SUFDQTtJQUNBO0NBQ0E7QUFFN0IsZUFBZSxlQUFnQixHQUFZO0lBRXpDLElBQUksQUFBQyxJQUFJLFVBQVUsYUFBYSxJQUFJLE9BQUssS0FBTTtRQUM3QyxPQUFPLElBQUksU0FBUyxJQUFHO1lBQUMsU0FBUTtnQkFBQyxPQUFPO1lBQTBCO1FBQUM7SUFDckU7SUFDQSxJQUFJLFNBQVMsSUFBSSxJQUFJLFFBQVEsVUFBUyxJQUFJLFFBQVEsU0FBUTtJQUMxRCxJQUFJLE1BQUksT0FBTyxNQUFNO0lBQ3JCLElBQUksVUFBVSxPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQ2hELElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtJQUN0QixHQUFHLENBQUMsRUFBRSxHQUFHO0lBQ1QsSUFBRyxPQUFPLFNBQVMsY0FBYTtRQUM5QixHQUFHLENBQUMsRUFBRSxHQUFDLE9BQU8sTUFBTSxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQ2pFO0lBQ0EsSUFBSSxVQUFVLElBQUks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