globalThis.dinoCSS=`<style>

html{

filter:hue-rotate(135deg) saturate(3);

}

pre[class*="language-"]{
background-color:aliceblue;
}

.pagination-nav__link--next .pagination-nav__label:after {
    content: " »" !important;
}

.pagination-nav__link--prev .pagination-nav__label:before {
    content: "« " !important;
}

kuhghtml[location*="/std"]{

filter:hue-rotate(45deg);

}

a[aria-label="Landing Page"]  {
  background-image: url("https://upload.wikimedia.org/wikipedia/en/f/f7/Dino_from_%22The_Flintstones%22.gif");

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

a[aria-label="Landing Page"][href="https://deno.typescripts.org/"]::before {
  content: "Dino";
  font-weight: bold;
}

a[aria-label="Landing Page"][href="https://deno.typescripts.org/"]>svg{visibility:hidden;}

html:not([location*="docs.deno.com"]) img:not([src*=".gif"]),svg,h1,h2,h3,a,:not(pre,code) span[class*="text"],
button[class*="disabled:invisible"]
{
filter: sepia(1) hue-rotate(90deg);
}

HIDDEN-STUFF,
a[href*="fresh.deno.dev"],
.iconExternalLink_nPIU,
svg[aria-label*="Deno"],
[href*="/pricing"]{
display:none !important;
visibility:hidden !important;
}

DINO-IMAGES,
a[aria-label="Landing Page"][href="https://deno.typescripts.org/"],
img[src*="Dino_from_%22The_Flintstones%22.gif"]
{
filter:hue-rotate(-160deg)  drop-shadow(1px 1px 0.1rem white) drop-shadow(-1px -1px 0.1rem white) !important;
opacity:50%;
max-height:100vh;
}

h1{
font-size:unset !important;
}

</style>`;

