import './link-resolver.js';
import './text-rewriter.js';
import './dino.css.js';
import './dino.js';
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
let injects = globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + globalThis.dino;
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
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xubGV0IGRvY3NUYXJnZXQgPSBcImRvY3MuZGVuby5jb21cIjtcblxuY29uc3Qgc2tpcFJlcXVlc3RIZWFkZXJzOiBzdHJpbmdbXSA9IFsneC1mb3J3YXJkZWQtZm9yJ107XG5jb25zdCBza2lwUmVzcG9uc2VIZWFkZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25uZWN0aW9uXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnQtbGVuZ3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWZyYW1lLW9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1jb250ZW50LXR5cGUtb3B0aW9ucydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5sZXQgaW5qZWN0cyA9IGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rXG4gIGdsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXStcbiAgZ2xvYmFsVGhpcy5kaW5vQ1NTKyBcbiAgZ2xvYmFsVGhpcy5kaW5vO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocmVxOiBSZXF1ZXN0KSB7XG5cbiAgaWYgKChyZXEubWV0aG9kID09IFwiT1BUSU9OU1wiKXx8KHJlcS51cmw9PScqJykpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiXCIse2hlYWRlcnM6e0FsbG93OiBcIk9QVElPTlMsIEdFVCwgSEVBRCwgUE9TVFwifX0pO1xuICB9XG4gIGxldCByZXFVUkwgPSByZXEudXJsLnJlcGxhY2UoJ19yb290LycsJycpLnJlcGxhY2UoJ19yb290JywnJyk7XG4gIGxldCB1cmw9cmVxVVJMLnNwbGl0KCcvJyk7XG4gIGxldCBmbGF0VVJMID0gcmVxVVJMLnNwbGl0KCc/JylbMF0uc3BsaXQoJyMnKVswXTtcbiAgbGV0IGxvY2FsaG9zdCA9IHVybFsyXTtcbiAgdXJsWzJdID0gaG9zdFRhcmdldDtcbiAgaWYocmVxVVJMLmluY2x1ZGVzKCdob3N0bmFtZT0nKSl7XG4gICAgdXJsWzJdPXJlcVVSTC5zcGxpdCgnaG9zdG5hbWU9JylbMV0uc3BsaXQoJyYnKVswXS5zcGxpdCgnIycpWzBdO1xuICB9XG4gIGlmKHJlcVVSTC5pbmNsdWRlcygnL21hbnVhbCcpKXtcbiAgICB1cmxbMl09ZG9jc1RhcmdldDtcbiAgfVxuICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybC5qb2luKFwiL1wiKSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXF1ZXN0LmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVxdWVzdEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGxvY2FsaG9zdCwgaG9zdFRhcmdldCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBsZXQgcmVzID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG5cbiAgbGV0IGJvZHkgPSBcIlwiO1xuICBsZXQgaHRtbEZsYWcgPSBmYWxzZTtcbiAgaWYoKCFyZXMuaGVhZGVycy5oYXMoJ0NvbnRlbnQtVHlwZScpKXx8KCFyZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSl7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIC8vY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICAgIGh0bWxGbGFnPXRydWU7XG4gIH0gXG4gZWxzZXtcbiAgIGxldCBjdD1yZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpLnRvTG93ZXJDYXNlKCk7XG4gICAvL2NvbnNvbGUubG9nKGN0KTtcbiAgIGlmKGN0LmluY2x1ZGVzKCd0ZXh0Jykpe1xuICAgICAgbGV0IGhlYWRUZXh0PWluamVjdHM7XG4gICAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKVxuICAgICAgICAucmVwbGFjZSgnPGhlYWQ+JywnPGhlYWQ+JytoZWFkVGV4dClcbiAgICAgICAgLnJlcGxhY2UoJzwvaGVhZD4nLGhlYWRUZXh0Kyc8L2hlYWQ+Jyk7XG4gICAgICBpZihib2R5LmluY2x1ZGVzKCc8aHRtbCcpfHxjdC5pbmNsdWRlcygncGxhaW4nKSl7aHRtbEZsYWc9dHJ1ZTt9XG4gICAgfVxuIGVsc2UgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIGJvZHk9KGF3YWl0IHJlcy50ZXh0KCkpLnJlcGxhY2VBbGwoaG9zdFRhcmdldCxsb2NhbGhvc3QpO1xuICB9XG4gIGVsc2UgaWYgKHJlcy5ib2R5KSB7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShib2R5KTtcbiAgICBsZXQgYXJyYXkgPSBbLi4udHlwZWRBcnJheV07XG4gICAgYXJyYXkubGVuZ3RoPTUwO1xuICAgIC8vY29uc29sZS5sb2coU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xuICB9XG59XG4gIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5KTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlc3BvbnNlLmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVzcG9uc2VIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UoaG9zdFRhcmdldCwgbG9jYWxob3N0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYoaHRtbEZsYWcpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZighcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYocmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ3BsYWluJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvamF2YXNjcmlwdCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5jc3MnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvY3NzJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLnN2ZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2Uvc3ZnK3htbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5wbmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3BuZycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcGcnKXx8ZmxhdFVSTC5lbmRzV2l0aCgnLmpwZWcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL2pwZWcnKTtcbiAgfVxuICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLHFCQUFxQjtBQUM1QixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsSUFBSSxhQUFhO0FBQ2pCLElBQUksYUFBYTtBQUVqQixNQUFNLHFCQUErQjtJQUFDO0NBQWtCO0FBQ3hELE1BQU0sc0JBQXNCO0lBQ0U7SUFDRDtJQUNBO0lBQ0E7Q0FDQTtBQUU3QixJQUFJLFVBQVUsVUFBVSxDQUFDLHVCQUF1QixHQUM5QyxVQUFVLENBQUMsZ0JBQWdCLEdBQzNCLFdBQVcsVUFDWCxXQUFXO0FBRWIsZUFBZSxlQUFnQixHQUFZO0lBRXpDLElBQUksQUFBQyxJQUFJLFVBQVUsYUFBYSxJQUFJLE9BQUssS0FBTTtRQUM3QyxPQUFPLElBQUksU0FBUyxJQUFHO1lBQUMsU0FBUTtnQkFBQyxPQUFPO1lBQTBCO1FBQUM7SUFDckU7SUFDQSxJQUFJLFNBQVMsSUFBSSxJQUFJLFFBQVEsVUFBUyxJQUFJLFFBQVEsU0FBUTtJQUMxRCxJQUFJLE1BQUksT0FBTyxNQUFNO0lBQ3JCLElBQUksVUFBVSxPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQ2hELElBQUksWUFB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