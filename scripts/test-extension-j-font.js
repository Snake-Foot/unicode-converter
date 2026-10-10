"use strict";
const fontkit=require("@cantoo/fontkit");
const fs=require("fs");
const crypto=require("crypto");
const filename="fonts/han/PlangothicP2-Regular.woff2";
const font=fontkit.openSync(filename);
let notdef="";
try{notdef=font.getGlyph(0).path.toSVG();}catch(e){}
const items=[];
for(const hex of ["332D3","32634","324D7","328CB","32E35","32A24","328C8","3339C","3331D","32700","325F0","32AA9","32CBA","32E9F","32A93","32DAE","32BA3","33163","331CF"]){
 const codePoint=parseInt(hex,16),hasCmap=font.hasGlyphForCodePoint(codePoint);
 const glyph=font.glyphForCodePoint(codePoint);
 const svg=glyph?.path?.toSVG()||"";
 const box=glyph?.path?.bbox;
 const bounds=box?{width:box.maxX-box.minX,height:box.maxY-box.minY}:null;
 const hasOutline=svg.length>0&&svg!==notdef&&glyph.id!==0&&bounds?.width>0&&bounds?.height>0;
 const item={hex,hasCmap,glyphId:glyph?.id,svgBytes:svg.length,sha256:crypto.createHash("sha256").update(svg).digest("hex").slice(0,16),sameAsNotdef:svg===notdef,bounds,hasOutline};
 items.push(item);
 console.log(JSON.stringify(item));
}
console.log("Extension J glyph samples:",items.filter(x=>x.hasOutline).length,"/",items.length);
if(items.some(x=>!x.hasOutline))process.exitCode=1;
