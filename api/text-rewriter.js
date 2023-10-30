
globalThis['text-rewriter']=`<script>void `+

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
textRewritert(document.body);

setInterval(async function(){textRewritert(document.body);
},100);


document.addEventListener("readystatechange", (event) => {
 textRewritert(document.body);
});

document.addEventListener("DOMContentLoaded", (event) => {
 textRewritert(document.body);
});

document.addEventListener("load", (event) => {
 textRewritert(document.body);
});

}

+`();</script>`;