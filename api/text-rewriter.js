globalThis.reactTextRewriter=TextRewriter;

if(window?.location?.href.includes?.('/std')
    ||window?.location?.href.includes?.('/x/')
    ||window?.location?.href.includes?.('/api')
    ||window?.location?.href.includes?.('@')
 ||window?.location?.href.includes?.('/manual')
 ||window?.location?.href.includes?.('hostname=docs.deno.com')){



    TextRewriter();
}


function TextRewriter(){

function textRewriter(el){
  if(!el){return;}
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()){
  a.push(n);
    let ntext=n.textContent;

  ntext=ntext
  .replace(/Deno/g,'Dino')
    .replace(/deno/g,'dino')
    .replace(/DENO/g,'DINO')
    .replace(/DENO/gi,'Dino');



  if(ntext!=n.textContent){
    n.textContent=ntext;
    try{n.style.backgroundColor='rgba(0,0,0,0)';}catch(e){continue;}
  }

 ;


}
  return a;
  }
textRewriter(document.body);

setInterval(async function(){textRewriter(document.body);
},100);


document.addEventListener("readystatechange", (event) => {
 textRewriter(document.body);
});

document.addEventListener("DOMContentLoaded", (event) => {
 textRewriter(document.body);
});

document.addEventListener("load", (event) => {
 textRewriter(document.body);
});

}

globalThis['text-rewriter']=`<script>void `+
  TextRewriter
+`();</scri`+`pt>`;