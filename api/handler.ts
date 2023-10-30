import './link-resolver.js';
let hostTarget = "deno.land";

const skipRequestHeaders: string[] = ['x-forwarded-for'];
const skipResponseHeaders = [
                              "connection", 
                             "content-length",
                             'x-frame-options',
                             'x-content-type-options'
                            ];

export default async function (req: Request) {

  if ((req.method == "OPTIONS")||(req.url=='*')) {
    return new Response("",{headers:{Allow: "OPTIONS, GET, HEAD, POST"}});
  }
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
  let res = await fetch(request);

  let body = "";
  let htmlFlag = false;
 if(res.headers.has('content-type')&&(res.headers.get('content-type').toLowerCase().includes('html'))){
   body=(await res.text()).replace('</head>',globalThis['link-resolver-import']+'</head>');
 }
 else if(res.headers.has('content-type')&&(res.headers.get('content-type').toLowerCase().includes('text'))){
      body=(await res.text()).replace('</head>',globalThis['link-resolver-import']+'</head>');
      if(body.includes('<html')){htmlFlag=true;}
    }
 else if(flatURL.endsWith('.js')){
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
