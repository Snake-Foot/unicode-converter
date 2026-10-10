"use strict";
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ROOT = path.resolve(__dirname, "..");
const index = JSON.parse(fs.readFileSync(path.join(ROOT, "data/unicode18_font_coverage_index.json")));
const all = JSON.parse(fs.readFileSync(path.join(ROOT, "data/unicode18_all_ranges.json")));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "data/unicode18_font_audit_manifest.json")));
const audit = JSON.parse(fs.readFileSync(path.join(ROOT, "data/unicode18_font_cmap_audit.json")));
const read = (intervals, codePoint) => {
  let lo = 0, hi = intervals.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1, r = intervals[mid];
    if (codePoint < r[0]) hi = mid - 1;
    else if (codePoint > r[1]) lo = mid + 1;
    else return r;
  }
  return null;
};
assert.strictEqual(index.unicode_version, "18.0.0");
assert.strictEqual(index.total_assigned_unicode18, 172808);
assert.strictEqual(all.counts.encoded_characters, 172808);
assert(index.font_families.length > 0, "No published fonts");
const valid = new Set(manifest.fonts.filter(f => f.site_served !== false).map(f => f.family));
for (const font of index.font_families) {
  assert(valid.has(font.family), "Unexpected non-published font: " + font.family);
  assert(font.sha256 && /^[0-9a-f]{64}$/.test(font.sha256));
}
for (const [name, intervals] of [["cmap", index.ranges], ["script", index.script_ranges]]) {
  for (let i = 0; i < intervals.length; i++) {
    const r = intervals[i];
    assert(Number.isInteger(r[0]) && Number.isInteger(r[1]) && r[0] <= r[1]);
    if (i) assert(intervals[i-1][1] < r[0], name + " range overlap");
  }
}
assert.strictEqual(read(index.script_ranges, 0x0041)[2], "Latn");
assert.strictEqual(read(index.script_ranges, 0x4E00)[2], "Hani");
assert.strictEqual(read(index.script_ranges, 0x1E900)[2], "Adlm");
assert.strictEqual(read(index.script_ranges, 0x3D000)[2], "Seal");
assert.strictEqual(read(index.script_ranges, 0x0378), null);
assert.strictEqual(read(index.ranges, 0x0378), null);
const samples = [0x0041,0x3042,0x4E00,0x1D0DF,0x1E900,0x3D000,0x10FFFF];
for (const cp of samples) {
  const matching = read(index.ranges, cp);
  if (!matching) continue;
  let mask = matching[2];
  assert(Number.isSafeInteger(mask) && mask > 0 && mask < 2 ** index.font_families.length);
}
let count = 0;
for (const r of index.ranges) count += (r[1]-r[0]+1);
assert.strictEqual(count,index.covered_by_available_site_local_fonts);
assert.strictEqual(audit.summary.unicode18_assigned_codepoints,172808);
console.log("Validated Unicode 18.0 font coverage index:",
  index.font_families.length, "font files;",
  index.covered_by_available_site_local_fonts, "assigned codepoints;",
  index.ranges.length, "compressed cmap intervals;");
