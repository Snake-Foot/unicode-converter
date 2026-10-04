const charInput = document.getElementById("charInput");
const unicodeInput = document.getElementById("unicodeInput");
const unicodeOutput = document.getElementById("unicodeOutput");
const charOutput = document.getElementById("charOutput");
const clearChar = document.getElementById("clearChar");
const clearUnicode = document.getElementById("clearUnicode");
const backUnicode = document.getElementById("backUnicode");
const dailyCharacter = document.getElementById("dailyCharacter");
const dailyCode = document.getElementById("dailyCode");
const dailyResearchLink = document.getElementById("dailyResearchLink");


/* =========================================
   Font mapping
========================================= */

function getFontClass(cp) {
  if (cp >= 0x11F00 && cp <= 0x11F5F) return "font-kawi";
  if (cp >= 0x1E290 && cp <= 0x1E2BF) return "font-toto";

  if (
    (cp >= 0x187F8 && cp <= 0x187FF) ||
    (cp >= 0x18D09 && cp <= 0x18D1E) ||
    (cp >= 0x18D80 && cp <= 0x18DFF)
  ) {
    return "font-tangut-extended";
  }

  if (cp === 0x16FE0) return "font-tangut";

  if (
    (cp >= 0x17000 && cp <= 0x187F7) ||
    (cp >= 0x18800 && cp <= 0x18AFF) ||
    (cp >= 0x18D00 && cp <= 0x18D08)
  ) {
    return "font-tangut";
  }

  if (cp === 0x16FE1) return "font-nushu";

  if (cp >= 0x1B170 && cp <= 0x1B2FF) {
    return "font-nushu";
  }

  if (cp >= 0x18B00 && cp <= 0x18CFF) {
    return "font-khitan";
  }

  if (cp >= 0x12000 && cp <= 0x1254F) {
    return "font-cuneiform";
  }

  if (cp >= 0x13460 && cp <= 0x143FF) {
    return "font-egyptian-extended";
  }

  if (cp >= 0x13000 && cp <= 0x1345F) {
    return "font-egyptian";
  }

  if (cp >= 0x14400 && cp <= 0x1467F) {
    return "font-anatolian";
  }

  if (cp >= 0x16A70 && cp <= 0x16ACF) {
    return "font-tangsa";
  }

  if (cp >= 0x119A0 && cp <= 0x119FF) {
    return "font-nandinagari";
  }

  if (cp >= 0x1D000 && cp <= 0x1D24F) {
    return "font-music";
  }

  if (cp >= 0x1D800 && cp <= 0x1DAAF) {
    return "font-signwriting";
  }

  if (cp >= 0x10E60 && cp <= 0x10E7F) {
    return "font-symbols2";
  }

  if (cp >= 0x1EC70 && cp <= 0x1ECBF) {
    return "font-indic-siyaq";
  }

  if (cp >= 0x1EE00 && cp <= 0x1EEFF) {
    return "font-math";
  }

  if (cp >= 0x1CC00 && cp <= 0x1CEBF) {
    return "font-symbols2";
  }

  if (cp >= 0x1FB00 && cp <= 0x1FBFF) {
    return "font-symbols2";
  }

  if (
    (cp >= 0x20000 && cp <= 0x2EE5F) ||
    (cp >= 0x2F800 && cp <= 0x2FA1F) ||
    (cp >= 0x30000 && cp <= 0x3347F)
  ) {
    return "font-cjk-ext";
  }

  return "font-normal";
}


function getWebFontNames(cp) {
  switch (getFontClass(cp)) {
    case "font-kawi":
      return ["Noto Sans Kawi"];

    case "font-toto":
      return ["Noto Serif Toto"];

    case "font-tangut":
      return ["Noto Serif Tangut"];

    case "font-tangut-extended":
      return [
        "Tangut Extended",
        "Noto Serif Tangut"
      ];

    case "font-nushu":
      return ["Noto Sans Nushu"];

    case "font-khitan":
      return ["Noto Serif Khitan Small Script"];

    case "font-cuneiform":
      return ["Noto Sans Cuneiform"];

    case "font-egyptian":
      return ["Noto Sans Egyptian Hieroglyphs"];

    case "font-egyptian-extended":
      return ["Egyptology Extended"];

    case "font-anatolian":
      return ["Noto Sans Anatolian Hieroglyphs"];

    case "font-tangsa":
      return ["Noto Sans Tangsa"];

    case "font-nandinagari":
      return ["Noto Sans Nandinagari"];

    case "font-music":
      return ["Noto Music"];

    case "font-signwriting":
      return ["Noto Sans SignWriting"];

    case "font-symbols2":
      return ["Noto Sans Symbols 2"];

    case "font-math":
      return ["Noto Sans Math"];

    case "font-indic-siyaq":
      return ["Noto Sans Indic Siyaq Numbers"];

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


const sleep =
  (ms) =>
    new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          ms
        )
    );


const yieldToBrowser =
  () =>
    new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          0
        )
    );


