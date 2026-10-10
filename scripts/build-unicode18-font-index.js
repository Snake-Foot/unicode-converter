"use strict";

/*
 * Convert the verified local-font cmap audit into a compact, browser-readable
 * codepoint -> compact ranked lists of published font families.
 *
 * Source of truth: an actual fontkit characterSet read from local font files.
 * Never add research-only family names to this index.
 *
 * Run:
 *   node scripts/audit-unicode18-fonts.js
 *   node scripts/build-unicode18-font-index.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const audit = JSON.parse(fs.readFileSync(path.join(root, "data/unicode18_font_cmap_audit.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/unicode18_font_audit_manifest.json"), "utf8"));
const output = path.join(root, "data/unicode18_font_coverage_index.json");

if (audit.schema_version !== 1 || audit.unicode_version !== "18.0.0") {
  throw new Error("Unexpected audit format/version");
}
if (audit.summary.unicode18_assigned_codepoints !== 172808) {
  throw new Error("Unexpected Unicode 18.0 assigned count");
}
// The audit enumerates actual binaries under fonts/ recursively. No
// fixed 30-bit mask, manual manifest entry or full Unicode scan per font.
const actual = audit.font_sources.filter(x =>
  typeof x.file === "string" && x.file.startsWith("fonts/"));
const fonts = actual.map(f=>({
  family:f.family, file:f.file, sha256:f.file_sha256
}));
if (!fonts.length) throw new Error("No site font files audited");
if (fonts.length > 4096) throw new Error("Unexpected number of font files");

const uncovered = new Map();
for (let fontId=0; fontId<actual.length; fontId++) {
  const font = actual[fontId];
  for (const perScript of Object.values(font.per_script)) {
    for (const rg of perScript.codepoint_ranges) {
      const start=parseInt(rg.start,16),end=parseInt(rg.end,16);
      if (!Number.isInteger(start)||!Number.isInteger(end)||start>end||end>0x10FFFF)
        throw new Error("Invalid font cmap range "+font.file);
      for(let cp=start;cp<=end;cp++){
        let array=uncovered.get(cp);
        if(!array)uncovered.set(cp,array=[]);
        array.push(fontId);
      }
    }
  }
}

const explicitPreferred = {
 Hani:["Noto Sans CJK JP","Plangothic P1","Plangothic P2","GNU Unifont Upper"],
 Seal:["Kaiyuan Small Seal","LXGW Seal"],
 Egyp:["UniHieroglyphica","Egyptology Extended"],
 Xsux:["Noto Sans Cuneiform"],
 Lina:["Noto Sans Linear A"],
 Linb:["Noto Sans Linear B"],
 Hluw:["Noto Sans Anatolian Hieroglyphs"],
 Zyyy:["Noto Sans Symbols 2 Local","Noto Sans Symbols","Noto Sans Math","BabelStone Pseudographica","Noto Music"],
 Zinh:["Noto Sans Phonetics","Noto Sans Symbols 2 Local"],
 Latn:["Noto Sans Phonetics"],
 Tang:["Plangothic P2"],
 Kits:["Plangothic P2"],
 Sgnw:["Plangothic P2"]
};
function rankId(id,script,cp){
 const f=fonts[id], family=f.family, name=family.toLowerCase();
 const fixed=explicitPreferred[script]||[];
 const index=fixed.indexOf(family);
 if(index>=0) return index;
 if(script==="Hani" && cp>=0x20000 && /plangothic/i.test(family)) return 3;
 const scriptSpecific = specialCodeToName.get(script);
 if(scriptSpecific && scriptSpecific.some(v=>v===family)) return 9;
 if(/Unifont/i.test(family)) return 990;
 if(/Noto Sans CJK/i.test(family)) return 110;
 if(/Plangothic/i.test(family)) return 350;
 if(/Noto Sans Symbols 2/i.test(family)) return 450;
 if(/Noto Sans Symbols/i.test(family)) return 480;
 if(/Phonetics|Noto Music/i.test(family)) return 520;
 if(/fonts\/scripts\/|fonts\/ancient\/|fonts\/seal\//.test(f.file)) return 25;
 return 600;
}
const candidateCatalog=JSON.parse(fs.readFileSync(
 path.join(root,"data/unicode18_font_candidates_175.json"),"utf8"));
const specialCodeToName=new Map(candidateCatalog.scripts.map(s=>[
 s.script,s.font_candidates.map(c=>c.family)
]));
const lookupScript=new Map();
for(const sr of JSON.parse(fs.readFileSync(
path.join(root,"data/unicode18_all_ranges.json"),"utf8")).ranges){
  const start=parseInt(sr.start,16),end=parseInt(sr.end,16);
  for(let cp=start;cp<=end;cp++)if(uncovered.has(cp))lookupScript.set(cp,sr.script);
}

const combos=[[]], cache=new Map();
const ranges=[];
let covered=0, prior=-1, began=0;
function flush(end){
 if(prior>0) ranges.push([began,end,prior]);
}
for(let cp=0;cp<=0x110000;cp++){
 const available=uncovered.get(cp);
 let combo=0;
 if(available&&cp<0x110000){
   covered++;
   const script=lookupScript.get(cp);
   available.sort((a,b)=>rankId(a,script,cp)-rankId(b,script,cp)||a-b);
   const key=available.join(",");
   if(!cache.has(key)){
     cache.set(key,combos.length);
     combos.push([...available]);
   }
   combo=cache.get(key);
 }
 if(combo!==prior){
   if(prior!==-1)flush(cp-1);
   prior=combo;began=cp;
 }
}
if(covered!==audit.summary.cmap_covered_union)
 throw new Error("Cmap total mismatch; index "+covered+" audit "+audit.summary.cmap_covered_union);
const classification = JSON.parse(fs.readFileSync(path.join(root, "data/unicode18_all_ranges.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "data/unicode18_font_candidates_175.json"), "utf8"));
if (classification.unicode_version !== "18.0.0" || catalog.unicode_version !== "18.0.0" || catalog.scripts.length !== 175) {
  throw new Error("Unicode catalog mismatch");
}
const unencoded = new Set(["Cn", "Co", "Cs", "Cc"]);
const scriptRanges = [];
for (const r of classification.ranges) {
  if (unencoded.has(r.category)) continue;
  const start = parseInt(r.start, 16), end = parseInt(r.end, 16);
  const previous = scriptRanges[scriptRanges.length - 1];
  if (previous && previous[2] === r.script && previous[1] + 1 === start) {
    previous[1] = end;
  } else scriptRanges.push([start, end, r.script]);
}
const scriptGoogleCandidates = {};
for (const s of catalog.scripts) {
  const names = s.font_candidates.filter(candidate =>
    candidate.source_kind === "noto_fonts_family_directory" ||
    (candidate.source_kind === "repository_exists" && candidate.family.startsWith("Noto ")) ||
    (candidate.source_kind === "archived_source_repository" && candidate.family.startsWith("Noto "))
  ).map(candidate => candidate.family).filter(name => /^Noto (?:Sans|Serif) [\w \-]+$/.test(name));
  if (s.script === "Hani" || s.script === "Hira" || s.script === "Kana" || s.script === "Bopo")
    names.unshift("Noto Sans JP");
  if (s.script === "Hang") names.unshift("Noto Sans KR");
  if (names.length) scriptGoogleCandidates[s.script] = [...new Set(names)].slice(0, 3);
}

const result = {
  schema_version: 2,
  unicode_version: audit.unicode_version,
  kind: "audited_site_local_font_cmap",
  disclaimer: "Actual font cmap mappings only: neither readable outlines nor colored emoji/shaping/browser rendering are guaranteed.",
  total_assigned_unicode18: 172808,
  covered_by_available_site_local_fonts: covered,
  font_families: fonts,
  combinations: combos,
  script_ranges: scriptRanges,
  script_google_candidates: scriptGoogleCandidates,
  ranges
};
fs.writeFileSync(output, JSON.stringify(result) + "\n", "utf8");
console.log("Generated", path.relative(root, output),
  "fonts:", fonts.length, "covered assigned codepoints:", covered, "ranges:", ranges.length);
