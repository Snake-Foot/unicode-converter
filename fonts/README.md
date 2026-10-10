# Unicode Converter — font library

The Unicode 18 font coverage builder recursively scans all supported files in `fonts/`. **Adding a font normally requires no manual CSS, JS or manifest edit.** On the next font-coverage GitHub Action it is inspected and added to the codepoint-level font index.

## Directory conventions

| Directory | Purpose |
|---|---|
| `han/` | Han ideographs, CJK fonts, GNU Unifont Upper |
| `seal/` | Unicode 18.0 Seal (small seal script) |
| `hieroglyphs/` | Egyptian hieroglyphs |
| `ancient/` | Cuneiform, Anatolian hieroglyphs, Linear A/B etc. |
| `scripts/` | All other alphabetic, syllabic and language-specific writing systems |
| `symbols/` | Symbols, mathematics and historic computing symbols |
| `music/` | Music symbols and attribution |
| `phonetics/` | IPA / phonetics and attribution |

## How to add a font

1. Place the actual **TTF, OTF, WOFF, or WOFF2** binary in the appropriate folder. Use the upstream original filename, preferably `*-Regular.*`. No ZIP or compressed `.gz` files.
2. Include the license/attribution file when required; avoid copying fonts with ambiguous redistribution terms.
3. Commit to main. The `Unicode 18 Font Coverage Build` action scans **all subdirectories**, reads font `cmap`, generates `data/unicode18_font_cmap_audit.json`, and constructs `data/unicode18_font_coverage_index.json`.
4. Test a codepoint using the Unicode → Character converter on iOS and Windows. Presence in a font `cmap` is **not** proof the glyph is visually correct or that advanced shaping works.

A font can cover several scripts, so **assignment is by exact character codepoint, not folder name**. When multiple verified files cover one character, an ordered fallback list is generated automatically. The web client loads only a matching font when requested using the `FontFace` API, rather than requesting all font files when the page opens.

## Quality-first selections for uploaded fonts

The latest 14 uploaded font binaries were moved from `fonts/` into `han/`, `ancient/`, `scripts/`, and `music/` without changing their bytes. The build-time ranker in `../scripts/build-unicode18-font-index.js` prefers **BabelStone Han for supplementary Han characters if its cmap contains the code point**, **Noto Serif Hentaigana** for Hentaigana, and the matching Noto specialist for other scripts (including Noto Znamenny Musical Notation and SignWriting). Unifont Upper stays last as a coverage fallback. It never assumes a font supports an entire Script property: ranking operates only on real cmap matches.

The site's existing Unicode 18 index is regenerated automatically by GitHub Actions when these files move. Source-level raster/outline, OpenType shaping, and Windows/iPhone browser rendering can still vary.

## Existing assets are preserved

All formerly root-level font binaries were moved without changing blob contents. The original `music/` and `phonetics/` folders, including their licenses, were preserved.

## Coverage limits

The build-time audit excludes unassigned, surrogate, control and private-use codepoints from the standard character tally. Emoji ZWJ sequences, regional-indicator flags, color rendering, GSUB/GPOS shaping and actual browser testing are separate matters. Current reports use Unicode 18.0 (172,808 encoded characters). Official UCD classification remains in `../data/unicode18_all_ranges.json`.

GNU Unifont Upper is a fallback for supplementary characters; prefer specialized higher-quality fonts whenever present.

GitHub Pages source: `../.github/workflows/font-coverage.yml` — publish is performed only if all tests pass.
