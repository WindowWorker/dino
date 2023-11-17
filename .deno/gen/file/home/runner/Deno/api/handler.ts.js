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
let injects = globalThis['link-resolver-import'] + globalThis['text-rewriter'] + globalThis.dinoCSS + globalThis.dino + globalThis['host-bridge'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5pbXBvcnQgJy4vdGV4dC1yZXdyaXRlci5qcyc7XG5pbXBvcnQgJy4vZGluby5jc3MuanMnO1xuaW1wb3J0ICcuL2Rpbm8uanMnO1xuaW1wb3J0ICcuL2hvc3QtYnJpZGdlLmpzJztcbmltcG9ydCAnLi9oaWdobGlnaHQuanMnO1xubGV0IGhvc3RUYXJnZXQgPSBcImRlbm8ubGFuZFwiO1xubGV0IGRvY3NUYXJnZXQgPSBcImRvY3MuZGVuby5jb21cIjtcblxuY29uc3Qgc2tpcFJlcXVlc3RIZWFkZXJzOiBzdHJpbmdbXSA9IFsneC1mb3J3YXJkZWQtZm9yJ107XG5jb25zdCBza2lwUmVzcG9uc2VIZWFkZXJzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25uZWN0aW9uXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnQtbGVuZ3RoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICd4LWZyYW1lLW9wdGlvbnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1jb250ZW50LXR5cGUtb3B0aW9ucydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG5sZXQgaW5qZWN0cyA9IGdsb2JhbFRoaXNbJ2xpbmstcmVzb2x2ZXItaW1wb3J0J10rXG4gIGdsb2JhbFRoaXNbJ3RleHQtcmV3cml0ZXInXStcbiAgZ2xvYmFsVGhpcy5kaW5vQ1NTKyBcbiAgZ2xvYmFsVGhpcy5kaW5vK1xuICBnbG9iYWxUaGlzWydob3N0LWJyaWRnZSddO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiAocmVxOiBSZXF1ZXN0KSB7XG4gIHRyeXtcbiAgaWYgKChyZXEubWV0aG9kID09IFwiT1BUSU9OU1wiKXx8KHJlcS51cmw9PScqJykpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiXCIse2hlYWRlcnM6e0FsbG93OiBcIk9QVElPTlMsIEdFVCwgSEVBRCwgUE9TVFwifX0pO1xuICB9XG4gIGxldCByZXFVUkwgPSByZXEudXJsLnJlcGxhY2UoJ19yb290LycsJycpLnJlcGxhY2UoJ19yb290JywnJyk7XG4gIGxldCB1cmw9cmVxVVJMLnNwbGl0KCcvJyk7XG4gIGxldCBmbGF0VVJMID0gcmVxVVJMLnNwbGl0KCc/JylbMF0uc3BsaXQoJyMnKVswXTtcbiAgbGV0IGxvY2FsaG9zdCA9IHVybFsyXTtcbiAgdXJsWzJdID0gaG9zdFRhcmdldDtcbiAgaWYocmVxVVJMLmluY2x1ZGVzKCdob3N0bmFtZT0nKSl7XG4gICAgdXJsWzJdPXJlcVVSTC5zcGxpdCgnaG9zdG5hbWU9JylbMV0uc3BsaXQoJyYnKVswXS5zcGxpdCgnIycpWzBdO1xuICB9XG4gIGlmKHJlcVVSTC5pbmNsdWRlcygnL21hbnVhbCcpKXtcbiAgICB1cmxbMl09ZG9jc1RhcmdldDtcbiAgfVxuICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybC5qb2luKFwiL1wiKSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXF1ZXN0LmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVxdWVzdEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGxvY2FsaG9zdCwgaG9zdFRhcmdldCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICAvL3JlcXVlc3QgPSBhZGRDYWNoZUhlYWRlcnMocmVxdWVzdCk7XG4gIGxldCByZXMgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcblxuICBsZXQgYm9keSA9IFwiXCI7XG4gIGxldCBodG1sRmxhZyA9IGZhbHNlO1xuICBpZigoIXJlcy5oZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpfHwoIXJlcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpKXtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJvZHkpO1xuICAgIGxldCBhcnJheSA9IFsuLi50eXBlZEFycmF5XTtcbiAgICBhcnJheS5sZW5ndGg9NTA7XG4gICAgLy9jb25zb2xlLmxvZyhTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5KSk7XG4gICAgaHRtbEZsYWc9dHJ1ZTtcbiAgfSBcbiBlbHNle1xuICAgbGV0IGN0PXJlcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykudG9Mb3dlckNhc2UoKTtcbiAgIC8vY29uc29sZS5sb2coY3QpO1xuICAgaWYoY3QuaW5jbHVkZXMoJ3RleHQnKSl7XG4gICAgICBsZXQgaGVhZFRleHQ9aW5qZWN0cztcbiAgICAgIGJvZHk9KGF3YWl0IHJlcy50ZXh0KCkpXG4gICAgICAgIC5yZXBsYWNlKCc8aGVhZD4nLCc8aGVhZD4nK2hlYWRUZXh0KVxuICAgICAgICAucmVwbGFjZSgnPC9oZWFkPicsaGVhZFRleHQrJzwvaGVhZD4nKTtcbiAgICAgIGlmKGJvZHkuaW5jbHVkZXMoJzxodG1sJyl8fGN0LmluY2x1ZGVzKCdwbGFpbicpKXtodG1sRmxhZz10cnVlO31cbiAgICB9XG4gZWxzZSBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZUFsbChob3N0VGFyZ2V0LGxvY2FsaG9zdCk7XG4gIH1cbiAgZWxzZSBpZiAocmVzLmJvZHkpIHtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJvZHkpO1xuICAgIGxldCBhcnJheSA9IFsuLi50eXBlZEFycmF5XTtcbiAgICBhcnJheS5sZW5ndGg9NTA7XG4gICAgLy9jb25zb2xlLmxvZyhTdHJpbmcuZnJvbUNoYXJDb2RlKC4uLmFycmF5KSk7XG4gIH1cbn1cbiAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHkpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVzcG9uc2UuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXNwb25zZUhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShob3N0VGFyZ2V0LCBsb2NhbGhvc3QpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBpZihodG1sRmxhZyl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKCFyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICBpZihyZXNwb25zZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygncGxhaW4nKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvaHRtbCcpO1xuICB9XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9qYXZhc2NyaXB0Jyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmNzcycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywndGV4dC9jc3MnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuc3ZnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9zdmcreG1sJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLnBuZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2UvcG5nJyk7XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpwZycpfHxmbGF0VVJMLmVuZHNXaXRoKCcuanBlZycpKXtcbiAgICByZXNwb25zZS5oZWFkZXJzLnNldCgnQ29udGVudC1UeXBlJywnaW1hZ2UvanBlZycpO1xuICB9XG4gIC8vY29uc29sZS5sb2cocmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKTtcbiAgLy9yZXNwb25zZSA9IGFkZENhY2hlSGVhZGVycyhyZXNwb25zZSk7XG4gIHJldHVybiByZXNwb25zZTtcbiAgfWNhdGNoKGUpe1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoJ0Vycm9yOiAnK2Use3N0YXR1czo1MDB9KTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGFkZENhY2hlSGVhZGVycyhyZSl7XG4gIHJlLmhlYWRlcnMuc2V0KFwiQ0ROLUNhY2hlLUNvbnRyb2xcIixcbiAgICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4gKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJDYWNoZS1Db250cm9sXCIsXG4gICBcInB1YmxpYywgbWF4LWFnZT05NjQwMCwgcy1tYXgtYWdlPTk2NDAwLCBzdGFsZS1pZi1lcnJvcj0zMTUzNTAwMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTUzNTAwMFwiXG4pO1xuICByZS5oZWFkZXJzLnNldCggXCJDbG91ZGZsYXJlLUNETi1DYWNoZS1Db250cm9sXCIsXG4gICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJTdXJyb2dhdGUtQ29udHJvbFwiLFxuICAgXCJwdWJsaWMsIG1heC1hZ2U9OTY0MDAsIHMtbWF4LWFnZT05NjQwMCwgc3RhbGUtaWYtZXJyb3I9MzE1MzUwMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9MzE1MzUwMDBcIlxuKTtcbiAgcmUuaGVhZGVycy5zZXQoXCJWZXJjZWwtQ0ROLUNhY2hlLUNvbnRyb2xcIixcbiAgIFwicHVibGljLCBtYXgtYWdlPTk2NDAwLCBzLW1heC1hZ2U9OTY0MDAsIHN0YWxlLWlmLWVycm9yPTMxNTM1MDAwLCBzdGFsZS13aGlsZS1yZXZhbGlkYXRlPTMxNTM1MDAwXCJcbik7XG4gIHJldHVybiByZTtcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBQ3hCLElBQUksYUFBYTtBQUNqQixJQUFJLGFBQWE7QUFFakIsTUFBTSxxQkFBK0I7SUFBQztDQUFrQjtBQUN4RCxNQUFNLHNCQUFzQjtJQUNFO0lBQ0Q7SUFDQTtJQUNBO0NBQ0E7QUFFN0IsSUFBSSxVQUFVLFVBQVUsQ0FBQyx1QkFBdUIsR0FDOUMsVUFBVSxDQUFDLGdCQUFnQixHQUMzQixXQUFXLFVBQ1gsV0FBVyxPQUNYLFVBQVUsQ0FBQyxjQUFjO0FBRTNCLGVBQWUsZUFBZ0IsR0FBWTtJQUN6QyxJQUFHO1FBQ0gsSUFBSSxBQUFD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