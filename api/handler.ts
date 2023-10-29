let hostTarget = "deno.land";

const skipRequestHeaders: string[] = [];
const skipResponseHeaders = ["connection", "content-length"];

export default async function (req: Request) {
  console.log(req.url);
  if ((req.method == "OPTIONS")||(req.url=='*')) {
    return new Response("",{headers:{Allow: "OPTIONS, GET, HEAD, POST"}});
  }
  console.log(req.url);
  let url = req.url.split("/");
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
  if (res.body) {
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
  return response;
}
