# Unicode 18.0 — font coverage research (2026-10-10)

## What exists now

Implementation: the fonts were reorganized under [`../fonts/`](../fonts/README.md); `scripts/audit-unicode18-fonts.js` recursively discovers new binaries and `scripts/build-unicode18-font-index.js` produces a version-2 compact index containing exact codepoint-to-ranked-font-lists, with no 30-font limitation. The web page uses `FontFace` to load one needed file at a time. The daily SVG generator continues preserving current/next daily entries and now discovers the same font files.

| File | Meaning |
|---|---|
| [unicode18_all_ranges.json](unicode18_all_ranges.json) | Exhaustive **Script + Block + General_Category** partition of U+0000..U+10FFFF. Source of truth for Unicode classification. |
| [unicode18_scripts_175.json](unicode18_scripts_175.json) | 175 writing systems with associated Unicode blocks (do not confuse blocks with the exact Script property). |
| [unicode18_font_candidates_175.json](unicode18_font_candidates_175.json) | **All 175 writing systems**, count of Unicode 18.0 encoded code points per script, public font leads, exact source URLs, and evidence/verification statuses. |
| [unicode18_font_candidates_175.csv](unicode18_font_candidates_175.csv) | Spreadsheet-friendly export of the 175-script catalog. |
| [unicode18_font_source_directory.json](unicode18_font_source_directory.json) | 226 distinct Noto Fonts family directory names found in upstream hinted/unhinted/ttf + other specialist font publisher sources. |
| [unicode18_font_special_script_values.json](unicode18_font_special_script_values.json) | Common (Zyyy), Inherited (Zinh), Unknown (Zzzz): critical for mathematical symbols, emoji, punctuation, combining marks and all non-writing-system Unicode code points. |
| [unicode18_font_audit_manifest.json](unicode18_font_audit_manifest.json) | Local font paths from the site and its npm font dependency. Missing inputs are reported honestly. |
| [../scripts/audit-unicode18-fonts.js](../scripts/audit-unicode18-fonts.js) | Build-time **real cmap audit** of all fonts recursively found under fonts/ (TTF/OTF/WOFF/WOFF2). Runs offline against the pinned Unicode 18.0 data. |

## Verified classification counts

- 175 writing-system Script values with **162,902** encoded characters.
- Common (Zyyy): **9,211** encoded characters.
- Inherited (Zinh): **695** encoded characters.
- Combined: **172,808** encoded characters, equal to Unicode 18.0's official total.
- Full Unicode code point universe: **1,114,112** positions.
- The code point files include formatting/combining characters that are not individually visible.

## Evidence levels: DON'T conflate these

1. **Unicode encoded**: Unicode explicitly assigns this code point.
2. **Source discovered**: a font family directory, specialized source project, or a font release page exists. This is what the candidate catalog currently records.
3. **Cmap confirmed**: inspecting a *specific font binary* finds a codepoint-to-glyph mapping; **published in unicode18_font_cmap_audit.json** for the installed site fonts.
4. **Renderable**: the glyph has a valid outline/color layer and can be shaped with surrounding text or emoji sequences.
5. **Browser-tested**: actual visual appearance works on Chrome/Firefox/Safari, Windows/macOS/iOS/Android, possibly with different font technologies.

The published 175-script candidates catalog does **not** claim levels 3–5. A published source does not guarantee 100% codepoint coverage. The "preferred_candidate" field is a **research ordering**, NOT an audited recommendation.

## Source gaps at research date

No dedicated, verified usable specialist font source was identified here for:

- Garay (Gara)
- Jurchen (Jurc)
- Sidetic (Sidt)
- Tai Yo (Tayo)
- Tolong Siki (Tols)
- Tulu Tigalari (Tutg)

This **does not mean fonts do not exist**. GNU Unifont Upper 18.0.01 is now installed and its cmap included in the generated per-codepoint index; it does not imply full glyph quality.

Special cases: the Proto-Cuneiform (Pcun) candidate "PCSL" is **known through a proposal document only**. Do not treat it as a verified redistributable binary. LXGW Seal is intentionally partial, and Kaiyuan Small Seal is now audited as cmap-covering all 11,328 Seal code points (glyph accuracy and browser rendering still need visual testing). Existing Noto Fonts repositories predate some new Unicode 18 scripts.

## Audit local fonts

From the root of this repository with Node.js and installed packages:

    npm install
    node scripts/audit-unicode18-fonts.js

Optionally pass additional downloaded licensed font binaries/folders:

    node scripts/audit-unicode18-fonts.js path/to/specialist-font.ttf path/to/font-directory/

This writes:

    data/unicode18_font_cmap_audit.json

The audit checks the full Unicode 18 classification partition and encoded count, hashes every successfully read binary, enumerates actual fontkit characterSet/cmap entries, and outputs:
- Per-font cmap-covered Unicode codepoint ranges (grouped by exact Script property)
- Per-script assignment counts, coverage by the **union** of inspected local fonts, and codepoint gaps
- Ranked font candidates by the number of mapped codepoints, with source filenames
- Missing font paths and font parsing failures

The audit does not download fonts or change daily.json. The GitHub Actions workflow now publishes a verified cmap index. As of 2026-10-10, **31 site font binaries** cover **168,628 of 172,808 code points (97.58%)** by cmap, leaving **4,180** unmatched in those exact binaries. Display appearance and shaping still need browser validation.

### What the audit still cannot prove

A cmap entry is not proof of a readable glyph: font tables may include blanks, damaged outlines, color glyphs, context-dependent marks, or require GSUB/GPOS shaping. A separate browser rendering/shaping audit is needed, especially for emoji ZWJ sequences, complex Brahmic scripts, and new Unicode 18.0 fonts. Copyright and each font's redistribution license must be verified **before** bundling a font into the site.

## Reproducibility / official sources

- https://www.unicode.org/Public/18.0.0/ucd/Scripts.txt
- https://www.unicode.org/Public/18.0.0/ucd/Blocks.txt
- https://www.unicode.org/Public/18.0.0/ucd/extracted/DerivedGeneralCategory.txt
- https://www.unicode.org/Public/18.0.0/ucd/PropertyValueAliases.txt
- https://github.com/notofonts/noto-fonts
- https://github.com/notofonts/noto-cjk
- https://github.com/googlefonts/noto-emoji
- https://unifoundry.com/pub/unifont/unifont-18.0.01/font-builds/
- SIL and other specialist publishers: exact URLs in the JSON catalog.

Version pinning is intentional. In September 2027, regenerate against official 19.0.0 UCD files and independently re-audit each font binary.
