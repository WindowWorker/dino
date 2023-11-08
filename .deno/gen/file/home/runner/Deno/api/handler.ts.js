import './link-resolver.js';
import './text-rewriter.js';
import './dino.css.js';
import './dino.js';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xuXG5jb25zdCBza2lwUmVxdWVzdEhlYWRlcnM6IHN0cmluZ1tdID0gWyd4LWZvcndhcmRlZC1mb3InXTtcbmNvbnN0IHNraXBSZXNwb25zZUhlYWRlcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbm5lY3Rpb25cIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29udGVudC1sZW5ndGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtZnJhbWUtb3B0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWNvbnRlbnQtdHlwZS1vcHRpb25zJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG5cbmxldCBpbmplY3RzID0gZ2xvYmFsVGhpc1snbGluay1yZXNvbHZlci1pbXBvcnQnXStcbiAgZ2xvYmFsVGhpc1sndGV4dC1yZXdyaXRlciddK1xuICBnbG9iYWxUaGlzLmRpbm9DU1MrIFxuICBnbG9iYWxUaGlzLmRpbm87XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChyZXE6IFJlcXVlc3QpIHtcblxuICBpZiAoKHJlcS5tZXRob2QgPT0gXCJPUFRJT05TXCIpfHwocmVxLnVybD09JyonKSkge1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJcIix7aGVhZGVyczp7QWxsb3c6IFwiT1BUSU9OUywgR0VULCBIRUFELCBQT1NUXCJ9fSk7XG4gIH1cbiAgbGV0IHJlcVVSTCA9IHJlcS51cmwucmVwbGFjZSgnX3Jvb3QvJywnJykucmVwbGFjZSgnX3Jvb3QnLCcnKTtcbiAgbGV0IHVybD1yZXFVUkwuc3BsaXQoJy8nKTtcbiAgbGV0IGZsYXRVUkwgPSByZXFVUkwuc3BsaXQoJz8nKVswXS5zcGxpdCgnIycpWzBdO1xuICBsZXQgbG9jYWxob3N0ID0gdXJsWzJdO1xuICB1cmxbMl0gPSBob3N0VGFyZ2V0O1xuICBpZihyZXFVUkwuaW5jbHVkZXMoJ2hvc3RuYW1lPScpKXtcbiAgICB1cmxbMl09cmVxVVJMLnNwbGl0KCdob3N0bmFtZT0nKVsxXS5zcGxpdCgnJicpWzBdLnNwbGl0KCcjJylbMF07XG4gIH1cbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gIGxldCBib2R5ID0gXCJcIjtcbiAgbGV0IGh0bWxGbGFnID0gZmFsc2U7XG4gIGlmKCghcmVzLmhlYWRlcnMuaGFzKCdDb250ZW50LVR5cGUnKSl8fCghcmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkpe1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgICBodG1sRmxhZz10cnVlO1xuICB9IFxuIGVsc2V7XG4gICBsZXQgY3Q9cmVzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKS50b0xvd2VyQ2FzZSgpO1xuICAgLy9jb25zb2xlLmxvZyhjdCk7XG4gICBpZihjdC5pbmNsdWRlcygndGV4dCcpKXtcbiAgICAgIGxldCBoZWFkVGV4dD1pbmplY3RzO1xuICAgICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSlcbiAgICAgICAgLnJlcGxhY2UoJzxoZWFkPicsJzxoZWFkPicraGVhZFRleHQpXG4gICAgICAgIC5yZXBsYWNlKCc8L2hlYWQ+JyxoZWFkVGV4dCsnPC9oZWFkPicpO1xuICAgICAgaWYoYm9keS5pbmNsdWRlcygnPGh0bWwnKXx8Y3QuaW5jbHVkZXMoJ3BsYWluJykpe2h0bWxGbGFnPXRydWU7fVxuICAgIH1cbiBlbHNlIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlQWxsKGhvc3RUYXJnZXQsbG9jYWxob3N0KTtcbiAgfVxuICBlbHNlIGlmIChyZXMuYm9keSkge1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSk7XG4gICAgbGV0IGFycmF5ID0gWy4uLnR5cGVkQXJyYXldO1xuICAgIGFycmF5Lmxlbmd0aD01MDtcbiAgICAvL2NvbnNvbGUubG9nKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcbiAgfVxufVxuICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXNwb25zZS5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlc3BvbnNlSGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGhvc3RUYXJnZXQsIGxvY2FsaG9zdCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmKGh0bWxGbGFnKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoIXJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdwbGFpbicpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9odG1sJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuY3NzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2NzcycpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5zdmcnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcucG5nJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9wbmcnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanBnJyl8fGZsYXRVUkwuZW5kc1dpdGgoJy5qcGVnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9qcGVnJyk7XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhyZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpO1xuICByZXR1cm4gcmVzcG9uc2U7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLElBQUksYUFBYTtBQUVqQixNQUFNLHFCQUErQjtJQUFDO0NBQWtCO0FBQ3hELE1BQU0sc0JBQXNCO0lBQ0U7SUFDRDtJQUNBO0lBQ0E7Q0FDQTtBQUU3QixJQUFJLFVBQVUsVUFBVSxDQUFDLHVCQUF1QixHQUM5QyxVQUFVLENBQUMsZ0JBQWdCLEdBQzNCLFdBQVcsVUFDWCxXQUFXO0FBRWIsZUFBZSxlQUFnQixHQUFZO0lBRXpDLElBQUksQUFBQyxJQUFJLFVBQVUsYUFBYSxJQUFJLE9BQUssS0FBTTtRQUM3QyxPQUFPLElBQUksU0FBUyxJQUFHO1lBQUMsU0FBUTtnQkFBQyxPQUFPO1lBQTBCO1FBQUM7SUFDckU7SUFDQSxJQUFJLFNBQVMsSUFBSSxJQUFJLFFBQVEsVUFBUyxJQUFJLFFBQVEsU0FBUTtJQUMxRCxJQUFJLE1BQUksT0FBTyxNQUFNO0lBQ3JCLElBQUksVUFBVSxPQUFPLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQ2hELElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtJQUN0QixHQUFHLENBQUMsRUFBRSxHQUFHO0lBQ1QsSUFBRyxPQUFPLFNBQVMsY0FBYTtRQUM5QixHQUFHLENBQUMsRUFBRSxHQUFDLE9BQU8sTUFBTSxZQUFZLENBQUMsRUFB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