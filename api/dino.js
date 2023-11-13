if(window?.location?.href.includes?.('/std')
    ||window?.location?.href.includes?.('/x/')
    ||window?.location?.href.includes?.('/api')
    ||window?.location?.href.includes?.('@')
 ||window?.location?.href.includes?.('/manual')
 ||window?.location?.href.includes?.('hostname=docs.deno.com')){
  Dinoify();
}



function Dinoify(){

setInterval(function(){
let dinos = document.querySelectorAll('img[src*="deno-looking-up.svg"],img[src*="logo"][src*=".svg"],img[src*="deno-"],img[src*="saaskit-art-circle.png"],img[src*="cover.png"]');
let dinos_length = dinos.length;

  for(let i=0;i<dinos_length;i++){try{

    dinos[i].src="https://upload.wikimedia.org/wikipedia/en/f/f7/Dino_from_%22The_Flintstones%22.gif";
    
  }catch(e){continue;}}

  let cf = document.querySelector('img[src*="cloudflare-light.svg"]');
  if(cf){cf.src='https://avatars.githubusercontent.com/u/314135';}

  },100);
  
}


globalThis.dino=`<script>void `+
  Dinoify
+`();</scri`+`pt>`;

