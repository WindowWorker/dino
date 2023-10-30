let hostTarget = "deno.com";
const skipRequestHeaders = [];
const skipResponseHeaders = [
    "connection",
    "content-length"
];
export default async function(req) {
    console.log(req.url);
    if (req.method == "OPTIONS" || req.url == '*') {
        return new Response("", {
            headers: {
                Allow: "OPTIONS, GET, HEAD, POST"
            }
        });
    }
    console.log(req.url);
    let url = req.url.split('/');
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
    if (flatURL.endsWith('.js')) {
        body = (await res.text()).replaceAll(hostTarget, localhost);
    } else if (res.body) {
        body = await res.arrayBuffer();
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
    if (flatURL.endsWith('.js')) {
        response.headers.set('Content-Type', 'text/javascript');
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaG9zdFRhcmdldCA9IFwiZGVuby5jb21cIjtcblxuY29uc3Qgc2tpcFJlcXVlc3RIZWFkZXJzOiBzdHJpbmdbXSA9IFtdO1xuY29uc3Qgc2tpcFJlc3BvbnNlSGVhZGVycyA9IFtcImNvbm5lY3Rpb25cIiwgXCJjb250ZW50LWxlbmd0aFwiXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuICBjb25zb2xlLmxvZyhyZXEudXJsKTtcbiAgaWYgKChyZXEubWV0aG9kID09IFwiT1BUSU9OU1wiKXx8KHJlcS51cmw9PScqJykpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiXCIse2hlYWRlcnM6e0FsbG93OiBcIk9QVElPTlMsIEdFVCwgSEVBRCwgUE9TVFwifX0pO1xuICB9XG4gIGNvbnNvbGUubG9nKHJlcS51cmwpO1xuICBsZXQgdXJsPXJlcS51cmwuc3BsaXQoJy8nKTtcbiAgbGV0IGZsYXRVUkwgPSByZXEudXJsLnNwbGl0KCc/JylbMF0uc3BsaXQoJyMnKVswXTtcbiAgbGV0IGxvY2FsaG9zdCA9IHVybFsyXTtcbiAgdXJsWzJdID0gaG9zdFRhcmdldDtcbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICBsZXQgYm9keSA9IFwiXCI7XG4gIGlmKGZsYXRVUkwuZW5kc1dpdGgoJy5qcycpKXtcbiAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlQWxsKGhvc3RUYXJnZXQsbG9jYWxob3N0KTtcbiAgfVxuICBlbHNlIGlmIChyZXMuYm9keSkge1xuICAgIGJvZHkgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcbiAgfVxuICBsZXQgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoYm9keSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXNwb25zZS5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlc3BvbnNlSGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlc3BvbnNlLmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGhvc3RUYXJnZXQsIGxvY2FsaG9zdCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5zZXQoJ0NvbnRlbnQtVHlwZScsJ3RleHQvamF2YXNjcmlwdCcpO1xuICB9XG4gIHJldHVybiByZXNwb25zZTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLGFBQWE7QUFFakIsTUFBTSxxQkFBK0IsRUFBRTtBQUN2QyxNQUFNLHNCQUFzQjtJQUFDO0lBQWM7Q0FBaUI7QUFFNUQsZUFBZSxlQUFnQixHQUFZO0lBQ3pDLFFBQVEsSUFBSSxJQUFJO0lBQ2hCLElBQUksQUFBQyxJQUFJLFVBQVUsYUFBYSxJQUFJLE9BQUssS0FBTTtRQUM3QyxPQUFPLElBQUksU0FBUyxJQUFHO1lBQUMsU0FBUTtnQkFBQyxPQUFPO1lBQTBCO1FBQUM7SUFDckU7SUFDQSxRQUFRLElBQUksSUFBSTtJQUNoQixJQUFJLE1BQUksSUFBSSxJQUFJLE1BQU07SUFDdEIsSUFBSSxVQUFVLElBQUksSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtJQUNqRCxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7SUFDdEIsR0FBRyxDQUFDLEVBQUUsR0FBRztJQUNULElBQUksVUFBVSxJQUFJLFFBQVEsSUFBSSxLQUFLO0lBQ25DLElBQUssSUFBSSxVQUFVLFFBQVEsUUFBUSxLQUFNO1FBQ3ZDLElBQUksUUFBUTtZQUNWLElBQUksbUJBQW1CLFNBQVMsT0FBTyxnQkFBZ0I7Z0JBQ3JEO1lBQ0Y7WUFDQSxRQUFRLFFBQVEsSUFDZCxRQUNBLFFBQVEsUUFBUSxJQUFJLFFBQVEsV0FBVyxRQUFRLFdBQVc7UUFFOUQ7SUFDRjtJQUNBLElBQUksTUFBTSxNQUFNLE1BQU07SUFDdEIsSUFBSSxPQUFPO0lBQ1gsSUFBRyxRQUFRLFNBQVMsUUFBTztRQUN6QixPQUFLLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRSxXQUFXLFlBQVc7SUFDaEQsT0FDSyxJQUFJLElBQUksTUFBTTtRQUNqQixPQUFPLE1BQU0sSUFBSTtJQUNuQjtJQUNBLElBQUksV0FBVyxJQUFJLFNBQVM7SUFDNUIsSUFBSyxJQUFJLFVBQVUsU0FBUyxRQUFRLEtBQU07UUFDeEMsSUFBSSxRQUFRO1lBQ1YsSUFBSSxvQkFBb0IsU0FBUyxPQUFPLGdCQUFnQjtnQkFDdEQ7WUFDRjtZQUNBLFFBQVEsUUFBUSxJQUNkLFFBQ0EsU0FBUyxRQUFRLElBQUksUUFBUSxXQUFXLFFBQVEsWUFBWTtRQUVoRTtJQUNGO0lBQ0EsSUFBRyxRQUFRLFNBQVMsUUFBTztRQUN6QixTQUFTLFFBQVEsSUFBSSxnQkFBZTtJQUN0QztJQUNBLE9BQU87QUFDVCJ9