

if(window?.location?.href.includes?.('/std')
    ||window?.location?.href.includes?.('/api')
    ||window?.location?.href.includes?.('@')
   ||window?.location?.href.includes?.('/manual')
   ||window?.location?.href.includes?.('hostname=docs.deno.com')){
  HostBridge();
}

function HostBridge(){

  swapHost();

setInterval(function(){



},100);

function swapHost(){

  if(window?.location?.href.includes?.('/manual')){

    if(!window.location.href.startsWith('https://docs-')){
      window.location.href=window.location.href.replaceAll(window.location.host,'docs-'+window.location.host);
    }

   }else{

    if(window.location.href.startsWith('https://docs-')){
      window.location.href=window.location.href.replaceAll('docs-'+window.location.host,window.location.host);
    }

   }

}


}





globalThis['host-bridge']=`<script>void `+
  HostBridge
+`();</scri`+`pt>`;

