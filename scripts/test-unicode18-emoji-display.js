"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const data=JSON.parse(fs.readFileSync(path.join(root,"data/unicode18_emoji_presentation.json"),"utf8"));
assert.equal(data.unicode_version,"18.0.0");
assert.equal(data.schema_version,1);

function includes(ranges,cp){
  let lo=0,hi=ranges.length-1;
  while(lo<=hi){
    const m=(lo+hi)>>>1,rg=ranges[m];
    if(cp<rg[0])hi=m-1;
    else if(cp>rg[1])lo=m+1;
    else return true;
  }
  return false;
}
for(const key of ["emoji_ranges","emoji_presentation_ranges","emoji_style_bases"]){
  const list=data[key];
  assert(list.length>0,"Missing "+key);
  for(let i=0;i<list.length;i++){
    assert(list[i][0]>=0&&list[i][1]<=0x10FFFF&&list[i][0]<=list[i][1]);
    if(i)assert(list[i-1][1]<list[i][0],key+" overlapping ranges");
  }
}
assert(includes(data.emoji_presentation_ranges,0x1F600));
assert(includes(data.emoji_style_bases,0x2764));
assert(!includes(data.emoji_presentation_ranges,0x2764));

const script=fs.readFileSync(path.join(root,"js/emoji-display.js"),"utf8")+
"\nglobalThis.__emojiTest={getNativeEmojiRenderPlan,emojiPropertyContains};";
const context={
  fetch:async()=>({ok:true,json:async()=>data}),
  console
};
vm.runInNewContext(script,context,{filename:"emoji-display.js"});
(async()=>{
  const fn=context.__emojiTest.getNativeEmojiRenderPlan;
  const normal=async cp=>fn(cp,String.fromCodePoint(cp));
  assert.equal((await normal(0x1F600)).character,"\u{1F600}");
  assert.equal((await normal(0x2764)).character,"\u2764\uFE0F");
  assert.equal((await normal(0x2600)).character,"\u2600\uFE0F");
  assert.equal((await normal(0x1F1EF)).character,"\u{1F1EF}");
  for(const cp of [0x23,0x2A,0x30,0x39,0x41,0x1D11E,0x3D000])
    assert.equal(await normal(cp),null,"Should not turn ordinary text into emoji: "+cp);
  console.log("Unicode 18 native color emoji property checks passed");
})().catch(error=>{console.error(error);process.exitCode=1});
