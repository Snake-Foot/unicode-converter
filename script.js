/* =========================================
   DOM
========================================= */

const charInput =
  document.getElementById("charInput");

const unicodeInput =
  document.getElementById("unicodeInput");

const unicodeOutput =
  document.getElementById("unicodeOutput");

const charOutput =
  document.getElementById("charOutput");

const clearChar =
  document.getElementById("clearChar");

const clearUnicode =
  document.getElementById("clearUnicode");

const backUnicode =
  document.getElementById("backUnicode");

const dailyCharacter =
  document.getElementById("dailyCharacter");

const dailyCode =
  document.getElementById("dailyCode");

const dailyResearchLink =
  document.getElementById("dailyResearchLink");


/* =========================================
   Helper
========================================= */

function inRange(
  codePoint,
  start,
  end
) {
  return (
    codePoint >= start &&
    codePoint <= end
  );
}


/* =========================================
   Unicode → Font class
========================================= */

function getFontClass(
  codePoint
) {

  /* Kawi */

  if (
    inRange(
      codePoint,
      0x11F00,
      0x11F5F
    )
  ) {
    return "font-kawi";
  }


  /* Toto */

  if (
    inRange(
      codePoint,
      0x1E290,
      0x1E2BF
    )
  ) {
    return "font-toto";
  }


  /* Tangut Extended */

  if (
    inRange(
      codePoint,
      0x187F8,
      0x187FF
    )
    ||
    inRange(
      codePoint,
      0x18D09,
      0x18D1E
    )
    ||
    inRange(
      codePoint,
      0x18D80,
      0x18DFF
    )
  ) {
    return "font-tangut-extended";
  }


  /* Tangut iteration mark */

  if (
    codePoint === 0x16FE0
  ) {
    return "font-tangut";
  }


  /* Tangut + Components */

  if (
    inRange(
      codePoint,
      0x17000,
      0x187F7
    )
    ||
    inRange(
      codePoint,
      0x18800,
      0x18AFF
    )
    ||
    inRange(
      codePoint,
      0x18D00,
      0x18D08
    )
  ) {
    return "font-tangut";
  }


  /* Nüshu iteration mark */

  if (
    codePoint === 0x16FE1
  ) {
    return "font-nushu";
  }


  /* Nüshu */

  if (
    inRange(
      codePoint,
      0x1B170,
      0x1B2FF
    )
  ) {
    return "font-nushu";
  }


  /* Khitan */

  if (
    inRange(
      codePoint,
      0x18B00,
      0x18CFF
    )
  ) {
    return "font-khitan";
  }


  /* Cuneiform */

  if (
    inRange(
      codePoint,
      0x12000,
      0x1254F
    )
  ) {
    return "font-cuneiform";
  }


  /*
    Egyptian Hieroglyphs Extended-A

    UniHieroglyphicaを
    最優先で使用する。
  */

  if (
    inRange(
      codePoint,
      0x13460,
      0x143FF
    )
  ) {
    return "font-egyptian-extended";
  }


  /* Egyptian Hieroglyphs */

  if (
    inRange(
      codePoint,
      0x13000,
      0x1345F
    )
  ) {
    return "font-egyptian";
  }


  /* Anatolian Hieroglyphs */

  if (
    inRange(
      codePoint,
      0x14400,
      0x1467F
    )
  ) {
    return "font-anatolian";
  }


  /* Tangsa */

  if (
    inRange(
      codePoint,
      0x16A70,
      0x16ACF
    )
  ) {
    return "font-tangsa";
  }


  /* Nandinagari */

  if (
    inRange(
      codePoint,
      0x119A0,
      0x119FF
    )
  ) {
    return "font-nandinagari";
  }


  /*
    Byzantine Musical Symbols
    Musical Symbols
    Ancient Greek Musical Notation
  */

  if (
    inRange(
      codePoint,
      0x1D000,
      0x1D24F
    )
  ) {
    return "font-music";
  }


  /* SignWriting */

  if (
    inRange(
      codePoint,
      0x1D800,
      0x1DAAF
    )
  ) {
    return "font-signwriting";
  }


  /* Indic Siyaq Numbers */

  if (
    inRange(
      codePoint,
      0x1EC70,
      0x1ECBF
    )
  ) {
    return "font-indic-siyaq";
  }


  /* Arabic Mathematical Alphabetic Symbols */

  if (
    inRange(
      codePoint,
      0x1EE00,
      0x1EEFF
    )
  ) {
    return "font-math";
  }


  /*
    Symbols for Legacy Computing Supplement

    BabelStone Pseudographicaを優先。
  */

  if (
    inRange(
      codePoint,
      0x1CC00,
      0x1CEBF
    )
  ) {
    return "font-legacy-supp";
  }


  /*
    Noto Sans Symbols 2 Local

    Phaistos Disc
  */

  if (
    inRange(
      codePoint,
      0x101D0,
      0x101FF
    )
  ) {
    return "font-symbols2";
  }


  /* Rumi Numeral Symbols */

  if (
    inRange(
      codePoint,
      0x10E60,
      0x10E7F
    )
  ) {
    return "font-symbols2";
  }


  /* Kaktovik Numerals */

  if (
    inRange(
      codePoint,
      0x1D2C0,
      0x1D2DF
    )
  ) {
    return "font-symbols2";
  }


  /*
    Miscellaneous Symbols
    and Pictographs
  */

  if (
    inRange(
      codePoint,
      0x1F500,
      0x1F5FF
    )
  ) {
    return "font-symbols2";
  }


  /* Ornamental Dingbats */

  if (
    inRange(
      codePoint,
      0x1F650,
      0x1F67F
    )
  ) {
    return "font-symbols2";
  }


  /* Geometric Shapes Extended */

  if (
    inRange(
      codePoint,
      0x1F780,
      0x1F7FF
    )
  ) {
    return "font-symbols2";
  }


  /* Supplemental Arrows-C */

  if (
    inRange(
      codePoint,
      0x1F800,
      0x1F8FF
    )
  ) {
    return "font-symbols2";
  }


  /* Symbols for Legacy Computing */

  if (
    inRange(
      codePoint,
      0x1FB00,
      0x1FBFF
    )
  ) {
    return "font-symbols2";
  }


  /*
    CJK Compatibility Ideographs

    今まで範囲外だったFA7Aなど。
  */

  if (
    inRange(
      codePoint,
      0xF900,
      0xFAFF
    )
  ) {
    return "font-cjk-ext";
  }


  /* CJK Extensions */

  if (
    inRange(
      codePoint,
      0x20000,
      0x2EE5F
    )
    ||
    inRange(
      codePoint,
      0x2F800,
      0x2FA1F
    )
    ||
    inRange(
      codePoint,
      0x30000,
      0x3347F
    )
  ) {
    return "font-cjk-ext";
  }


  return "font-normal";
}


