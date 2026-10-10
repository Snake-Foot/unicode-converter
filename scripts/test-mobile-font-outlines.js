"use strict";
/* Regression for the eight glyphs reported as pixelated on smartphones.
   FontFace + cmap is only accepted as reliable for these glyphs after
   verifying the actual TTF outlines and notdef distinction with fontkit. */
const assert=require("node:assert/strict");
const path=require("node:path");
const fontkit=require("@cantoo/fontkit");
const cases=[
  ["109EB","fonts/ancient/NotoSansMeroitic-Regular.ttf","Noto Sans Meroitic"],
  ["1081F","fonts/ancient/NotoSansCypriot-Regular.ttf","Noto Sans Cypriot"],
  ["11D6B","fonts/scripts/NotoSansGunjalaGondi-Regular.ttf","Noto Sans Gunjala Gondi"],
  ["110C0","fonts/scripts/NotoSansKaithi-Regular.ttf","Noto Sans Kaithi"],
  ["16A51","fonts/scripts/NotoSansMro-Regular.ttf","Noto Sans Mro"],
  ["11400","fonts/scripts/NotoSansNewa-Regular.ttf","Noto Sans Newa"],
  ["111E5","fonts/scripts/NotoSerifSinhala-Regular.ttf","Noto Serif Sinhala"],
  ["10408","fonts/scripts/NotoSansDeseret-Regular.ttf","Noto Sans Deseret"]
];
const index=require("../data/unicode18_font_coverage_index.json");
const audit=require("../data/unicode18_font_cmap_audit.json");
function entry(cp){
 let a=0,b=index.ranges.length-1;
 while(a<=b){
   const m=(a+b)>>>1,rg=index.ranges[m];
   if(cp<rg[0])b=m-1;
   else if(cp>rg[1])a=m+1;
   else return rg;
 }
 return null;
}
for(const [hex,file,family] of cases){
 const cp=parseInt(hex,16),font=fontkit.openSync(path.join(__dirname,"..",file));
 assert(font.hasGlyphForCodePoint(cp),"Missing cmap: "+hex);
 const glyph=font.glyphForCodePoint(cp),notdef=font.getGlyph(0);
 const contour=glyph?.path?.toSVG()||"";
 const missing=notdef?.path?.toSVG()||"";
 const bounds=glyph?.path?.bbox;
 assert(glyph?.id>0,"Missing glyph ID: "+hex);
 assert(contour&&contour!==missing,"Missing or .notdef outline: "+hex);
 assert(bounds && bounds.maxX>bounds.minX && bounds.maxY>bounds.minY,
   "Empty glyph bounding box: "+hex);
 const r=entry(cp);
 assert(r,"Missing index: "+hex);
 const names=index.combinations[r[2]].map(id=>index.font_families[id].family);
 assert.equal(names[0],family,"Specialist font not preferred for "+hex);
 assert(audit.font_sources.some(f=>f.file===file&&f.family===family),
   "No audited font: "+file);
 console.log("U+"+hex,"trusted specialist:",family,"glyph:",glyph.id,
             "path bytes:",contour.length);
}
console.log("All eight smartphone specialist glyph outlines verified.");
