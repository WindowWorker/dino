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
    if (req.url.includes('std')) {
        request.headers.set('Sec-Fetch-Dest', 'document');
        request.headers.set('Sec-Fetch-Mode', 'navigate');
    }
    let res = await fetch(request);
    if (req.url.includes('std')) {
        console.log(res.headers);
    }
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
    if (flatURL.endsWith('.svg')) {
        response.headers.set('Content-Type', 'image/svg+xml');
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaG9zdFRhcmdldCA9IFwiZGVuby5sYW5kXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbXTtcbmNvbnN0IHNraXBSZXNwb25zZUhlYWRlcnMgPSBbXCJjb25uZWN0aW9uXCIsIFwiY29udGVudC1sZW5ndGhcIl07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIChyZXE6IFJlcXVlc3QpIHtcbiAgY29uc29sZS5sb2cocmVxLnVybCk7XG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBjb25zb2xlLmxvZyhyZXEudXJsKTtcbiAgbGV0IHVybD1yZXEudXJsLnNwbGl0KCcvJyk7XG4gIGxldCBmbGF0VVJMID0gcmVxLnVybC5zcGxpdCgnPycpWzBdLnNwbGl0KCcjJylbMF07XG4gIGxldCBsb2NhbGhvc3QgPSB1cmxbMl07XG4gIHVybFsyXSA9IGhvc3RUYXJnZXQ7XG4gIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLmpvaW4oXCIvXCIpKTtcbiAgZm9yIChsZXQgaGVhZGVyIGluIHJlcXVlc3QuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXF1ZXN0SGVhZGVycy5pbmNsdWRlcyhoZWFkZXIudG9Mb3dlckNhc2UoKSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuICAgICAgICBoZWFkZXIsXG4gICAgICAgIHJlcXVlc3QuaGVhZGVycy5nZXQoaGVhZGVyKS50b1N0cmluZygpLnJlcGxhY2UobG9jYWxob3N0LCBob3N0VGFyZ2V0KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIGlmKHJlcS51cmwuaW5jbHVkZXMoJ3N0ZCcpKXtcbiAgICByZXF1ZXN0LmhlYWRlcnMuc2V0KCdTZWMtRmV0Y2gtRGVzdCcsJ2RvY3VtZW50Jyk7XG4gICByZXF1ZXN0LmhlYWRlcnMuc2V0KCdTZWMtRmV0Y2gtTW9kZScsJ25hdmlnYXRlJyk7XG4gIH1cbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICBpZihyZXEudXJsLmluY2x1ZGVzKCdzdGQnKSl7Y29uc29sZS5sb2cocmVzLmhlYWRlcnMpO31cbiAgbGV0IGJvZHkgPSBcIlwiO1xuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZUFsbChob3N0VGFyZ2V0LGxvY2FsaG9zdCk7XG4gIH1cbiAgZWxzZSBpZiAocmVzLmJvZHkpIHtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gIH1cbiAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHkpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVzcG9uc2UuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXNwb25zZUhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShob3N0VGFyZ2V0LCBsb2NhbGhvc3QpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuc3ZnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9zdmcreG1sJyk7XG4gIH1cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksYUFBYTtBQUVqQixNQUFNLHFCQUErQixFQUFFO0FBQ3ZDLE1BQU0sc0JBQXNCO0lBQUM7SUFBYztDQUFpQjtBQUU1RCxlQUFlLGVBQWdCLEdBQVk7SUFDekMsUUFBUSxJQUFJLElBQUk7SUFDaEIsSUFBSSxBQUFDLElBQUksVUFBVSxhQUFhLElBQUksT0FBSyxLQUFNO1FBQzdDLE9BQU8sSUFBSSxTQUFTLElBQUc7WUFBQyxTQUFRO2dCQUFDLE9BQU87WUFBMEI7UUFBQztJQUNyRTtJQUNBLFFBQVEsSUFBSSxJQUFJO0lBQ2hCLElBQUksTUFBSSxJQUFJLElBQUksTUFBTTtJQUN0QixJQUFJLFVBQVUsSUFBSSxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO0lBQ2pELElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtJQUN0QixHQUFHLENBQUMsRUFBRSxHQUFHO0lBQ1QsSUFBSSxVQUFVLElBQUksUUFBUSxJQUFJLEtBQUs7SUFDbkMsSUFBSyxJQUFJLFVBQVUsUUFBUSxRQUFRLEtBQU07UUFDdkMsSUFBSSxRQUFRO1lBQ1YsSUFBSSxtQkFBbUIsU0FBUyxPQUFPLGdCQUFnQjtnQkFDckQ7WUFDRjtZQUNBLFFBQVEsUUFBUSxJQUNkLFFBQ0EsUUFBUSxRQUFRLElBQUksUUFBUSxXQUFXLFFBQVEsV0FBVztRQUU5RDtJQUNGO0lBQ0EsSUFBRyxJQUFJLElBQUksU0FBUyxRQUFPO1FBQ3pCLFFBQVEsUUFBUSxJQUFJLGtCQUFpQjtRQUN0QyxRQUFRLFFBQVEsSUFBSSxrQkFBaUI7SUFDdEM7SUFDQSxJQUFJLE1BQU0sTUFBTSxNQUFNO0lBQ3RCLElBQUcsSUFBSSxJQUFJLFNBQVMsUUFBTztRQUFDLFFBQVEsSUFBSSxJQUFJO0lBQVM7SUFDckQsSUFBSSxPQUFPO0lBQ1gsSUFBRyxRQUFRLFNBQVMsUUFBTztRQUN6QixPQUFLLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRSxXQUFXLFlBQVc7SUFDaEQsT0FDSyxJQUFJLElBQUksTUFBTTtRQUNqQixPQUFPLE1BQU0sSUFBSTtJQUNuQjtJQUNBLElBQUksV0FBVyxJQUFJLFNBQVM7SUFDNUIsSUFBSyxJQUFJLFVBQVUsU0FBUyxRQUFRLEtBQU07UUFDeEMsSUFBSSxRQUFRO1lBQ1YsSUFBSSxvQkFBb0IsU0FBUyxPQUFPLGdCQUFnQjtnQkFDdEQ7WUFDRjtZQUNBLFFBQVEsUUFBUSxJQUNkLFFBQ0EsU0FBUyxRQUFRLElBQUksUUFBUSxXQUFXLFFBQVEsWUFBWTtRQUVoRTtJQUNGO0lBQ0EsSUFBRyxRQUFRLFNBQVMsUUFBTztRQUN6QixTQUFTLFFBQVEsSUFBSSxnQkFBZTtJQUN0QztJQUNBLElBQUcsUUFBUSxTQUFTLFNBQVE7UUFDMUIsU0FBUyxRQUFRLElBQUksZ0JBQWU7SUFDdEM7SUFDQSxPQUFPO0FBQ1QifQ==