/* =========================================
   Font names
========================================= */

function getWebFontNames(
  codePoint
) {

  switch (
    getFontClass(
      codePoint
    )
  ) {

    case "font-kawi":
      return [
        "Noto Sans Kawi"
      ];


    case "font-toto":
      return [
        "Noto Serif Toto"
      ];


    case "font-tangut":
      return [
        "Noto Serif Tangut"
      ];


    case "font-tangut-extended":
      return [
        "Tangut Extended",
        "Noto Serif Tangut"
      ];


    case "font-nushu":
      return [
        "Noto Sans Nushu"
      ];


    case "font-khitan":
      return [
        "Noto Serif Khitan Small Script"
      ];


    case "font-cuneiform":
      return [
        "Noto Sans Cuneiform"
      ];


    case "font-egyptian":
      return [
        "Noto Sans Egyptian Hieroglyphs"
      ];


    /*
      新フォントを最優先。
      Egyptology Extendedは
      フォールバックとして残す。
    */

    case "font-egyptian-extended":
      return [
        "UniHieroglyphica",
        "Egyptology Extended",
        "Noto Sans Egyptian Hieroglyphs"
      ];


    case "font-anatolian":
      return [
        "Noto Sans Anatolian Hieroglyphs"
      ];


    case "font-tangsa":
      return [
        "Noto Sans Tangsa"
      ];


    case "font-nandinagari":
      return [
        "Noto Sans Nandinagari"
      ];


    case "font-music":
      return [
        "Noto Music"
      ];


    case "font-signwriting":
      return [
        "Noto Sans SignWriting"
      ];


    /*
      ローカル最新版を最優先。
    */

    case "font-symbols2":
      return [
        "Noto Sans Symbols 2 Local",
        "Noto Sans Symbols 2"
      ];


    /*
      Legacy Supplement専用。
    */

    case "font-legacy-supp":
      return [
        "BabelStone Pseudographica",
        "Noto Sans Symbols 2 Local",
        "Noto Sans Symbols 2"
      ];


    case "font-math":
      return [
        "Noto Sans Math"
      ];


    case "font-indic-siyaq":
      return [
        "Noto Sans Indic Siyaq Numbers"
      ];


    case "font-cjk-ext":
      return [
        "Plangothic P1",
        "Plangothic P2",
        "BabelStone Han"
      ];


    default:
      return [];
  }
}


