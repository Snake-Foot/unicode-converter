/* Unicode 18.0: audited local font coverage + lazy specialist fonts.
 * No font is marked as verified merely because it exists in a catalog.
 */
const unicodeCoverageState = {
  promise: null,
  data: null,
  familyLoads: new Map(),
  stylesheets: new Map()
};

function getUnicodeCoverageIndex() {
  if (!unicodeCoverageState.promise) {
    unicodeCoverageState.promise = fetch("./data/unicode18_font_coverage_index.json", {cache: "no-cache"})
      .then(response => {
        if (!response.ok) throw new Error("No published font coverage index");
        return response.json();
      })
      .then(data => {
        if (data.schema_version !== 1 ||
            data.unicode_version !== "18.0.0" ||
            !Array.isArray(data.ranges) ||
            !Array.isArray(data.font_families) ||
            !Array.isArray(data.script_ranges)) {
          throw new Error("Invalid font coverage index");
        }
        unicodeCoverageState.data = data;
        return data;
      })
      .catch(error => {
        console.warn("Font coverage index unavailable; using existing font fallback.", error);
        return null;
      });
  }
  return unicodeCoverageState.promise;
}

function unicodeRangeLookup(ranges, codePoint) {
  let low = 0, high = ranges.length - 1;
  while (low <= high) {
    const i = (low + high) >>> 1;
    const r = ranges[i];
    if (codePoint < r[0]) high = i - 1;
    else if (codePoint > r[1]) low = i + 1;
    else return r;
  }
  return null;
}

async function loadDeclaredUnicodeFont(family, character) {
  if (!document.fonts || !family) return false;
  // A separate promise is required for each glyph: a font may be Unicode-subsetted.
  try {
    const matches = await document.fonts.load('100px "' + family.replace(/"/g, "") + '"', character);
    if (matches.length === 0) return false;
    if (typeof glyphAnalysisCache !== "undefined") glyphAnalysisCache.clear();
    return true;
  } catch (error) {
    console.warn("Font load error for " + family, error);
    return false;
  }
}

async function ensureUnicodeGoogleFont(family) {
  if (!/^Noto (?:Sans|Serif) [\w \-]+$/.test(family)) return false;
  let ready = unicodeCoverageState.stylesheets.get(family);
  if (!ready) {
    ready = new Promise(resolve => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=" +
        encodeURIComponent(family).replace(/%20/g, "+") + "&display=swap";
      link.onload = () => resolve(true);
      link.onerror = () => resolve(false);
      document.head.appendChild(link);
    });
    unicodeCoverageState.stylesheets.set(family, ready);
  }
  // A network problem should not stall a conversion forever.
  return Promise.race([ready, sleep(5000).then(() => false)]);
}

function looksLikeAvailableUnicodeGlyph(character, family) {
  const cssFamily = '"' + family.replace(/"/g, "") + '", sans-serif';
  return !isRenderedBlank(character, cssFamily) &&
         !looksLikeMissingGlyph(character, cssFamily);
}

/*
 * Returns an explicitly loaded family or null. First test cmap-verified,
 * site-hosted fonts; then older font choices; finally optional remote
 * Noto candidates discovered via Unicode Script.
 * Font coverage is a hint until the actual browser passes a glyph test.
 */
async function selectUnicodeFont(codePoint, character) {
  const data = await Promise.race([
    getUnicodeCoverageIndex(),
    sleep(3200).then(() => null)
  ]);
  const legacy = getWebFontNames(codePoint);
  const tried = new Set();
  const checkFamily = async (family, dynamic = false) => {
    if (!family || tried.has(family)) return null;
    tried.add(family);
    if (dynamic && !(await ensureUnicodeGoogleFont(family))) return null;
    if (!(await loadDeclaredUnicodeFont(family, character))) return null;
    if (!looksLikeAvailableUnicodeGlyph(character, family)) return null;
    return family;
  };

  if (data) {
    const mapped = unicodeRangeLookup(data.ranges, codePoint);
    if (mapped) {
      const present = data.font_families.filter((font, index) =>
        ((mapped[2] >>> index) & 1) !== 0).map(font => font.family);
      const priority = [...present].sort((a,b) => {
        const ai = legacy.indexOf(a), bi = legacy.indexOf(b);
        return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
      });
      for (const name of priority) {
        const got = await checkFamily(name);
        if (got) return got;
      }
    }
  }
  // Legacy CSS includes locally defined and prelinked Google font families.
  for (const name of legacy) {
    const got = await checkFamily(name);
    if (got) return got;
  }
  if (data) {
    const sr = unicodeRangeLookup(data.script_ranges, codePoint);
    if (sr && sr[2] !== "Zyyy" && sr[2] !== "Zinh" && sr[2] !== "Zzzz") {
      const candidates = data.script_google_candidates[sr[2]] || [];
      for (const name of candidates.slice(0, 2)) {
        const got = await checkFamily(name, true);
        if (got) return got;
      }
    }
  }
  return null;
}

// Warm the index without blocking initial page paint. If not generated,
// the legacy font selection continues to work.
getUnicodeCoverageIndex();
