

if(window?.location?.href.includes?.('/std')
    ||window?.location?.href.includes?.('/x/')
    ||window?.location?.href.includes?.('/api')
    ||window?.location?.href.includes?.('@')
   ||window?.location?.href.includes?.('/manual')
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
    ||window?.location?.href?.includes?.('/manual')){

    if((!(window.location.href.startsWith('https://docs-')))&&(!(window.location.href.startsWith('https://std-')))){
      window.location.href=window.location.href.replaceAll(window.location.host,'docs-'+window.location.host).split('?')[0].replace('docs-docs-','docs-');
    }

   }else{

    if(window.location.href.startsWith('https://docs-')){
      window.location.href=window.location.href.replaceAll('docs-','').split('?')[0];
    }

   }

   if(window?.location?.pathname?.includes?.('/std')||window?.location?.pathname?.includes?.('/x/')){
     if((!(window.location.href.startsWith('https://std-')))&&(!(window.location.href.startsWith('https://docs-std-')))){

       window.location.href=window.location.href.replaceAll('docs-','').split('?')[0].replace('https://','https://std-').replace('std-std-','std-');


     }
   }else{

      if((window.location.href.startsWith('https://std-'))||(window.location.href.startsWith('https://docs-std-'))){

        window.location.href=window.location.href.replaceAll('std-','').split('?')[0];


      }
   }


}


  function swapHostLinks(){
    let elems = document.querySelectorAll('a[href*="/std"]:not(a[href^="https://std-"]),a[href*="/x/"]:not(a[href^="https://std-"])');
    elems.forEach(function(elem) {
      elem.href = elem.href.replace('docs-','').replace('https://','https://std-').replace('std-std-','std-');
    });

    elems = document.querySelectorAll('a[href^="https://std-"]:not([href*="/std@"],[href*="/x/"])');
    elems.forEach(function(elem) {
      elem.href = elem.href.replace('https://std-','https://');
    });
  }

  elems = document.querySelectorAll('a[href*="/manual"]:not(a[href^="https://docs-"]),a[href*="/api"]:not(a[href^="https://docs-"])');
  elems.forEach(function(elem) {
    elem.href = elem.href.replace('std-','').replace('https://','https://docs-');
  });

  elems = document.querySelectorAll('a[href^="https://docs-"]:not([href*="/manual"],[href*="/api"])');
  elems.forEach(function(elem) {
    elem.href = elem.href.replace('https://docs-','https://');
  });

}





globalThis['host-bridge']=`<script>void `+
  HostBridge
+`();</scri`+`pt>`;