/* =========================================
   Timing
========================================= */

function sleep(
  milliseconds
) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}


function yieldToBrowser() {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        0
      );
    }
  );
}


/* =========================================
   Font loading
========================================= */

async function waitForCharacterFont(
  codePoint,
  character
) {

  const fontNames =
    getWebFontNames(
      codePoint
    );


  if (
    fontNames.length === 0
  ) {
    return;
  }


  if (
    !document.fonts
  ) {

    await sleep(
      800
    );

    return;
  }


  try {

    const loads =
      fontNames.map(
        (fontName) => {

          return document.fonts.load(
            `100px "${fontName}"`,
            character
          );

        }
      );


    await Promise.race(
      [
        Promise.allSettled(
          loads
        ),

        sleep(
          6000
        )
      ]
    );

  } catch (
    error
  ) {

    console.warn(
      "Font loading failed:",
      error
    );

  }
}


/* =========================================
   Invisible characters
========================================= */

const knownInvisibleCodePoints =
  new Set([
    0x115F,
    0x1160,
    0x2800,
    0x3164,
    0xFFA0
  ]);


function isInvisibleCharacter(
  codePoint,
  character
) {

  if (
    knownInvisibleCodePoints.has(
      codePoint
    )
  ) {
    return true;
  }


  try {

    return (
      /\p{Default_Ignorable_Code_Point}/u
        .test(
          character
        )
    );

  } catch (
    error
  ) {

    console.warn(
      "Default_Ignorable check unavailable:",
      error
    );


    return false;
  }
}


/* =========================================
   Canvas glyph analysis
========================================= */

const glyphCanvas =
  document.createElement(
    "canvas"
  );


glyphCanvas.width =
  280;


glyphCanvas.height =
  280;


const glyphContext =
  glyphCanvas.getContext(
    "2d",
    {
      willReadFrequently:
        true
    }
  );


const glyphAnalysisCache =
  new Map();


