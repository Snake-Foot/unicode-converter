/* Verified SVG backup for reported Unicode 18 CJK Extension J codepoints.
   Generated from actual Plangothic P2 glyph contours during CI. */
let extensionJFallbackPromise=null;
function loadExtensionJFallback(){
  if(!extensionJFallbackPromise){
    extensionJFallbackPromise=fetch("./data/extension_j_glyph_fallback.json",{cache:"no-cache"})
      .then(r=>{if(!r.ok)throw Error("Extension J fallback absent");return r.json()})
      .then(data=>{
        if(data.schema_version!==1||data.unicode_version!=="18.0.0")throw Error("Unexpected Extension J fallback format");
        return data.glyphs||{};
      }).catch(error=>{console.warn("Optional Extension J backup unavailable",error);return {}});
  }
  return extensionJFallbackPromise;
}
const reportedExtensionJ=new Set(["332D3","32634","324D7","328CB","32E35","32A24","328C8","3339C","3331D","32700","325F0","32AA9","32CBA","32E9F","32A93","32DAE","32BA3","33163","331CF"]);
async function renderExtensionJFallback(inner,codePoint){
  const hex=codePoint.toString(16).toUpperCase();
  if(!reportedExtensionJ.has(hex))return false;
  const glyphs=await loadExtensionJFallback();
  const shape=glyphs[hex];
  if(!shape||typeof shape.path!=="string"||typeof shape.viewBox!=="string")return false;
  const ns="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(ns,"svg");
  svg.setAttribute("viewBox",shape.viewBox);
  svg.setAttribute("width","1em");
  svg.setAttribute("height","1em");
  svg.setAttribute("role","img");
  svg.setAttribute("aria-label","U+"+hex);
  svg.style.display="inline-block";
  svg.style.overflow="visible";
  svg.style.verticalAlign="middle";
  const path=document.createElementNS(ns,"path");
  path.setAttribute("d",shape.path);
  path.setAttribute("transform","scale(1,-1)");
  path.setAttribute("fill","currentColor");
  svg.appendChild(path);
  inner.textContent="";
  inner.appendChild(svg);
  inner.title="U+"+hex+"：Plangothic P2の字形SVGで表示";
  return true;
}
