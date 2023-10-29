let hostTarget = "deno.land";
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
    let url = req.url.split("/");
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
    if (res.body) {
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
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaG9zdFRhcmdldCA9IFwiZGVuby5sYW5kXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbXTtcbmNvbnN0IHNraXBSZXNwb25zZUhlYWRlcnMgPSBbXCJjb25uZWN0aW9uXCIsIFwiY29udGVudC1sZW5ndGhcIl07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChyZXE6IFJlcXVlc3QpIHtcbiAgY29uc29sZS5sb2cocmVxLnVybCk7XG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBjb25zb2xlLmxvZyhyZXEudXJsKTtcbiAgbGV0IHVybCA9IHJlcS51cmwuc3BsaXQoXCIvXCIpO1xuICBsZXQgbG9jYWxob3N0ID0gdXJsWzJdO1xuICB1cmxbMl0gPSBob3N0VGFyZ2V0O1xuICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KHVybC5qb2luKFwiL1wiKSk7XG4gIGZvciAobGV0IGhlYWRlciBpbiByZXF1ZXN0LmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVxdWVzdEhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KGhlYWRlcikudG9TdHJpbmcoKS5yZXBsYWNlKGxvY2FsaG9zdCwgaG9zdFRhcmdldCksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBsZXQgcmVzID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gIGxldCBib2R5ID0gXCJcIjtcbiAgaWYgKHJlcy5ib2R5KSB7XG4gICAgYm9keSA9IGF3YWl0IHJlcy5hcnJheUJ1ZmZlcigpO1xuICB9XG4gIGxldCByZXNwb25zZSA9IG5ldyBSZXNwb25zZShib2R5KTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlc3BvbnNlLmhlYWRlcnMua2V5cykge1xuICAgIGlmIChoZWFkZXIpIHtcbiAgICAgIGlmIChza2lwUmVzcG9uc2VIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVzcG9uc2UuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UoaG9zdFRhcmdldCwgbG9jYWxob3N0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNwb25zZTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLGFBQWE7QUFFakIsTUFBTSxxQkFBK0IsRUFBRTtBQUN2QyxNQUFNLHNCQUFzQjtJQUFDO0lBQWM7Q0FBaUI7QUFFNUQsZUFBZSxlQUFnQixHQUFZO0lBQ3pDLFFBQVEsSUFBSSxJQUFJO0lBQ2hCLElBQUksQUFBQyxJQUFJLFVBQVUsYUFBYSxJQUFJLE9BQUssS0FBTTtRQUM3QyxPQUFPLElBQUksU0FBUyxJQUFHO1lBQUMsU0FBUTtnQkFBQyxPQUFPO1lBQTBCO1FBQUM7SUFDckU7SUFDQSxRQUFRLElBQUksSUFBSTtJQUNoQixJQUFJLE1BQU0sSUFBSSxJQUFJLE1BQU07SUFDeEIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3RCLEdBQUcsQ0FBQyxFQUFFLEdBQUc7SUFDVCxJQUFJLFVBQVUsSUFBSSxRQUFRLElBQUksS0FBSztJQUNuQyxJQUFLLElBQUksVUFBVSxRQUFRLFFBQVEsS0FBTTtRQUN2QyxJQUFJLFFBQVE7WUFDVixJQUFJLG1CQUFtQixTQUFTLE9BQU8sZ0JBQWdCO2dCQUNyRDtZQUNGO1lBQ0EsUUFBUSxRQUFRLElBQ2QsUUFDQSxRQUFRLFFBQVEsSUFBSSxRQUFRLFdBQVcsUUFBUSxXQUFXO1FBRTlEO0lBQ0Y7SUFDQSxJQUFJLE1BQU0sTUFBTSxNQUFNO0lBQ3RCLElBQUksT0FBTztJQUNYLElBQUksSUFBSSxNQUFNO1FBQ1osT0FBTyxNQUFNLElBQUk7SUFDbkI7SUFDQSxJQUFJLFdBQVcsSUFBSSxTQUFTO0lBQzVCLElBQUssSUFBSSxVQUFVLFNBQVMsUUFBUSxLQUFNO1FBQ3hDLElBQUksUUFBUTtZQUNWLElBQUksb0JBQW9CLFNBQVMsT0FBTyxnQkFBZ0I7Z0JBQ3REO1lBQ0Y7WUFDQSxRQUFRLFFBQVEsSUFDZCxRQUNBLFNBQVMsUUFBUSxJQUFJLFFBQVEsV0FBVyxRQUFRLFlBQVk7UUFFaEU7SUFDRjtJQUNBLE9BQU87QUFDVCJ9