function analyseGlyphPixels(
  character,
  fontFamily,
  fontSize = 120
) {

  const cacheKey =
    character
    +
    "|"
    +
    fontFamily
    +
    "|"
    +
    fontSize;


  if (
    glyphAnalysisCache.has(
      cacheKey
    )
  ) {

    return glyphAnalysisCache.get(
      cacheKey
    );
  }


  const width =
    glyphCanvas.width;


  const height =
    glyphCanvas.height;


  glyphContext.clearRect(
    0,
    0,
    width,
    height
  );


  glyphContext.save();


  glyphContext.fillStyle =
    "#000";


  glyphContext.textBaseline =
    "alphabetic";


  glyphContext.font =
    `${fontSize}px ${fontFamily}`;


  glyphContext.fillText(
    character,
    50,
    190
  );


  glyphContext.restore();


  const imageData =
    glyphContext.getImageData(
      0,
      0,
      width,
      height
    );


  const data =
    imageData.data;


  let inkPixels =
    0;


  let minX =
    width;


  let minY =
    height;


  let maxX =
    -1;


  let maxY =
    -1;


  let hash =
    2166136261;


  for (
    let y = 0;
    y < height;
    y++
  ) {

    for (
      let x = 0;
      x < width;
      x++
    ) {

      const alpha =
        data[
          (
            y *
            width +
            x
          )
          *
          4
          +
          3
        ];


      if (
        alpha > 8
      ) {

        inkPixels++;


        if (
          x < minX
        ) {
          minX = x;
        }


        if (
          x > maxX
        ) {
          maxX = x;
        }


        if (
          y < minY
        ) {
          minY = y;
        }


        if (
          y > maxY
        ) {
          maxY = y;
        }
      }


      hash ^=
        alpha;


      hash =
        Math.imul(
          hash,
          16777619
        );
    }
  }


  let result;


  if (
    inkPixels === 0
  ) {

    result = {
      inkPixels:
        0,

      width:
        0,

      height:
        0,

      hash:
        hash >>> 0
    };

  } else {

    result = {
      inkPixels,

      width:
        maxX -
        minX +
        1,

      height:
        maxY -
        minY +
        1,

      hash:
        hash >>> 0
    };
  }


  glyphAnalysisCache.set(
    cacheKey,
    result
  );


  /*
    キャッシュ肥大化防止
  */

  if (
    glyphAnalysisCache.size >
    2000
  ) {

    const firstKey =
      glyphAnalysisCache
        .keys()
        .next()
        .value;


    glyphAnalysisCache.delete(
      firstKey
    );
  }


  return result;
}


/* =========================================
   Blank detection
========================================= */

function isRenderedBlank(
  character,
  fontFamily
) {

  const analysis =
    analyseGlyphPixels(
      character,
      fontFamily
    );


  return (
    analysis.inkPixels ===
    0
  );
}


/* =========================================
   Missing glyph detection
========================================= */

function sameGlyphSignature(
  first,
  second
) {

  if (
    first.inkPixels === 0
    ||
    second.inkPixels === 0
  ) {
    return false;
  }


  return (
    first.hash ===
      second.hash
    &&
    first.width ===
      second.width
    &&
    first.height ===
      second.height
  );
}


function looksLikeMissingGlyph(
  character,
  fontFamily
) {

  const target =
    analyseGlyphPixels(
      character,
      fontFamily
    );


  if (
    target.inkPixels === 0
  ) {
    return false;
  }


  const missingA =
    analyseGlyphPixels(
      String.fromCodePoint(
        0x0378
      ),
      fontFamily
    );


  const missingB =
    analyseGlyphPixels(
      String.fromCodePoint(
        0x10FFFF
      ),
      fontFamily
    );


  return (
    sameGlyphSignature(
      target,
      missingA
    )
    ||
    sameGlyphSignature(
      target,
      missingB
    )
  );
}


/* =========================================
   Egyptian Extended-A auto scaling
========================================= */

