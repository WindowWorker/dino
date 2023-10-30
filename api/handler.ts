let hostTarget = "deno.land";

const skipRequestHeaders: string[] = [];
const skipResponseHeaders = ["connection", "content-length"];

export default async function (req: Request) {
  console.log(req.url);
  if ((req.method == "OPTIONS")||(req.url=='*')) {
    return new Response("",{headers:{Allow: "OPTIONS, GET, HEAD, POST"}});
  }
  console.log(req.url);
  let url=req.url.split('/');
  let flatURL = req.url.split('?')[0].split('#')[0];
  let localhost = url[2];
  url[2] = hostTarget;
  let request = new Request(url.join("/"));
  for (let header in request.headers.keys) {
    if (header) {
      if (skipRequestHeaders.includes(header.toLowerCase())) {
        continue;
      }
      request.headers.set(
        header,
        request.headers.get(header).toString().replace(localhost, hostTarget),
      );
    }
  }
  if(req.url.includes('std')){
    request.headers.set('Sec-Fetch-Dest','document');
   request.headers.set('Sec-Fetch-Mode','navigate');
  }
  let res = await fetch(request);
  if(req.url.includes('std')){console.log(res.headers);}
  let body = "";
  if(flatURL.endsWith('.js')){
    body=(await res.text()).replaceAll(hostTarget,localhost);
  }
  else if (res.body) {
    body = await res.arrayBuffer();
  }
  let response = new Response(body);
  for (let header in response.headers.keys) {
    if (header) {
      if (skipResponseHeaders.includes(header.toLowerCase())) {
        continue;
      }
      request.headers.set(
        header,
        response.headers.get(header).toString().replace(hostTarget, localhost),
      );
    }
  }
  if(flatURL.endsWith('.js')){
    response.headers.set('Content-Type','text/javascript');
  }
  if(flatURL.endsWith('.svg')){
    response.headers.set('Content-Type','image/svg+xml');
  }
  return response;
}