async function waitForCharacterFont(
  cp,
  ch
) {
  const names =
    getWebFontNames(
      cp
    );

  if (
    !names.length
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
    await Promise.race([
      Promise.allSettled(
        names.map(
          (name) =>
            document.fonts.load(
              `100px "${name}"`,
              ch
            )
        )
      ),

      sleep(
        6000
      )
    ]);
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
  cp,
  ch
) {
  if (
    knownInvisibleCodePoints.has(
      cp
    )
  ) {
    return true;
  }

  try {
    return (
      /\p{Default_Ignorable_Code_Point}/u
        .test(
          ch
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
  ch,
  fontFamily,
  fontSize = 120
) {
  const key =
    `${ch}|${fontFamily}|${fontSize}`;

  if (
    glyphAnalysisCache.has(
      key
    )
  ) {
    return glyphAnalysisCache.get(
      key
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
    ch,
    50,
    190
  );

  glyphContext.restore();

  const data =
    glyphContext
      .getImageData(
        0,
        0,
        width,
        height
      )
      .data;

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
    let py = 0;
    py < height;
    py++
  ) {
    for (
      let px = 0;
      px < width;
      px++
    ) {
      const alpha =
        data[
          (
            py *
            width +
            px
          ) *
          4 +
          3
        ];

      if (
        alpha > 8
      ) {
        inkPixels++;

        if (
          px < minX
        ) {
          minX = px;
        }

        if (
          px > maxX
        ) {
          maxX = px;
        }

        if (
          py < minY
        ) {
          minY = py;
        }

        if (
          py > maxY
        ) {
          maxY = py;
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

  const result =
    inkPixels === 0
      ? {
          inkPixels:
            0,

          width:
            0,

          height:
            0,

          hash:
            hash >>> 0
        }
      : {
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

  glyphAnalysisCache.set(
    key,
    result
  );

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


function isRenderedBlank(
  ch,
  fontFamily
) {
  return (
    analyseGlyphPixels(
      ch,
      fontFamily
    )
    .inkPixels === 0
  );
}


function sameGlyphSignature(
  a,
  b
) {
  return (
    a.inkPixels > 0 &&
    b.inkPixels > 0 &&
    a.hash === b.hash &&
    a.width === b.width &&
    a.height === b.height
  );
}


function looksLikeMissingGlyph(
  ch,
  fontFamily
) {
  const target =
    analyseGlyphPixels(
      ch,
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
  cp,
  ch,
  fontFamily
) {
  if (
    cp < 0x13460 ||
    cp > 0x143FF
  ) {
    return 1;
  }

  const analysis =
    analyseGlyphPixels(
      ch,
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

  if (
    largestSide >= 62
  ) {
    return 1;
  }

  return Math.min(
    14,
    Math.max(
      1,
      82 /
      Math.max(
        largestSide,
        1
      )
    )
  );
}


function applyGlyphScale(
  wrapper,
  inner,
  cp,
  ch
) {
  const fontFamily =
    getComputedStyle(
      inner
    )
    .fontFamily;

  const scale =
    getGlyphScaleFactor(
      cp,
      ch,
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
    高さを拡大率に比例させないことで、
    巨大な縦余白を防ぐ。
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
  cp,
  ch
) {
  const fontFamily =
    getComputedStyle(
      inner
    )
    .fontFamily;

  const scale =
    getGlyphScaleFactor(
      cp,
      ch,
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
    !text.length
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
      (ch) =>
        `U+${
          ch
            .codePointAt(0)
            .toString(16)
            .toUpperCase()
        }`
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

  const cp =
    parseInt(
      value,
      16
    );

  if (
    !Number.isInteger(
      cp
    )
  ) {
    return null;
  }

  if (
    cp < 0 ||
    cp > 0x10FFFF
  ) {
    return null;
  }

  if (
    cp >= 0xD800 &&
    cp <= 0xDFFF
  ) {
    return null;
  }

  return cp;
}


/* =========================================
   Random Unicode
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
    ) *
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


function isUsableRandomCharacter(
  cp
) {
  if (
    cp >= 0xD800 &&
    cp <= 0xDFFF
  ) {
    return false;
  }

  const ch =
    String.fromCodePoint(
      cp
    );

  if (
    isInvisibleCharacter(
      cp,
      ch
    )
  ) {
    return false;
  }

  if (
    !/\p{Assigned}/u
      .test(
        ch
      )
  ) {
    return false;
  }

  if (
    /\p{Cc}/u.test(
      ch
    )
  ) {
    return false;
  }

  if (
    /\p{Cf}/u.test(
      ch
    )
  ) {
    return false;
  }

  if (
    /\p{Co}/u.test(
      ch
    )
  ) {
    return false;
  }

  if (
    /\p{M}/u.test(
      ch
    )
  ) {
    return false;
  }

  if (
    /\p{Z}/u.test(
      ch
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
    const cp =
      secureRandomInteger(
        0x110000
      );

    if (
      isUsableRandomCharacter(
        cp
      )
    ) {
      return cp;
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
  const current =
    unicodeInput.value;

  const last =
    unicodeHistory[
      unicodeHistory.length -
      1
    ];

  if (
    current === last
  ) {
    return;
  }

  unicodeHistory.push(
    current
  );

  if (
    unicodeHistory.length >
    50
  ) {
    unicodeHistory.shift();
  }

  updateBackButton();
}


function goBackUnicode() {
  if (
    !unicodeHistory.length
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


function generateRandomUnicode(
  count
) {
  saveUnicodeHistory();

  const values =
    [];

  for (
    let i = 0;
    i < count;
    i++
  ) {
    const cp =
      generateRandomCodePoint();

    values.push(
      `U+${
        cp
          .toString(16)
          .toUpperCase()
      }`
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
  cp,
  ch
) {
  const wrapper =
    document.createElement(
      "span"
    );

  wrapper.className =
    `character-span ${
      getFontClass(
        cp
      )
    }`;

  const inner =
    document.createElement(
      "span"
    );

  inner.className =
    "glyph-inner";

  inner.textContent =
    ch;

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

let unicodeRun =
  0;

let unicodeInputTimer =
  null;


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
    !raw.length
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
      編集されたら
      古い処理を即終了。
    */

    if (
      currentRun !==
      unicodeRun
    ) {
      return;
    }

    const cp =
      parseUnicodeToken(
        token
      );

    if (
      cp === null
    ) {
      const error =
        document.createElement(
          "span"
        );

      error.className =
        "invalid-unicode";

      error.textContent =
        `無効: ${token}`;

      charOutput.appendChild(
        error
      );

      await yieldToBrowser();

      continue;
    }

    const ch =
      String.fromCodePoint(
        cp
      );

    const hex =
      cp
        .toString(16)
        .toUpperCase();

    if (
      isInvisibleCharacter(
        cp,
        ch
      )
    ) {
      charOutput.appendChild(
        makeStatusSpan(
          `不可視: U+${hex}`
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
        cp,
        ch
      );

    const fontNames =
      getWebFontNames(
        cp
      );

    if (
      fontNames.length
    ) {
      wrapper.classList.add(
        "loading-character"
      );
    }

    charOutput.appendChild(
      wrapper
    );

    /*
      ここでブラウザに操作時間を返す。
      貼り付け直後でも入力欄を触れるようにする。
    */

    await yieldToBrowser();

    if (
      currentRun !==
      unicodeRun
    ) {
      return;
    }

    if (
      fontNames.length
    ) {
      await waitForCharacterFont(
        cp,
        ch
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

    if (
      isRenderedBlank(
        ch,
        fontFamily
      )
    ) {
      wrapper.replaceWith(
        makeStatusSpan(
          `空白: U+${hex}`
        )
      );

      await yieldToBrowser();

      continue;
    }

    if (
      looksLikeMissingGlyph(
        ch,
        fontFamily
      )
    ) {
      wrapper.replaceWith(
        makeStatusSpan(
          `未対応: U+${hex}`
        )
      );

      await yieldToBrowser();

      continue;
    }

    applyGlyphScale(
      wrapper,
      inner,
      cp,
      ch
    );

    /*
      1文字ごとに操作時間を返す。
    */

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
      入力した瞬間に
      古い解析を停止。
    */

    unicodeRun++;

    clearTimeout(
      unicodeInputTimer
    );

    /*
      入力が止まってから
      300ms後に変換。
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
              button.dataset
                .randomCount
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
    (type) =>
      parts.find(
        (item) =>
          item.type ===
          type
      )?.value;

  return (
    `${part("year")}-${part("month")}-${part("day")}`
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
        `./daily.json?t=${Date.now()}`,
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

    const cp =
      parseInt(
        entry.codePoint,
        16
      );

    if (
      !Number.isInteger(
        cp
      )
      ||
      cp < 0
      ||
      cp > 0x10FFFF
      ||
      (
        cp >= 0xD800 &&
        cp <= 0xDFFF
      )
    ) {
      throw new Error(
        "invalid code point"
      );
    }

    const ch =
      String.fromCodePoint(
        cp
      );

    const hex =
      cp
        .toString(16)
        .toUpperCase();

    dailyCode.textContent =
      `U+${hex}`;

    dailyResearchLink.href =
      "https://www.google.com/search?q=" +
      encodeURIComponent(
        `${ch} U+${hex} Unicode`
      );

    if (
      isInvisibleCharacter(
        cp,
        ch
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
      `character ${
        getFontClass(
          cp
        )
      } loading-character`;

    dailyCharacter.textContent =
      "";

    const inner =
      document.createElement(
        "span"
      );

    inner.className =
      "daily-glyph-inner";

    inner.textContent =
      ch;

    dailyCharacter.appendChild(
      inner
    );

    await waitForCharacterFont(
      cp,
      ch
    );

    const fontFamily =
      getComputedStyle(
        inner
      )
      .fontFamily;

    if (
      isRenderedBlank(
        ch,
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
        ch,
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
      cp,
      ch
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