function getGlyphScaleFactor(
  codePoint,
  character,
  fontFamily
) {

  /*
    Egyptian Extended-Aだけ
    自動補正。
  */

  if (
    !inRange(
      codePoint,
      0x13460,
      0x143FF
    )
  ) {
    return 1;
  }


  const analysis =
    analyseGlyphPixels(
      character,
      fontFamily,
      120
    );


  if (
    analysis.inkPixels === 0
  ) {
    return 1;
  }


  const largestSide =
    Math.max(
      analysis.width,
      analysis.height
    );


  /*
    UniHieroglyphicaで
    最初から正常サイズなら
    補正しない。
  */

  if (
    largestSide >= 62
  ) {
    return 1;
  }


  const scale =
    82 /
    Math.max(
      largestSide,
      1
    );


  return Math.min(
    14,
    Math.max(
      1,
      scale
    )
  );
}


function applyGlyphScale(
  wrapper,
  inner,
  codePoint,
  character
) {

  const fontFamily =
    getComputedStyle(
      inner
    )
    .fontFamily;


  const scale =
    getGlyphScaleFactor(
      codePoint,
      character,
      fontFamily
    );


  if (
    scale <= 1.05
  ) {
    return;
  }


  inner.style.transform =
    `scale(${scale})`;


  inner.style.transformOrigin =
    "center center";


  /*
    巨大な縦余白を
    作らないよう固定。
  */

  wrapper.style.minWidth =
    "1.45em";


  wrapper.style.minHeight =
    "1.55em";


  wrapper.style.marginLeft =
    "0.16em";


  wrapper.style.marginRight =
    "0.16em";


  wrapper.style.overflow =
    "visible";
}


function applyDailyGlyphScale(
  inner,
  codePoint,
  character
) {

  const fontFamily =
    getComputedStyle(
      inner
    )
    .fontFamily;


  const scale =
    getGlyphScaleFactor(
      codePoint,
      character,
      fontFamily
    );


  if (
    scale <= 1.05
  ) {
    return;
  }


  inner.style.transform =
    `scale(${Math.min(
      8,
      scale
    )})`;


  inner.style.transformOrigin =
    "center center";
}


/* =========================================
   Status label
========================================= */

function makeStatusSpan(
  text
) {

  const span =
    document.createElement(
      "span"
    );


  span.className =
    "character-status";


  span.textContent =
    text;


  return span;
}


/* =========================================
   Character → Unicode
========================================= */

function convertCharacters() {

  const text =
    charInput.value;


  if (
    text.length === 0
  ) {

    unicodeOutput.textContent =
      "";


    return;
  }


  unicodeOutput.textContent =
    Array.from(
      text
    )
    .map(
      (character) => {

        return (
          "U+"
          +
          character
            .codePointAt(0)
            .toString(16)
            .toUpperCase()
        );

      }
    )
    .join(
      " "
    );
}


/* =========================================
   Unicode parser
========================================= */

function parseUnicodeToken(
  token
) {

  let value =
    token
      .trim()
      .replace(
        /^U\+/i,
        ""
      )
      .replace(
        /^0x/i,
        ""
      );


  if (
    !/^[0-9A-F]+$/i
      .test(
        value
      )
  ) {
    return null;
  }


  const codePoint =
    parseInt(
      value,
      16
    );


  if (
    !Number.isInteger(
      codePoint
    )
  ) {
    return null;
  }


  if (
    codePoint < 0
    ||
    codePoint > 0x10FFFF
  ) {
    return null;
  }


  if (
    codePoint >= 0xD800
    &&
    codePoint <= 0xDFFF
  ) {
    return null;
  }


  return codePoint;
}


/* =========================================
   Secure random
========================================= */

function secureRandomInteger(
  max
) {

  const range =
    0x100000000;


  const limit =
    Math.floor(
      range /
      max
    )
    *
    max;


  const values =
    new Uint32Array(
      1
    );


  while (
    true
  ) {

    crypto.getRandomValues(
      values
    );


    if (
      values[0] <
      limit
    ) {

      return (
        values[0] %
        max
      );
    }
  }
}


/* =========================================
   Random filter
========================================= */

