globalThis.dinoCSS=`<style>

html{

filter:hue-rotate(45deg);

}

html:has(.text-green-500){

filter:hue-rotate(135deg);

}

img,svg{
filter: grayscale(1) sepia(1) hue-rotate(90deg);
}

[href*="/pricing"]{
display:none !important;
visibility:hidden !important;


}
</style><script>
if(document.querySelector('.text-green-500')){
  document.currentScript.outerHTML="<style>html{filter:hue-rotate(135deg) !important;}</style>";
}
</scr`+`ipt>`;

