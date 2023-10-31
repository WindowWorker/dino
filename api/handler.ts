import './link-resolver.js';
import './text-rewriter.js';
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
  let reqURL = req.url.replace('_root/','').replace('_root','');
  let url=reqURL.split('/');
  let flatURL = reqURL.split('?')[0].split('#')[0];
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
  if((!res.headers.has('Content-Type'))||(!res.headers.get('content-type'))){
    body = await res.arrayBuffer();
    const typedArray = new Uint8Array(body);
    let array = [...typedArray];
    array.length=50;
    console.log(String.fromCharCode(...array));
    htmlFlag=true;
  } 
 else{
   let ct=res.headers.get('content-type').toLowerCase();
   console.log(ct);
   if(ct.includes('html')){
   body=(await res.text()).replace('</head>',globalThis['link-resolver-import']+globalThis['text-rewriter']+'</head>');
 }
 else if(ct.includes('text')){
      body=(await res.text()).replace('</head>',globalThis['link-resolver-import']+globalThis['text-rewriter']+'</head>');
      if(body.includes('<html')||ct.includes('plain')){htmlFlag=true;}
    }
 else if(flatURL.endsWith('.js')){
    body=(await res.text()).replaceAll(hostTarget,localhost);
  }
  else if (res.body) {
    body = await res.arrayBuffer();
    const typedArray = new Uint8Array(body);
    let array = [...typedArray];
    array.length=50;
    console.log(String.fromCharCode(...array));
  }
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

  if(htmlFlag){
    response.headers.set('Content-Type','text/html');
  }
  if(!response.headers.get('Content-Type')){
    response.headers.set('Content-Type','text/html');
  }
  if(response.headers.get('Content-Type').toLowerCase().includes('plain')){
    response.headers.set('Content-Type','text/html');
  }
  if(flatURL.endsWith('.js')){
    response.headers.set('Content-Type','text/javascript');
  }
  if(flatURL.endsWith('.svg')){
    response.headers.set('Content-Type','image/svg+xml');
  }
  if(flatURL.endsWith('.png')){
    response.headers.set('Content-Type','image/png');
  }
  if(flatURL.endsWith('.jpg')||flatURL.endsWith('.jpeg')){
    response.headers.set('Content-Type','image/jpeg');
  }
  console.log(response.headers.get('content-type'));
  return response;
}