function isUsableRandomCharacter(
  codePoint
) {

  if (
    codePoint >= 0xD800
    &&
    codePoint <= 0xDFFF
  ) {
    return false;
  }


  const character =
    String.fromCodePoint(
      codePoint
    );


  if (
    isInvisibleCharacter(
      codePoint,
      character
    )
  ) {
    return false;
  }


  if (
    !/\p{Assigned}/u
      .test(
        character
      )
  ) {
    return false;
  }


  if (
    /\p{Cc}/u.test(
      character
    )
  ) {
    return false;
  }


  if (
    /\p{Cf}/u.test(
      character
    )
  ) {
    return false;
  }


  if (
    /\p{Co}/u.test(
      character
    )
  ) {
    return false;
  }


  if (
    /\p{M}/u.test(
      character
    )
  ) {
    return false;
  }


  if (
    /\p{Z}/u.test(
      character
    )
  ) {
    return false;
  }


  return true;
}


function generateRandomCodePoint() {

  while (
    true
  ) {

    const codePoint =
      secureRandomInteger(
        0x110000
      );


    if (
      isUsableRandomCharacter(
        codePoint
      )
    ) {

      return codePoint;
    }
  }
}


/* =========================================
   History
========================================= */

const unicodeHistory =
  [];


function updateBackButton() {

  backUnicode.disabled =
    unicodeHistory.length ===
    0;
}


function saveUnicodeHistory() {

  const currentValue =
    unicodeInput.value;


  const lastValue =
    unicodeHistory[
      unicodeHistory.length -
      1
    ];


  if (
    currentValue ===
    lastValue
  ) {
    return;
  }


  unicodeHistory.push(
    currentValue
  );


  if (
    unicodeHistory.length >
    50
  ) {

    unicodeHistory.shift();
  }


  updateBackButton();
}


/* =========================================
   Input timer
========================================= */

let unicodeRun =
  0;


let unicodeInputTimer =
  null;


/* =========================================
   Back
========================================= */

function goBackUnicode() {

  if (
    unicodeHistory.length ===
    0
  ) {
    return;
  }


  unicodeRun++;


  clearTimeout(
    unicodeInputTimer
  );


  unicodeInput.value =
    unicodeHistory.pop();


  updateBackButton();


  convertUnicode();
}


/* =========================================
   Random generation
========================================= */

function generateRandomUnicode(
  count
) {

  saveUnicodeHistory();


  const values =
    [];


  for (
    let index = 0;
    index < count;
    index++
  ) {

    const codePoint =
      generateRandomCodePoint();


    values.push(
      "U+"
      +
      codePoint
        .toString(16)
        .toUpperCase()
    );
  }


  unicodeInput.value =
    values.join(
      " "
    );


  convertUnicode();
}


/* =========================================
   Glyph DOM
========================================= */

function createGlyphElement(
  codePoint,
  character
) {

  const wrapper =
    document.createElement(
      "span"
    );


  wrapper.className =
    "character-span "
    +
    getFontClass(
      codePoint
    );


  const inner =
    document.createElement(
      "span"
    );


  inner.className =
    "glyph-inner";


  inner.textContent =
    character;


  wrapper.appendChild(
    inner
  );


  return {
    wrapper,
    inner
  };
}


/* =========================================
   Unicode → Character
========================================= */

