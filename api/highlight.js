




function Highlight(){

  globalThis.R=`
  `.split(' ')[0];


  function unlight(){

    let startH=document.querySelectorAll('[highlighted]');
    let startH_length=startH.length;
    for(let i=0;i<startH_length;i++){

      startH[i].removeAttribute('highlighted');

    }
  }

  function unlightEmpty(){

    let startH=document.querySelectorAll('[highlighted]');
    let startH_length=startH.length;
    for(let i=0;i<startH_length;i++){

      if((startH[i].children.length<3)
      &&((startH[i].innerText.includes(R))
      ||(startH[i].innerText.trim().length>50))){
        startH[i].removeAttribute('highlighted');
      }

    }
  }

setInterval(function(){unlightEmpty();},100);


  unlight();
  setTimeout(function(){unlight();},1000);
  setTimeout(function(){unlight();},2000);
  setTimeout(function(){unlight();},3000);

globalThis.sleep=function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function highlighter(){
  if(document.querySelector('highlight-me')){
    try{
    if(Prism){
      Prism?.highlightAll?.();
      }
      }catch(e){}
  }
}

void async function getPrism(){

  addEventListener("DOMContentLoaded", (event) => {
    getp();
  });  

getp();
setTimeout(function(){getp();},1);
  setInterval(function(){getp();},1000);
}();


async function getp(){

/*if(window.location.href.includes('/docs/handbook/declaration-files/dts-from-js.html')){return;}

if(window.location.href.includes('/docs/handbook/tsconfig-json.html')){return;}*/

/*if((!window.location.href.includes('/dev/typescript-vfs'))
&&(!window.location.href.includes('/dev/sandbox'))){return;}*/
  let faces=document.querySelectorAll(`
  __div[id^="method_"]>div[class^="tw-"]:not([highlighted]),
  __div[id^="prop_"]>div[class^="tw-"]:not([highlighted]),
  __div[id^="variable_"]>div[class^="tw-"]:not([highlighted]),
  __div[id^="function_"]>div[class^="tw-"]:not([highlighted]),
  __div[id^="ctor_"]>div[class^="tw-"]:not([highlighted]),
  li>code:not([highlighted]),
  [class="font-mono"]:not([highlighted])`);
  let faces_length=faces.length;
  for(let i=0;i<faces_length;i++){
    faces[i].outerHTML=('<pre style="border-radius:1vmax;"><code><highlight-me></highlight-me>'+faces[i].outerHTML.replaceAll('&lt;','≺')+'</code></pre>')
      .replace('<code><pre','<pre').replace('</pre></code>','</pre>');
    faces[i].setAttribute('highlighted','true');
  }

  let thisLang = 'typescript';
  let codes=document.querySelectorAll('code>pre:not([highlighted]),pre:not([highlighted]):has(code.html-code),pre:not([highlighted]):has(code)');
  let codes_length=codes.length;
  for(let i=0;i<codes_length;i++){
    let mylang='language-'+thisLang;
    let preclass=codes[i].getAttribute('class');
  if(preclass&&preclass.includes(' language-')){
    mylang=('language-'+preclass.split(' language-')[1].split(' ')[0])
      .replace('jsonc','json')
      .replace('json','banana')
      .replace('jsx','typescript')
      .replace('js','typescript')
      .replace('tsx','typescript')
      .replace('ts','typescript')
      .replace('javascript','typescript')
      .replace('elisp','typescript')
      .replace('toml','typescript')
      .replace('banana','yaml')
      .replace('-shell','apple')
      .replace('-sh','-typescript')
      .replace('apple','-shell')
      .replace('terminal','typescript')
      .replace('-text','-typescript')
      .replace('-none','-typescript')
      .replace('-lua','-typescript')
      .replace('-rust','-clike')
      .replace('-cpp','-clike')
      .replaceAll(',','')
      ;//.replace('shell','docker');
  }  
    let codetext='<code class="'+mylang+'"><highlight-me></highlight-me>'+codes[i].innerHTML.toString()
      .replaceAll('<br>',R).trim()+
      '</code>';
    if(!(codetext.includes(R))){
      codetext=codetext.replaceAll(';',`;`+R)
      .replaceAll('{',`{`+R)
      .replaceAll('}',R+`}`+R)
      .replaceAll(R+R,R);
    }
    codes[i].innerHTML=codetext.trim();
    codes[i].setAttribute('class',mylang);
    codes[i].setAttribute('highlighted','true');
  }
  try{
  if(Prism){
    highlighter();
    }
    }catch(e){}
  if(!document.querySelector('[id="prismmincss"]')){
  let l=document.createElement('link');
  l.href='https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css';
  l.rel='stylesheet';
  l.id="prismmincss";
if(document.body){
  document.body.appendChild(l);
  }else{
  await sleep(500);
  document.body.appendChild(l);
  }
  }

  if(!document.querySelector('[id="prismminjs"]')){
  let m=document.createElement('script');
  m.src='https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js';
  m.id="prismminjs";
  m.onload=async function(){

    await addScript('https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-jsx.min.js');
     await addScript('https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-yaml.min.js');
    if(!document.querySelector('[id="prismgominjs"]')){
    let g=document.createElement('script');
    g.src='https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-typescript.min.js';
    g.id="prismgominjs";
    g.onload=function(){

    globalThis.Prism=Prism;highlighter();

    let ss = document.createElement('style');
    ss.innerHTML='code[class*="language-"], pre[class*="language-"]{color:blue;}  .line>span[style="color: #008000"]:first-child{text-wrap:pretty;} .line>span{--background-color:#f5f8ff;} .language-shell [class="token operator"]{color:green !important;} pre,code{text-shadow:none !important;} pre[clsee*="language-typescript"]{color:blue;} code[clsee*="language-typescript"]{color:blue;}';
    document.body.appendChild(ss);
    };
  document.body.appendChild(g); 
    }  
  };



document.body.appendChild(m);

}

  async function addScript(s){
    let jsx=document.createElement('script');
    if(document.querySelector('script[id="'+s+'"]')){return;}
    jsx.id=s;
    let aspromise = new Promise(resolve=>{jsx.resolve=resolve})
      jsx.src=s;
      jsx.onload=function(){jsx.resolve();}
      document.body.appendChild(jsx);
    await aspromise;
    return aspromise;
    }





  }


}

globalThis.highlight=`<scr`+`ipt>void `+Highlight+`();</scr`+`ipt>`;

if(window?.location){
  Highlight();
}

