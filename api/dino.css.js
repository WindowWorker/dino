globalThis.dinoCSS=`<style>

html{

filter:hue-rotate(135deg) saturate(3);

}

kuhghtml[location*="/std"]{

filter:hue-rotate(45deg);

}

a[aria-label="Landing Page"][href="https://deno.typescripts.org/"]  {
  background-image: url("https://upload.wikimedia.org/wikipedia/en/f/f7/Dino_from_%22The_Flintstones%22.gif");

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

a[aria-label="Landing Page"][href="https://deno.typescripts.org/"]::after {
  content: "Dino";
}

a[aria-label="Landing Page"][href="https://deno.typescripts.org/"]>svg{visibility:hidden;}

html img:not([src*=".gif"]),svg,h1,h2,h3,a,:not(pre,code) span[class*="text"]{filter: sepia(1) hue-rotate(90deg);}

[href*="/pricing"]{
display:none !important;
visibility:hidden !important;
}
</style>`;