async function convertUnicode() {

  const currentRun =
    ++unicodeRun;


  const raw =
    unicodeInput.value.trim();


  charOutput.className =
    "result character-result";


  charOutput.textContent =
    "";


  if (
    raw.length === 0
  ) {
    return;
  }


  const tokens =
    raw
      .split(
        /[\s,]+/
      )
      .filter(
        Boolean
      );


  for (
    const token of tokens
  ) {

    /*
      新しい入力が来たら
      古い描画処理を中止。
    */

    if (
      currentRun !==
      unicodeRun
    ) {
      return;
    }


    const codePoint =
      parseUnicodeToken(
        token
      );


    if (
      codePoint === null
    ) {

      const error =
        document.createElement(
          "span"
        );


      error.className =
        "invalid-unicode";


      error.textContent =
        "無効: "
        +
        token;


      charOutput.appendChild(
        error
      );


      await yieldToBrowser();


      continue;
    }


    const character =
      String.fromCodePoint(
        codePoint
      );


    const hex =
      codePoint
        .toString(16)
        .toUpperCase();


    /* Invisible */

    if (
      isInvisibleCharacter(
        codePoint,
        character
      )
    ) {

      charOutput.appendChild(
        makeStatusSpan(
          "不可視: U+"
          +
          hex
        )
      );


      await yieldToBrowser();


      continue;
    }


    const {
      wrapper,
      inner
    } =
      createGlyphElement(
        codePoint,
        character
      );


    const fontNames =
      getWebFontNames(
        codePoint
      );


    if (
      fontNames.length >
      0
    ) {

      wrapper.classList.add(
        "loading-character"
      );
    }


    charOutput.appendChild(
      wrapper
    );


    /*
      iPhone Safariへ
      操作時間を返す。
    */

    await yieldToBrowser();


    if (
      currentRun !==
      unicodeRun
    ) {
      return;
    }


    if (
      fontNames.length >
      0
    ) {

      await waitForCharacterFont(
        codePoint,
        character
      );
    }


    if (
      currentRun !==
      unicodeRun
    ) {
      return;
    }


    wrapper.classList.remove(
      "loading-character"
    );


    const fontFamily =
      getComputedStyle(
        inner
      )
      .fontFamily;


    /* Blank */

    if (
      isRenderedBlank(
        character,
        fontFamily
      )
    ) {

      wrapper.replaceWith(
        makeStatusSpan(
          "空白: U+"
          +
          hex
        )
      );


      await yieldToBrowser();


      continue;
    }


    /* Missing glyph */

    if (
      looksLikeMissingGlyph(
        character,
        fontFamily
      )
    ) {

      wrapper.replaceWith(
        makeStatusSpan(
          "未対応: U+"
          +
          hex
        )
      );


      await yieldToBrowser();


      continue;
    }


    /* Egyptian size correction */

    applyGlyphScale(
      wrapper,
      inner,
      codePoint,
      character
    );


    await yieldToBrowser();
  }
}


/* =========================================
   Events
========================================= */

charInput.addEventListener(
  "input",
  convertCharacters
);


unicodeInput.addEventListener(
  "input",
  () => {

    /*
      まず古い解析を止める。
    */

    unicodeRun++;


    clearTimeout(
      unicodeInputTimer
    );


    /*
      入力停止300ms後に変換。
    */

    unicodeInputTimer =
      setTimeout(
        convertUnicode,
        300
      );
  }
);


document
  .querySelectorAll(
    "[data-random-count]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          generateRandomUnicode(
            Number(
              button.dataset.randomCount
            )
          );

        }
      );

    }
  );


backUnicode.addEventListener(
  "click",
  goBackUnicode
);


clearChar.addEventListener(
  "click",
  () => {

    charInput.value =
      "";


    unicodeOutput.textContent =
      "";


    charInput.focus();
  }
);


clearUnicode.addEventListener(
  "click",
  () => {

    unicodeRun++;


    clearTimeout(
      unicodeInputTimer
    );


    unicodeInput.value =
      "";


    charOutput.textContent =
      "";


    unicodeInput.focus();
  }
);


/* =========================================
   JST date
========================================= */

function getJSTDateString() {

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "Asia/Tokyo",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit"
      }
    )
    .formatToParts(
      new Date()
    );


  const part =
    (type) => {

      return parts.find(
        (item) =>
          item.type ===
          type
      )?.value;

    };


  return (
    part("year")
    +
    "-"
    +
    part("month")
    +
    "-"
    +
    part("day")
  );
}


/* =========================================
   Daily character
========================================= */

