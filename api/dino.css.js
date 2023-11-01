globalThis.dinoCSS=`<style>

html{

filter:hue-rotate(45deg);

}

html:has(.text-green-500){

filter:hue-rotate(135deg);

}

img,svg,h1,h2,h3,a,[class*="text"]{
filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(270deg);
}

html:has(.text-green-500) img,svg,h1,h2,h3,a,[class*="text"]{filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(90deg);}

[href*="/pricing"]{
display:none !important;
visibility:hidden !important;


}
</style><script>
if(document.querySelector('.text-green-500')){
  document.currentScript.outerHTML="<style>html{filter:hue-rotate(135deg) !important;} img,svg,h1,h2,h3,a,[class*="text"]{filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(90deg) !important;}</style>";
}
</scr`+`ipt>`;

