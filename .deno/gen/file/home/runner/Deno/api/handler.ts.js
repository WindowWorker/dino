import './link-resolver.js';
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
    let htmlFlag = false;
    if (res.headers.has('Content-Type')) {} else if (res.headers.get('content-type').toLowerCase().includes('html')) {
        body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + '</head>');
    } else if (res.headers.has('content-type') && res.headers.get('content-type').toLowerCase().includes('text')) {
        body = (await res.text()).replace('</head>', globalThis['link-resolver-import'] + '</head>');
        if (body.includes('<html')) {
            htmlFlag = true;
        }
    } else if (flatURL.endsWith('.js')) {
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
    if (htmlFlag) {
        response.headers.set('Content-Type', 'text/html');
    }
    return response;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vaG9tZS9ydW5uZXIvRGVuby9hcGkvaGFuZGxlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGluay1yZXNvbHZlci5qcyc7XG5sZXQgaG9zdFRhcmdldCA9IFwiZGVuby5sYW5kXCI7XG5cbmNvbnN0IHNraXBSZXF1ZXN0SGVhZGVyczogc3RyaW5nW10gPSBbJ3gtZm9yd2FyZGVkLWZvciddO1xuY29uc3Qgc2tpcFJlc3BvbnNlSGVhZGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29ubmVjdGlvblwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250ZW50LWxlbmd0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAneC1mcmFtZS1vcHRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3gtY29udGVudC10eXBlLW9wdGlvbnMnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gKHJlcTogUmVxdWVzdCkge1xuXG4gIGlmICgocmVxLm1ldGhvZCA9PSBcIk9QVElPTlNcIil8fChyZXEudXJsPT0nKicpKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlwiLHtoZWFkZXJzOntBbGxvdzogXCJPUFRJT05TLCBHRVQsIEhFQUQsIFBPU1RcIn19KTtcbiAgfVxuICBsZXQgdXJsPXJlcS51cmwuc3BsaXQoJy8nKTtcbiAgbGV0IGZsYXRVUkwgPSByZXEudXJsLnNwbGl0KCc/JylbMF0uc3BsaXQoJyMnKVswXTtcbiAgbGV0IGxvY2FsaG9zdCA9IHVybFsyXTtcbiAgdXJsWzJdID0gaG9zdFRhcmdldDtcbiAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdCh1cmwuam9pbihcIi9cIikpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVxdWVzdC5oZWFkZXJzLmtleXMpIHtcbiAgICBpZiAoaGVhZGVyKSB7XG4gICAgICBpZiAoc2tpcFJlcXVlc3RIZWFkZXJzLmluY2x1ZGVzKGhlYWRlci50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5zZXQoXG4gICAgICAgIGhlYWRlcixcbiAgICAgICAgcmVxdWVzdC5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShsb2NhbGhvc3QsIGhvc3RUYXJnZXQpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgbGV0IHJlcyA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuXG4gIGxldCBib2R5ID0gXCJcIjtcbiAgbGV0IGh0bWxGbGFnID0gZmFsc2U7XG4gIGlmKHJlcy5oZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpe1xuICAgIFxuICB9XG4gZWxzZSBpZihyZXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJ2h0bWwnKSl7XG4gICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlKCc8L2hlYWQ+JyxnbG9iYWxUaGlzWydsaW5rLXJlc29sdmVyLWltcG9ydCddKyc8L2hlYWQ+Jyk7XG4gfVxuIGVsc2UgaWYocmVzLmhlYWRlcnMuaGFzKCdjb250ZW50LXR5cGUnKSYmKHJlcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygndGV4dCcpKSl7XG4gICAgICBib2R5PShhd2FpdCByZXMudGV4dCgpKS5yZXBsYWNlKCc8L2hlYWQ+JyxnbG9iYWxUaGlzWydsaW5rLXJlc29sdmVyLWltcG9ydCddKyc8L2hlYWQ+Jyk7XG4gICAgICBpZihib2R5LmluY2x1ZGVzKCc8aHRtbCcpKXtodG1sRmxhZz10cnVlO31cbiAgICB9XG4gZWxzZSBpZihmbGF0VVJMLmVuZHNXaXRoKCcuanMnKSl7XG4gICAgYm9keT0oYXdhaXQgcmVzLnRleHQoKSkucmVwbGFjZUFsbChob3N0VGFyZ2V0LGxvY2FsaG9zdCk7XG4gIH1cbiAgZWxzZSBpZiAocmVzLmJvZHkpIHtcbiAgICBib2R5ID0gYXdhaXQgcmVzLmFycmF5QnVmZmVyKCk7XG4gIH1cbiAgbGV0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKGJvZHkpO1xuICBmb3IgKGxldCBoZWFkZXIgaW4gcmVzcG9uc2UuaGVhZGVycy5rZXlzKSB7XG4gICAgaWYgKGhlYWRlcikge1xuICAgICAgaWYgKHNraXBSZXNwb25zZUhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVxdWVzdC5oZWFkZXJzLnNldChcbiAgICAgICAgaGVhZGVyLFxuICAgICAgICByZXNwb25zZS5oZWFkZXJzLmdldChoZWFkZXIpLnRvU3RyaW5nKCkucmVwbGFjZShob3N0VGFyZ2V0LCBsb2NhbGhvc3QpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgaWYoZmxhdFVSTC5lbmRzV2l0aCgnLmpzJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgfVxuICBpZihmbGF0VVJMLmVuZHNXaXRoKCcuc3ZnJykpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCdpbWFnZS9zdmcreG1sJyk7XG4gIH1cbiAgaWYoaHRtbEZsYWcpe1xuICAgIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdDb250ZW50LVR5cGUnLCd0ZXh0L2h0bWwnKTtcbiAgfVxuICByZXR1cm4gcmVzcG9uc2U7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxxQkFBcUI7QUFDNUIsSUFBSSxhQUFhO0FBRWpCLE1BQU0scUJBQStCO0lBQUM7Q0FBa0I7QUFDeEQsTUFBTSxzQkFBc0I7SUFDRTtJQUNEO0lBQ0E7SUFDQTtDQUNBO0FBRTdCLGVBQWUsZUFBZ0IsR0FBWTtJQUV6QyxJQUFJLEFBQUMsSUFBSSxVQUFVLGFBQWEsSUFBSSxPQUFLLEtBQU07UUFDN0MsT0FBTyxJQUFJLFNBQVMsSUFBRztZQUFDLFNBQVE7Z0JBQUMsT0FBTztZQUEwQjtRQUFDO0lBQ3JFO0lBQ0EsSUFBSSxNQUFJLElBQUksSUFBSSxNQUFNO0lBQ3RCLElBQUksVUFBVSxJQUFJLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7SUFDakQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0lBQ3RCLEdBQUcsQ0FBQyxFQUFFLEdBQUc7SUFDVCxJQUFJLFVBQVUsSUFBSSxRQUFRLElBQUksS0FBSztJQUNuQyxJQUFLLElBQUksVUFBVSxRQUFRLFFBQVEsS0FBTTtRQUN2QyxJQUFJLFFBQVE7WUFDVixJQUFJLG1CQUFtQixTQUFTLE9BQU8sZ0JBQWdCO2dCQUNyRDtZQUNGO1lBQ0EsUUFBUSxRQUFRLElBQ2QsUUFDQSxRQUFRLFFBQVEsSUFBSSxRQUFRLFdBQVcsUUFBUSxXQUFXO1FBRTlEO0lBQ0Y7SUFDQSxJQUFJLE1BQU0sTUFBTSxNQUFNO0lBRXRCLElBQUksT0FBTztJQUNYLElBQUksV0FBVztJQUNmLElBQUcsSUFBSSxRQUFRLElBQUksaUJBQWdCLENBRW5DLE9BQ0ksSUFBRyxJQUFJLFFBQVEsSUFBSSxnQkFBZ0IsY0FBYyxTQUFTLFNBQVE7UUFDckUsT0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLEVBQUUsUUFBUSxXQUFVLFVBQVUsQ0FBQyx1QkFBdUIsR0FBQztJQUMvRSxPQUNLLElBQUcsSUFBSSxRQUFRLElBQUksbUJBQWtCLElBQUksUUFBUSxJQUFJLGdCQUFnQixjQUFjLFNBQVMsU0FBUztRQUNyRyxPQUFLLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFBRSxRQUFRLFdBQVUsVUFBVSxDQUFDLHVCQUF1QixHQUFDO1FBQzdFLElBQUcsS0FBSyxTQUFTLFVBQVM7WUFBQyxXQUFTO1FBQUs7SUFDM0MsT0FDRSxJQUFHLFFBQVEsU0FBUyxRQUFPO1FBQzdCLE9BQUssQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFLFdBQVcsWUFBVztJQUNoRCxPQUNLLElBQUksSUFBSSxNQUFNO1FBQ2pCLE9BQU8sTUFBTSxJQUFJO0lBQ25CO0lBQ0EsSUFBSSxXQUFXLElBQUksU0FBUztJQUM1QixJQUFLLElBQUksVUFBVSxTQUFTLFFBQVEsS0FBTTtRQUN4QyxJQUFJLFFBQVE7WUFDVixJQUFJLG9CQUFvQixTQUFTLE9BQU8sZ0JBQWdCO2dCQUN0RDtZQUNGO1lBQ0EsUUFBUSxRQUFRLElBQ2QsUUFDQSxTQUFTLFFBQVEsSUFBSSxRQUFRLFdBQVcsUUFBUSxZQUFZO1FBRWhFO0lBQ0Y7SUFDQSxJQUFHLFFBQVEsU0FBUyxRQUFPO1FBQ3pCLFNBQVMsUUFBUSxJQUFJLGdCQUFlO0lBQ3RDO0lBQ0EsSUFBRyxRQUFRLFNBQVMsU0FBUTtRQUMxQixTQUFTLFFBQVEsSUFBSSxnQkFBZTtJQUN0QztJQUNBLElBQUcsVUFBUztRQUNWLFNBQVMsUUFBUSxJQUFJLGdCQUFlO0lBQ3RDO0lBQ0EsT0FBTztBQUNUIn0=