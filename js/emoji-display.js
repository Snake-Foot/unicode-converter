/*
 * Unicode 18 emoji presentation is deliberately separate from the generic
 * monochrome font cmap fallback. The native system color-emoji font wins.
 *
 * Do not mistake all pictographs or mathematical symbols for emoji:
 * selection comes from Unicode 18's official emoji-data.txt.
 */
const nativeEmojiState = {promise:null,data:null};

function emojiPropertyContains(ranges,cp){
  if(!Array.isArray(ranges))return false;
  let lo=0,hi=ranges.length-1;
  while(lo<=hi){
    const mid=(lo+hi)>>>1,rg=ranges[mid];
    if(cp<rg[0])hi=mid-1;
    else if(cp>rg[1])lo=mid+1;
    else return true;
  }
  return false;
}
function getNativeEmojiProperties(){
  if(!nativeEmojiState.promise){
    nativeEmojiState.promise=fetch("./data/unicode18_emoji_presentation.json",{cache:"no-cache"})
      .then(response=>{
        if(!response.ok)throw Error("Emoji presentation data unavailable");
        return response.json();
      })
      .then(data=>{
        if(data.schema_version!==1||data.unicode_version!=="18.0.0"||
          !Array.isArray(data.emoji_presentation_ranges)||
          !Array.isArray(data.emoji_style_bases)||
          !Array.isArray(data.emoji_ranges))
          throw Error("Unexpected Unicode emoji property format");
        nativeEmojiState.data=data;
        return data;
      })
      .catch(error=>{
        console.warn("Native emoji classification unavailable. Keeping original font.",error);
        return null;
      });
  }
  return nativeEmojiState.promise;
}
/*
 * Rendering-only VS16 may be added for a text-default emoji. The original
 * codepoint is always retained in dataset and displayed as the U+ label.
 * The output span has a tooltip whenever this happens.
 *
 * ASCII keycap components (# * 0..9) keep normal text appearance; standalone
 * modifiers and regional indicators are handled only if Emoji_Presentation.
 */
async function getNativeEmojiRenderPlan(codePoint,character){
  if(!Number.isInteger(codePoint)||
     codePoint===0x23||codePoint===0x2A||
     (codePoint>=0x30&&codePoint<=0x39))return null;
  const data=await getNativeEmojiProperties();
  if(!data)return null;
  if(emojiPropertyContains(data.emoji_presentation_ranges,codePoint))
    return {character,codePoint,displayVariation:false};
  if(emojiPropertyContains(data.emoji_ranges,codePoint)&&
     emojiPropertyContains(data.emoji_style_bases,codePoint))
    return {character:character+"\uFE0F",codePoint,displayVariation:true};
  return null;
}
getNativeEmojiProperties();
