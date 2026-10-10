"use strict";

/*
 * Convert the verified local-font cmap audit into a compact, browser-readable
 * codepoint -> bitmask-of-published-font-families index.
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
const allowed = new Map(manifest.fonts.filter(f => f.site_served !== false)
  .filter(f => !!f.path && f.path.startsWith("fonts/"))
  .map(f => [f.family, f.path]));

const fonts = [], byFamily = new Map();
const bitmasks = new Uint32Array(0x110000);
const recordedHash = new Set();
for (const item of audit.font_sources) {
  if (!allowed.has(item.family) || item.file !== allowed.get(item.family)) continue;
  let id = byFamily.get(item.family);
  if (id === undefined) {
    id = fonts.length;
    if (id >= 30) throw new Error("Too many local CSS font families for bitmask");
    byFamily.set(item.family, id);
    fonts.push({family: item.family, file: item.file, sha256: item.file_sha256});
  }
  recordedHash.add(item.file_sha256);
  const flag = 1 << id;
  for (const record of Object.values(item.per_script)) {
    for (const r of record.codepoint_ranges) {
      const start = parseInt(r.start, 16), end = parseInt(r.end, 16);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end || end > 0x10FFFF) {
        throw new Error("Invalid cmap range in " + item.file);
      }
      for (let cp = start; cp <= end; cp++) bitmasks[cp] |= flag;
    }
  }
}
if (fonts.length === 0) throw new Error("No site-served audited fonts; index not written");
let covered = 0, ranges = [], start = -1, prev = 0, last = -1;
for (let cp = 0; cp <= 0x110000; cp++) {
  const mask = cp < 0x110000 ? bitmasks[cp] : 0;
  if (mask !== 0) covered++;
  if (mask === prev) continue;
  if (prev !== 0) ranges.push([start, cp - 1, prev]);
  if (mask !== 0) start = cp;
  prev = mask;
}
for (let i = 0; i < ranges.length; i++) {
  const [start, end, mask] = ranges[i];
  if (start < 0 || end < start || mask <= 0 || mask >= 2 ** fonts.length) {
    throw new Error("Malformed index range");
  }
  if (i && start <= ranges[i - 1][1]) throw new Error("Overlapping index ranges");
}
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
  schema_version: 1,
  unicode_version: audit.unicode_version,
  kind: "audited_site_local_font_cmap",
  disclaimer: "Actual font cmap mappings only: neither readable outlines nor colored emoji/shaping/browser rendering are guaranteed.",
  total_assigned_unicode18: 172808,
  covered_by_available_site_local_fonts: covered,
  font_families: fonts,
  script_ranges: scriptRanges,
  script_google_candidates: scriptGoogleCandidates,
  ranges
};
fs.writeFileSync(output, JSON.stringify(result) + "\n", "utf8");
console.log("Generated", path.relative(root, output),
  "fonts:", fonts.length, "covered assigned codepoints:", covered, "ranges:", ranges.length);
