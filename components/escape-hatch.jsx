function NoSSRJavaScript(props) {
  if(!document.querySelector(`[src$="${props.src}"]`)){
    let js = document.createElement('script');
    
    for (const key in props) {
      if (key !== 'src') {
        js[key] = props[key];
      }
    }
    if(props.src.startsWith('function')){
      js.innerHTML = 'void '+props.src+'();';
    }
    else{
      js.src = props.src;
    }
    document.body.appendChild(js);
  }
  return (<x-javascript src={props.src}></x-javascript>);
}
const JavaScript = dynamic(props => Promise.resolve(NoSSRYourComponent,props), {
  ssr: false,
})

export default JavaScript;