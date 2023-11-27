

if(window?.location?.href.includes?.('/std')
    ||window?.location?.href.includes?.('/x/')
    ||window?.location?.href.includes?.('/api')
    ||window?.location?.href.includes?.('@')
   ||window?.location?.href.includes?.('/manual')
   ||window?.location?.href.includes?.('/tutorials')
   ||window?.location?.href.includes?.('hostname=docs.deno.com')){
  HostBridge();
}

function HostBridge(){

  swapHost();

setInterval(function(){
  swapHostLinks();


},100);

function swapHost(){

  if(window?.location?.href?.includes?.('/api')
    ||window?.location?.href?.includes?.('@')
    ||window?.location?.href?.includes?.('/manual')
    ||window?.location?.href?.includes?.('/tutorials')){

    if((!(window.location.href.startsWith('https://docs-')))&&(!(window.location.href.startsWith('https://std-')))){
      let nextWindow=window.location.href.replaceAll(window.location.host,'docs-'+window.location.host).split('?')[0].replace('docs-docs-','docs-');
      if(window.location.href!=nextWindow){
      window.location.href=nextWindow;
        }
    }

   }else{

    if(window.location.href.startsWith('https://docs-')){
      let nextWindow=window.location.href.replaceAll('docs-','').split('?')[0];
      if(window.location.href!=nextWindow){
      window.location.href=nextWindow;
        }
    }

   }

   if(window?.location?.pathname?.includes?.('/std')||window?.location?.pathname?.includes?.('/x/')){
     if((!(window.location.href.startsWith('https://std-')))&&(!(window.location.href.startsWith('https://docs-std-')))){
        let nextWindow=window.location.href.replaceAll('docs-','').split('?')[0].replace('https://','https://std-').replace('std-std-std-','std-std-');
       if(window.location.href!=nextWindow){
       window.location.href=nextWindow;
         }


     }
   }else{

      if((window.location.href.startsWith('https://std-'))||(window.location.href.startsWith('https://docs-std-'))){
       let nextWindow = window.location.href.replaceAll('std-','').split('?')[0];
         if(window.location.href!=nextWindow){
         window.location.href=nextWindow;
           }



      }
   }


}


  function swapHostLinks(){
    let elems = document.querySelectorAll('a[href*="/std"][href*="typescripts.org/"]:not(a[href^="https://std-"]),a[href*="/x/"][href*="typescripts.org/"]:not(a[href^="https://std-"])');
    let elems_length=elems.length;
    for(let i=0;i<elems_length;i++){try{

      elems[i].href = elems[i].href.replace('docs-','').replace('https://','https://std-').replace('std-std-std-','std-std-');

    }catch(e){continue;}}



    elems = document.querySelectorAll('a[href^="https://std-"][href*="typescripts.org"]:not([href*="/std@"],[href*="/x/"])');
    elems_length=elems.length;
    for(let i=0;i<elems_length;i++){try{

      elems[i].href = elems[i].href.replace('https://std-','https://');

    }catch(e){continue;}}




  elems = document.querySelectorAll('a[href*="/manual"][href*="typescripts.org/"]:not(a[href^="https://docs-"]),a[href*="/api"][href*="typescripts.org/"]:not(a[href^="https://docs-"]),a[href*="/tutorials"][href*="typescripts.org/"]:not(a[href^="https://docs-"])');
  elems_length=elems.length;
  for(let i=0;i<elems_length;i++){try{

    elems[i].href = elems[i].href.replace('std-','').replace('https://','https://docs-');

  }catch(e){continue;}}


  elems = document.querySelectorAll('a[href^="https://docs-"][href*="typescripts.org/"]:not([href*="/tutorials"],[href*="/manual"],[href*="/api"])');
  elems_length=elems.length;
  for(let i=0;i<elems_length;i++){try{

    elems[i].href = elems[i].href.replace('https://docs-','https://');

  }catch(e){continue;}}

  }
}





globalThis['host-bridge']=`<script>void `+
  HostBridge
+`();</scri`+`pt>`;

