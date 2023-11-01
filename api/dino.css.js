globalThis.dinoCSS=`<style>

html{

filter:hue-rotate(45deg);

}

html:has(.text-green-500){

filter:hue-rotate(135deg);

}

img:not([src*=".gif"]),svg,h1,h2,h3,a:not([href*="hostname"]),:not(pre,code) span[class*="text"]{
filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(180deg);
}

html:has(.text-green-500) img:not([src*=".gif"]),svg,h1,h2,h3,a:not([href*="hostname"]),:not(pre,code) span[class*="text"]{filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(90deg);}

[href*="/pricing"]{
display:none !important;
visibility:hidden !important;


}
</style><script>
if(document.querySelector('.text-green-500')){
  document.currentScript.outerHTML='<style>html{filter:hue-rotate(135deg) !important;} img:not([src*=".gif"]),svg,h1,h2,h3,a:not([href*="hostname"]),:not(pre,code) span[class*="text"]{filter: grayscale(1) sepia(1) saturate(1.5) hue-rotate(90deg) !important;}</style>';
}
</script>`;

