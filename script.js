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
   Unicode → Font class
========================================= */

function getFontClass(codePoint) {

  /* Kawi */

  if (
    codePoint >= 0x11F00 &&
    codePoint <= 0x11F5F
  ) {
    return "font-kawi";
  }


  /* Toto */

  if (
    codePoint >= 0x1E290 &&
    codePoint <= 0x1E2BF
  ) {
    return "font-toto";
  }


  /* Tangut Extended */

  if (
    (
      codePoint >= 0x187F8 &&
      codePoint <= 0x187FF
    )
    ||
    (
      codePoint >= 0x18D09 &&
      codePoint <= 0x18D1E
    )
    ||
    (
      codePoint >= 0x18D80 &&
      codePoint <= 0x18DFF
    )
  ) {
    return "font-tangut-extended";
  }


  /* Tangut Iteration Mark */

  if (
    codePoint === 0x16FE0
  ) {
    return "font-tangut";
  }


  /*
    Tangut +
    Tangut Components
  */

  if (
    (
      codePoint >= 0x17000 &&
      codePoint <= 0x187F7
    )
    ||
    (
      codePoint >= 0x18800 &&
      codePoint <= 0x18AFF
    )
    ||
    (
      codePoint >= 0x18D00 &&
      codePoint <= 0x18D08
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
    codePoint >= 0x1B170 &&
    codePoint <= 0x1B2FF
  ) {
    return "font-nushu";
  }


  /* Khitan */

  if (
    codePoint >= 0x18B00 &&
    codePoint <= 0x18CFF
  ) {
    return "font-khitan";
  }


  /* Cuneiform */

  if (
    codePoint >= 0x12000 &&
    codePoint <= 0x1254F
  ) {
    return "font-cuneiform";
  }


  /* Egyptian Hieroglyphs Extended-A */

  if (
    codePoint >= 0x13460 &&
    codePoint <= 0x143FF
  ) {
    return "font-egyptian-extended";
  }


  /* Egyptian Hieroglyphs */

  if (
    codePoint >= 0x13000 &&
    codePoint <= 0x1345F
  ) {
    return "font-egyptian";
  }


  /* Anatolian Hieroglyphs */

  if (
    codePoint >= 0x14400 &&
    codePoint <= 0x1467F
  ) {
    return "font-anatolian";
  }


  /* Tangsa */

  if (
    codePoint >= 0x16A70 &&
    codePoint <= 0x16ACF
  ) {
    return "font-tangsa";
  }


  /* Nandinagari */

  if (
    codePoint >= 0x119A0 &&
    codePoint <= 0x119FF
  ) {
    return "font-nandinagari";
  }


  /*
    Byzantine Musical Symbols
    Musical Symbols
    Ancient Greek Musical Notation
  */

  if (
    codePoint >= 0x1D000 &&
    codePoint <= 0x1D24F
  ) {
    return "font-music";
  }


  /* SignWriting */

  if (
    codePoint >= 0x1D800 &&
    codePoint <= 0x1DAAF
  ) {
    return "font-signwriting";
  }


  /* Rumi Numeral Symbols */

  if (
    codePoint >= 0x10E60 &&
    codePoint <= 0x10E7F
  ) {
    return "font-symbols2";
  }


  /* Indic Siyaq Numbers */

  if (
    codePoint >= 0x1EC70 &&
    codePoint <= 0x1ECBF
  ) {
    return "font-indic-siyaq";
  }


  /* Arabic Mathematical Alphabetic Symbols */

  if (
    codePoint >= 0x1EE00 &&
    codePoint <= 0x1EEFF
  ) {
    return "font-math";
  }


  /* Symbols for Legacy Computing Supplement */

  if (
    codePoint >= 0x1CC00 &&
    codePoint <= 0x1CEBF
  ) {
    return "font-symbols2";
  }


  /* Symbols for Legacy Computing */

  if (
    codePoint >= 0x1FB00 &&
    codePoint <= 0x1FBFF
  ) {
    return "font-symbols2";
  }


  /* CJK Extensions */

  if (
    codePoint >= 0x20000 &&
    codePoint <= 0x2EE5F
  ) {
    return "font-cjk-ext";
  }


  if (
    codePoint >= 0x2F800 &&
    codePoint <= 0x2FA1F
  ) {
    return "font-cjk-ext";
  }


  if (
    codePoint >= 0x30000 &&
    codePoint <= 0x3347F
  ) {
    return "font-cjk-ext";
  }


  return "font-normal";
}


/* =========================================
   Font names to preload
========================================= */

function getWebFontNames(codePoint) {

  const fontClass =
    getFontClass(codePoint);


  switch (fontClass) {

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


    case "font-egyptian-extended":
      return [
        "Egyptology Extended"
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


    case "font-symbols2":
      return [
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
   Sleep
========================================= */

function sleep(milliseconds) {

  return new Promise(
    (resolve) => {

      setTimeout(
        resolve,
        milliseconds
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
    getWebFontNames(codePoint);


  if (
    fontNames.length === 0
  ) {
    return;
  }


  if (
    !document.fonts
  ) {

    await sleep(800);

    return;
  }


  try {

    const loads =
      fontNames.map(
        (fontName) =>

          document.fonts.load(
            `100px "${fontName}"`,
            character
          )
      );


    await Promise.race(
      [
        Promise.allSettled(loads),
        sleep(6000)
      ]
    );

  } catch (error) {

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

    if (
      /\p{Default_Ignorable_Code_Point}/u
        .test(character)
    ) {
      return true;
    }

  } catch (error) {

    console.warn(
      "Default_Ignorable check unavailable",
      error
    );

  }


  return false;
}


/* =========================================
   Canvas glyph analysis
========================================= */

const glyphCanvas =
  document.createElement("canvas");


glyphCanvas.width =
  360;


glyphCanvas.height =
  360;


const glyphContext =
  glyphCanvas.getContext(
    "2d",
    {
      willReadFrequently: true
    }
  );


function analyseGlyphPixels(
  character,
  fontFamily,
  fontSize = 120
) {

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


  /*
    十分余裕を持った位置に描画
  */

  const x =
    80;


  const y =
    240;


  glyphContext.fillText(
    character,
    x,
    y
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
    let py = 0;
    py < height;
    py++
  ) {

    for (
      let px = 0;
      px < width;
      px++
    ) {

      const index =
        (
          py *
          width +
          px
        ) *
        4 +
        3;


      const alpha =
        data[index];


      /*
        アンチエイリアスの極薄部分は
        ほぼ無視
      */

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


  if (
    inkPixels === 0
  ) {

    return {
      inkPixels: 0,

      width: 0,

      height: 0,

      hash:
        hash >>> 0
    };

  }


  return {
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


/* =========================================
   Blank glyph detection
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
    analysis.inkPixels === 0
  );
}


/* =========================================
   Missing glyph detection

   □ / 三本線 / tofuを
   未割り当てコードポイントの描画と比較
========================================= */

function sameGlyphSignature(
  first,
  second
) {

  if (
    first.inkPixels === 0 ||
    second.inkPixels === 0
  ) {
    return false;
  }


  return (
    first.hash === second.hash
    &&
    first.width === second.width
    &&
    first.height === second.height
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


  /*
    Unicode未割り当て領域を基準にする
  */

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
   Tiny glyph detection / scaling

   measureText()ではなく
   実際の黒いピクセル範囲を測る
========================================= */

function getGlyphScaleFactor(
  codePoint,
  character,
  fontFamily
) {

  /*
    現在、強い自動補正を行うのは
    Egyptian Hieroglyphs Extended-A。
  */

  if (
    codePoint < 0x13460 ||
    codePoint > 0x143FF
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
    正常な字形なら補正なし
  */

  if (
    largestSide >= 62
  ) {
    return 1;
  }


  /*
    120pxで描いた時に
    最大辺がおよそ82pxになるよう補正。
  */

  const scale =
    82 /
    Math.max(
      largestSide,
      1
    );


  /*
    前回の5倍では足りなかったので、
    最大14倍まで許可。
  */

  return Math.min(
    14,
    Math.max(
      1,
      scale
    )
  );
}


/* =========================================
   Scale normal result glyph
========================================= */

function applyGlyphScale(
  wrapper,
  inner,
  codePoint,
  character
) {

  const style =
    getComputedStyle(inner);


  const fontFamily =
    style.fontFamily;


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


  /*
    周囲の文字と重なりにくくする。
  */

  const extraWidth =
    Math.min(
      4,
      1 +
      (
        scale - 1
      ) *
      0.35
    );


  const extraHeight =
    Math.min(
      4,
      1.3 +
      (
        scale - 1
      ) *
      0.28
    );


  wrapper.style.minWidth =
    `${extraWidth}em`;


  wrapper.style.minHeight =
    `${extraHeight}em`;


  wrapper.style.marginLeft =
    "0.08em";


  wrapper.style.marginRight =
    "0.08em";
}


/* =========================================
   Scale daily glyph
========================================= */

function applyDailyGlyphScale(
  inner,
  codePoint,
  character
) {

  const style =
    getComputedStyle(inner);


  const fontFamily =
    style.fontFamily;


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


  /*
    「今日の一文字」は
    少し控えめに上限を設定
  */

  const dailyScale =
    Math.min(
      8,
      scale
    );


  inner.style.transform =
    `scale(${dailyScale})`;
}


/* =========================================
   Status span
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
    Array.from(text)
      .map(
        (character) =>

          "U+" +
          character
            .codePointAt(0)
            .toString(16)
            .toUpperCase()
      )
      .join(" ");
}


/* =========================================
   Unicode token parser
========================================= */

function parseUnicodeToken(
  token
) {

  let value =
    token.trim();


  if (
    value.length === 0
  ) {
    return null;
  }


  value =
    value.replace(
      /^U\+/i,
      ""
    );


  value =
    value.replace(
      /^0x/i,
      ""
    );


  if (
    !/^[0-9A-F]+$/i
      .test(value)
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
    codePoint < 0 ||
    codePoint > 0x10FFFF
  ) {
    return null;
  }


  if (
    codePoint >= 0xD800 &&
    codePoint <= 0xDFFF
  ) {
    return null;
  }


  return codePoint;
}


/* =========================================
   Secure random integer
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
    new Uint32Array(1);


  while (true) {

    crypto.getRandomValues(
      values
    );


    const value =
      values[0];


    if (
      value < limit
    ) {

      return (
        value %
        max
      );

    }
  }
}


/* =========================================
   Random character filter
========================================= */

function isUsableRandomCharacter(
  codePoint
) {

  if (
    codePoint >= 0xD800 &&
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
      .test(character)
  ) {
    return false;
  }


  if (
    /\p{Cc}/u.test(character)
  ) {
    return false;
  }


  if (
    /\p{Cf}/u.test(character)
  ) {
    return false;
  }


  if (
    /\p{Co}/u.test(character)
  ) {
    return false;
  }


  if (
    /\p{M}/u.test(character)
  ) {
    return false;
  }


  if (
    /\p{Z}/u.test(character)
  ) {
    return false;
  }


  return true;
}


/* =========================================
   Generate random code point
========================================= */

function generateRandomCodePoint() {

  while (true) {

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
    unicodeHistory.length === 0;
}


function saveUnicodeHistory() {

  const currentValue =
    unicodeInput.value;


  const previousValue =
    unicodeHistory[
      unicodeHistory.length - 1
    ];


  if (
    currentValue === previousValue
  ) {
    return;
  }


  unicodeHistory.push(
    currentValue
  );


  if (
    unicodeHistory.length > 50
  ) {

    unicodeHistory.shift();

  }


  updateBackButton();
}


function goBackUnicode() {

  if (
    unicodeHistory.length === 0
  ) {
    return;
  }


  unicodeRun++;


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
      "U+" +
      codePoint
        .toString(16)
        .toUpperCase()
    );

  }


  unicodeInput.value =
    values.join(" ");


  convertUnicode();
}


/* =========================================
   Build one glyph element
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
    "character-span " +
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

let unicodeRun =
  0;


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
      .split(/[\s,]+/)
      .filter(Boolean);


  const promises =
    [];


  for (
    const token of tokens
  ) {

    const codePoint =
      parseUnicodeToken(
        token
      );


    /*
      Invalid Unicode
    */

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
        "無効: " +
        token;


      charOutput.appendChild(
        error
      );


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


    /*
      Intentionally invisible
    */

    if (
      isInvisibleCharacter(
        codePoint,
        character
      )
    ) {

      charOutput.appendChild(
        makeStatusSpan(
          "不可視: U+" +
          hex
        )
      );


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
      fontNames.length > 0
    ) {

      wrapper.classList.add(
        "loading-character"
      );

    }


    charOutput.appendChild(
      wrapper
    );


    const render =
      async () => {

        if (
          fontNames.length > 0
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


        const style =
          getComputedStyle(
            inner
          );


        const fontFamily =
          style.fontFamily;


        /*
          Truly blank
        */

        if (
          isRenderedBlank(
            character,
            fontFamily
          )
        ) {

          wrapper.replaceWith(
            makeStatusSpan(
              "空白: U+" +
              hex
            )
          );


          return;
        }


        /*
          Missing glyph / tofu / three lines
        */

        if (
          looksLikeMissingGlyph(
            character,
            fontFamily
          )
        ) {

          wrapper.replaceWith(
            makeStatusSpan(
              "未対応: U+" +
              hex
            )
          );


          return;
        }


        /*
          Real glyph exists.
          Apply automatic Egyptian scaling.
        */

        applyGlyphScale(
          wrapper,
          inner,
          codePoint,
          character
        );
      };


    promises.push(
      render()
    );
  }


  await Promise.all(
    promises
  );
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
  convertUnicode
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

          const count =
            Number(
              button.dataset.randomCount
            );


          generateRandomUnicode(
            count
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
          item.type === type
      )?.value;


  return (
    part("year") +
    "-" +
    part("month") +
    "-" +
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
    .add("disabled");


  dailyResearchLink.href =
    "#";


  try {

    const response =
      await fetch(
        "./daily.json?t=" +
        Date.now(),
        {
          cache: "no-store"
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
      .filter(Boolean)
      .find(
        (item) =>
          item.date === today
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
        codePoint >= 0xD800 &&
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
      "U+" +
      hex;


    const searchQuery =
      character +
      " U+" +
      hex +
      " Unicode";


    dailyResearchLink.href =
      "https://www.google.com/search?q=" +
      encodeURIComponent(
        searchQuery
      );


    /*
      Invisible
    */

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
        .remove("disabled");


      return;
    }


    /*
      Set font class
    */

    dailyCharacter.className =
      "character " +
      getFontClass(
        codePoint
      ) +
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


    const style =
      getComputedStyle(
        inner
      );


    const fontFamily =
      style.fontFamily;


    /*
      Blank
    */

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
        .remove("disabled");


      return;
    }


    /*
      Missing
    */

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
        .remove("disabled");


      return;
    }


    /*
      Real glyph
    */

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


  } catch (error) {

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
