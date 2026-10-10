"use strict";
/*
 * CI regression: 14 freshly added specialist fonts are stored in the proper
 * folders, included in the verified cmap index, and ranked before generic
 * fallback fonts ONLY for characters they actually contain.
 */
const fs=require("node:fs");
const assert=require("node:assert/strict");
const index=JSON.parse(fs.readFileSync("data/unicode18_font_coverage_index.json","utf8"));
const audit=JSON.parse(fs.readFileSync("data/unicode18_font_cmap_audit.json","utf8"));
assert.equal(index.schema_version,2);
const arrivals=[
 ["fonts/han/BabelStoneHan.woff2","BabelStone Han"],
 ["fonts/ancient/NotoSansCypriot-Regular.ttf","Noto Sans Cypriot"],
 ["fonts/ancient/NotoSansMeroitic-Regular.ttf","Noto Sans Meroitic"],
 ["fonts/scripts/NotoSansDeseret-Regular.ttf","Noto Sans Deseret"],
 ["fonts/scripts/NotoSansGunjalaGondi-Regular.ttf","Noto Sans Gunjala Gondi"],
 ["fonts/scripts/NotoSansKaithi-Regular.ttf","Noto Sans Kaithi"],
 ["fonts/scripts/NotoSansMro-Regular.ttf","Noto Sans Mro"],
 ["fonts/scripts/NotoSansNewa-Regular.ttf","Noto Sans Newa"],
 ["fonts/scripts/NotoSansNushu-Regular.ttf","Noto Sans Nushu"],
 ["fonts/scripts/NotoSansSignWriting-Regular.ttf","Noto Sans SignWriting"],
 ["fonts/scripts/NotoSerifHentaigana-Regular.ttf","Noto Serif Hentaigana"],
 ["fonts/scripts/NotoSerifSinhala-Regular.ttf","Noto Serif Sinhala"],
 ["fonts/scripts/NotoSerifTodhri-Regular.ttf","Noto Serif Todhri"],
 ["fonts/music/NotoZnamennyMusicalNotation-Regular.ttf","Noto Znamenny Musical Notation"]
];
for(const [file,name] of arrivals){
 assert(fs.existsSync(file), "Moved binary is missing: "+file);
 assert(index.font_families.some(x=>x.file===file&&x.family===name),
    "Font not indexed under expected name: "+file);
 assert(audit.font_sources.some(x=>x.file===file&&x.family===name),
    "Actual cmap audit missing: "+file);
}
const locate=(ranges,cp)=>{
 let l=0,h=ranges.length-1;
 while(l<=h){const m=(l+h)>>>1,r=ranges[m];
  if(cp<r[0])h=m-1; else if(cp>r[1])l=m+1; else return r;}
 return null;
};
function getPriority(hex){
 const cp=parseInt(hex,16),row=locate(index.ranges,cp);
 return row?index.combinations[row[2]].map(id=>index.font_families[id].family):[];
}
const cases=[
 ["2ECF4","BabelStone Han"],["29C09","BabelStone Han"],
 ["2A040","BabelStone Han"],["20478","BabelStone Han"],
 ["1081F","Noto Sans Cypriot"],
 ["109EB","Noto Sans Meroitic"],
 ["11D6B","Noto Sans Gunjala Gondi"],
 ["110C0","Noto Sans Kaithi"],
 ["1610E","Noto Sans Gurung Khema"], // unavailable: only reported, not required
 ["1D9BC","Noto Sans SignWriting"],
 ["1B0C9","Noto Serif Hentaigana"],
 ["1B09D","Noto Serif Hentaigana"],
 ["16A51","Noto Sans Mro"],
 ["11400","Noto Sans Newa"],
 ["105E5","Noto Serif Todhri"],
 ["111E5","Noto Serif Sinhala"],
 ["10408","Noto Sans Deseret"],
 ["1B177","Noto Sans Nushu"],
 ["1CFBA","Noto Znamenny Musical Notation"]
];
let verified=0;
for(const [hex,desired] of cases){
 const names=getPriority(hex);
 const present=names.includes(desired);
 const assigned=names[0]||"(no site font)";
 console.log("U+"+hex+":",assigned,"| specialist cmap present:",present,
             "| candidates:",names.slice(0,4).join(" > "));
 if(present){
   assert.equal(names[0],desired,"Specialist not prioritized for U+"+hex);
   verified++;
 }
}
assert(verified>=10,"Too few reported codepoints matched new specialist fonts: "+verified);
// A missing typeface never becomes a fake high-priority mapping.
const sidetic=getPriority("1094F");
assert(!sidetic.includes("Noto Sans Sidetic"),"Uninstalled Sidetic font invented");
console.log("Verified",verified,"specialist codepoint assignments.");
// Check all six reported PC Han glyphs in the compact renamed WOFF2 subset.
const fontkit=require("@cantoo/fontkit");
const subsetFile="fonts/han/YKTSmoothHanB.woff2";
assert(fs.existsSync(subsetFile),"Six-glyph smooth Han subset not distributed");
const hanFont=fontkit.openSync(subsetFile);
const notdef=hanFont.getGlyph(0).path.toSVG();
for(const cp of ["29C09","20478","2076F","207B8","29D27","27971"]){
 const num=parseInt(cp,16),order=getPriority(cp);
 assert.equal(order[0],"YKT Smooth Han B","Smooth Han glyph not prioritized: U+"+cp);
 assert(hanFont.hasGlyphForCodePoint(num),"Subset cmap missing U+"+cp);
 const g=hanFont.glyphForCodePoint(num);
 assert(g.id>0&&g.path.toSVG()&&g.path.toSVG()!==notdef,
   "Subset glyph is blank or .notdef at U+"+cp);
 console.log("Verified smooth Han U+"+cp,"glyph ID:",g.id);
}
console.log("All six smooth Han glyphs audited and ranked first.");