async function loadDailyCharacter() {

  dailyCharacter.className =
    "character loading-character";


  dailyCharacter.textContent =
    "?";


  dailyCode.textContent =
    "読み込み中…";


  dailyResearchLink
    .classList
    .add(
      "disabled"
    );


  dailyResearchLink.href =
    "#";


  try {

    const response =
      await fetch(
        "./daily.json?t="
        +
        Date.now(),
        {
          cache:
            "no-store"
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        "daily.json load failed"
      );
    }


    const data =
      await response.json();


    const today =
      getJSTDateString();


    const entry =
      [
        data.current,
        data.next
      ]
      .filter(
        Boolean
      )
      .find(
        (item) =>
          item.date ===
          today
      );


    if (
      !entry
      ||
      typeof
        entry.codePoint !==
        "string"
      ||
      !/^[0-9A-F]+$/i
        .test(
          entry.codePoint
        )
    ) {

      throw new Error(
        "today entry not found"
      );
    }


    const codePoint =
      parseInt(
        entry.codePoint,
        16
      );


    if (
      !Number.isInteger(
        codePoint
      )
      ||
      codePoint < 0
      ||
      codePoint > 0x10FFFF
      ||
      (
        codePoint >= 0xD800
        &&
        codePoint <= 0xDFFF
      )
    ) {

      throw new Error(
        "invalid code point"
      );
    }


    const character =
      String.fromCodePoint(
        codePoint
      );


    const hex =
      codePoint
        .toString(16)
        .toUpperCase();


    dailyCode.textContent =
      "U+"
      +
      hex;


    dailyResearchLink.href =
      "https://www.google.com/search?q="
      +
      encodeURIComponent(
        character
        +
        " U+"
        +
        hex
        +
        " Unicode"
      );


    if (
      isInvisibleCharacter(
        codePoint,
        character
      )
    ) {

      dailyCharacter.className =
        "character font-normal";


      dailyCharacter.textContent =
        "不可視";


      dailyResearchLink
        .classList
        .remove(
          "disabled"
        );


      return;
    }


    dailyCharacter.className =
      "character "
      +
      getFontClass(
        codePoint
      )
      +
      " loading-character";


    dailyCharacter.textContent =
      "";


    const inner =
      document.createElement(
        "span"
      );


    inner.className =
      "daily-glyph-inner";


    inner.textContent =
      character;


    dailyCharacter.appendChild(
      inner
    );


    await waitForCharacterFont(
      codePoint,
      character
    );


    const fontFamily =
      getComputedStyle(
        inner
      )
      .fontFamily;


    if (
      isRenderedBlank(
        character,
        fontFamily
      )
    ) {

      dailyCharacter.className =
        "character font-normal";


      dailyCharacter.textContent =
        "空白";


      dailyResearchLink
        .classList
        .remove(
          "disabled"
        );


      return;
    }


    if (
      looksLikeMissingGlyph(
        character,
        fontFamily
      )
    ) {

      dailyCharacter.className =
        "character font-normal";


      dailyCharacter.textContent =
        "未対応";


      dailyResearchLink
        .classList
        .remove(
          "disabled"
        );


      return;
    }


    dailyCharacter
      .classList
      .remove(
        "loading-character"
      );


    applyDailyGlyphScale(
      inner,
      codePoint,
      character
    );


    dailyResearchLink
      .classList
      .remove(
        "disabled"
      );

  } catch (
    error
  ) {

    console.error(
      error
    );


    dailyCharacter.className =
      "character font-normal";


    dailyCharacter.textContent =
      "？";


    dailyCode.textContent =
      "更新待ち";
  }
}


/* =========================================
   Startup
========================================= */

updateBackButton();


loadDailyCharacter();


let lastJSTDate =
  getJSTDateString();


setInterval(
  () => {

    const now =
      getJSTDateString();


    if (
      now !==
      lastJSTDate
    ) {

      lastJSTDate =
        now;


      loadDailyCharacter();
    }

  },
  60000
);
