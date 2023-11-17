





function Highlight(){

globalThis.sleep=function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
  let thisLang = 'typescript';
  let codes=document.querySelectorAll('code>pre:not([highlighted]),pre:not([highlighted]):has(code.html-code),pre:not([highlighted]):has(code):not(:has(.language-id,span[style*="color: #"]))');
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
      .replace('-lua','-typescript')
      .replace('-rust','-clike')
      .replace('-cpp','-clike')
      ;//.replace('shell','docker');
  }  
    let codetext='<code class="'+mylang+'">'+codes[i].innerHTML.toString()
      .replaceAll('<br>',`
    `)
      +
      '</code>';
    if(!(codetext.includes(`
    `))){
      codetext=codetext.replaceAll(';',`;
      `)
      .replaceAll('{',`{
      `)
      .replaceAll('}',`}
      `)
      .replaceAll(`

      `,`
      `);
    }
    codes[i].innerHTML=codetext;
    codes[i].setAttribute('highlighted','true');
  }
  try{
  if(Prism){
    Prism?.highlightAll?.();
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

    globalThis.Prism=Prism;Prism.highlightAll();

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

