const fs = require("fs");

const {
  UNIHAN_URL,
  loadUnihanData,
  buildHanProfile
} = require("./unihan-profile.js");

const {
  SMUFL_GLYPHNAMES_URL,
  SMUFL_CLASSES_URL,
  loadMusicData,
  buildMusicProfile
} = require("./music-profile.js");

const {
  EMOJI_DATA_URL,
  CLDR_JA_ANNOTATIONS_URL,
  loadEmojiData,
  buildEmojiProfile
} = require("./emoji-profile.js");

const {
  HISTORICAL_SOURCES,
  loadHistoricalData,
  buildHistoricalProfile
} = require("./historical-profile.js");

const {
  MATH_SOURCES,
  loadMathData,
  buildMathProfile
} = require("./math-profile.js");

const {
  UCD_BASE,
  COMMON_UCD_SOURCES,
  fetchText,
  loadCommonUcdData,
  buildCommonProfile
} = require("./ucd-profile.js");

const {
  DAILY_JSON_PATH,
  getJSTDateString,
  loadFonts,
  generateEntry,
  pickDailyCategory,
  loadExistingDailyData
} = require("./generate-daily.js");


const API_KEY =
  process.env.GEMINI_API_KEY;


if (!API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not set."
  );
}


const SOURCES = {
  ...COMMON_UCD_SOURCES,

  unikemet:
    UCD_BASE +
    "/Unikemet.txt"
};


function hex(
  codePoint
) {

  return codePoint
    .toString(16)
    .toUpperCase()
    .padStart(
      4,
      "0"
    );
}



async function loadResearchSources() {

  const [
    commonUcd,
    unikemet,
    unihan,
    music,
    emoji,
    historical,
    math
  ] =
    await Promise.all(
      [
        loadCommonUcdData(),

        fetchText(
          SOURCES.unikemet
        ),

        loadUnihanData(),

        loadMusicData(),

        loadEmojiData(),

        loadHistoricalData(),

        loadMathData()
      ]
    );


  return {
    commonUcd,
    unikemet,
    unihan,
    music,
    emoji,
    historical,
    math
  };
}

function findUnikemet(
  text,
  codePoint
) {

  const target =
    "U+" +
    hex(
      codePoint
    );


  const properties =
    {};


  for (
    const line
    of text.split(
      /\r?\n/
    )
  ) {

    if (
      !line
      ||
      line.startsWith(
        "#"
      )
    ) {
      continue;
    }


    const fields =
      line.split(
        "\t"
      );


    if (
      fields.length <
        3
      ||
      fields[
        0
      ].trim() !==
        target
    ) {
      continue;
    }


    const property =
      fields[
        1
      ].trim();


    const value =
      fields
        .slice(
          2
        )
        .join(
          "\t"
        )
        .trim();


    if (
      property
      &&
      value
    ) {

      properties[
        property
      ] =
        value;
    }
  }


  return properties;
}


function normalizeFactText(
  text
) {

  return String(
    text
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9\p{L}\p{N}]+/gu,
      " "
    )
    .trim();
}


function makeFacts(
  namesList,
  unikemet,
  unihan
) {

  const facts =
    [];


  const seen =
    new Set();


  const push = (
    kind,
    text,
    source,
    strength =
      "strong"
  ) => {

    if (
      !text
    ) {
      return;
    }


    const normalized =
      normalizeFactText(
        text
      );


    if (
      !normalized
      ||
      seen.has(
        normalized
      )
    ) {
      return;
    }


    seen.add(
      normalized
    );


    facts.push(
      {
        kind,
        text,
        source,
        strength
      }
    );
  };


  push(
    "appearance",
    unikemet.kEH_Desc,
    "Unicode Unikemet",
    "strong"
  );


  push(
    "function",
    unikemet.kEH_Func,
    "Unicode Unikemet",
    "strong"
  );


  push(
    "functionValue",
    unikemet.kEH_FVal,
    "Unicode Unikemet",
    "strong"
  );


  for (
    const item
    of namesList
  ) {

    if (
      item.type ===
        "comment"
    ) {

      push(
        "namesList:comment",
        item.text,
        "Unicode NamesList",
        "strong"
      );

    } else if (
      [
        "alias",
        "formalAlias",
        "notice",
        "crossReference",
        "decomposition",
        "variation"
      ].includes(
        item.type
      )
    ) {

      push(
        "namesList:" +
          item.type,
        item.text,
        "Unicode NamesList",
        "supporting"
      );
    }
  }


  push(
    "unihan:definition",
    unihan.kDefinition,
    "Unicode Unihan",
    "strong"
  );


  push(
    "unihan:japaneseOn",
    unihan.kJapaneseOn,
    "Unicode Unihan",
    "strong"
  );


  push(
    "unihan:japaneseKun",
    unihan.kJapaneseKun,
    "Unicode Unihan",
    "strong"
  );


  push(
    "unihan:totalStrokes",
    unihan.kTotalStrokes,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:radicalStroke",
    unihan.kRSUnicode,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:compatibilityVariant",
    unihan.kCompatibilityVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:japaneseNewVariant",
    unihan.kJapaneseNewVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:japaneseOldVariant",
    unihan.kJapaneseOldVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:semanticVariant",
    unihan.kSemanticVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:simplifiedVariant",
    unihan.kSimplifiedVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:traditionalVariant",
    unihan.kTraditionalVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:zVariant",
    unihan.kZVariant,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "unihan:primaryNumeric",
    unihan.kPrimaryNumeric,
    "Unicode Unihan",
    "strong"
  );


  push(
    "unihan:accountingNumeric",
    unihan.kAccountingNumeric,
    "Unicode Unihan",
    "strong"
  );


  push(
    "unihan:otherNumeric",
    unihan.kOtherNumeric,
    "Unicode Unihan",
    "strong"
  );


  const irgSourceText =
    Object.entries(
      unihan
    )
      .filter(
        (
          [
            key
          ]
        ) =>
          /^kIRG_.+Source$/.test(
            key
          )
      )
      .map(
        (
          [
            key,
            value
          ]
        ) =>
          key +
          "=" +
          value
      )
      .join(
        "; "
      );


  push(
    "unihan:irgSources",
    irgSourceText,
    "Unicode Unihan",
    "supporting"
  );


  push(
    "catalogIndex",
    unikemet.kEH_UniK,
    "Unicode Unikemet",
    "supporting"
  );


  push(
    "taxonomyIndex",
    unikemet.kEH_Cat,
    "Unicode Unikemet",
    "supporting"
  );


  return facts;
}


function researchCharacter(
  sourceTexts,
  entry
) {

  const codePoint =
    parseInt(
      entry.codePoint,
      16
    );


  const profile =
    buildCommonProfile(
      sourceTexts.commonUcd,
      codePoint
    );


  const {
    unicodeName,
    block,
    script,
    age,
    generalCategory,
    namesList
  } =
    profile;


  const unikemet =
    findUnikemet(
      sourceTexts.unikemet,
      codePoint
    );


  const hanProfile =
    buildHanProfile(
      sourceTexts.unihan,
      codePoint
    );


  const unihan =
    hanProfile.properties;


  const musicProfile =
    buildMusicProfile(
      sourceTexts.music,
      codePoint
    );


  const emojiProfile =
    buildEmojiProfile(
      sourceTexts.emoji,
      codePoint
    );


  const historicalProfile =
    buildHistoricalProfile(
      sourceTexts.historical,
      codePoint,
      script
    );


  const mathProfile =
    buildMathProfile(
      sourceTexts.math,
      codePoint
    );


  const facts =
    makeFacts(
      namesList,
      unikemet,
      unihan
    );


  const normalizedFactTexts =
    new Set(
      facts.map(
        (
          fact
        ) =>
          normalizeFactText(
            fact.text
          )
      )
    );


  const addFact = (
    kind,
    text,
    source,
    strength =
      "supporting"
  ) => {

    if (
      !text
    ) {
      return;
    }


    const normalized =
      normalizeFactText(
        text
      );


    if (
      !normalized
      ||
      normalizedFactTexts.has(
        normalized
      )
    ) {
      return;
    }


    normalizedFactTexts.add(
      normalized
    );


    facts.push(
      {
        kind,
        text,
        source,
        strength
      }
    );
  };


  if (
    musicProfile
  ) {

    for (
      const match
      of musicProfile.matches
    ) {

      addFact(
        "smufl:glyph",
        [
          match.glyphName,
          match.description
        ]
          .filter(
            Boolean
          )
          .join(
            ": "
          ),
        "SMuFL",
        "strong"
      );


      if (
        match.classes.length >
          0
      ) {

        addFact(
          "smufl:classes",
          match.classes.join(
            ", "
          ),
          "SMuFL",
          "supporting"
        );
      }
    }
  }


  if (
    emojiProfile
  ) {

    addFact(
      "emoji:jaName",
      emojiProfile.shortName,
      "CLDR Japanese annotations",
      "strong"
    );


    if (
      emojiProfile.keywords.length >
        0
    ) {

      addFact(
        "emoji:jaKeywords",
        emojiProfile.keywords.join(
          ", "
        ),
        "CLDR Japanese annotations",
        "supporting"
      );
    }


    if (
      emojiProfile.properties.length >
        0
    ) {

      addFact(
        "emoji:properties",
        emojiProfile.properties.join(
          ", "
        ),
        "Unicode Emoji data",
        "supporting"
      );
    }
  }


  if (
    historicalProfile
  ) {

    for (
      const [
        property,
        value
      ]
      of Object.entries(
        historicalProfile.properties
      )
    ) {

      addFact(
        "historical:" +
          property,
        value,
        historicalProfile.sourceName,
        /Reading|Definition|Meaning|Numeric|Desc|Func/i.test(
          property
        )
          ? "strong"
          : "supporting"
      );
    }
  }


  if (
    mathProfile
  ) {

    if (
      mathProfile.isMath
    ) {

      addFact(
        "math:property",
        "Math",
        "Unicode DerivedCoreProperties",
        "supporting"
      );
    }


    if (
      mathProfile.bracket
    ) {

      addFact(
        "math:bidiBracket",
        "paired U+" +
          mathProfile.bracket.pairedCodePoint +
          " (" +
          mathProfile.bracket.type +
          ")",
        "Unicode BidiBrackets",
        "supporting"
      );
    }


    if (
      mathProfile.mirroredCodePoint
    ) {

      addFact(
        "math:bidiMirror",
        "mirrored U+" +
          mathProfile.mirroredCodePoint,
        "Unicode BidiMirroring",
        "supporting"
      );
    }
  }


  const strongFacts =
    facts.filter(
      (
        item
      ) =>
        item.strength ===
          "strong"
    );


  const category =
    entry.category
    ||
    "general";


  const isHan =
    category ===
      "han"
    ||
    script ===
      "Han";


  const isEgyptian =
    script ===
      "Egyptian_Hieroglyphs";


  const isSymbolLike =
    category ===
      "symbol"
    ||
    category ===
      "music"
    ||
    typeof generalCategory ===
      "string"
    &&
    /^[SP]/.test(
      generalCategory
    );


  const unihanFacts =
    facts.filter(
      (
        item
      ) =>
        item.kind.startsWith(
          "unihan:"
        )
    );


  const namesListFacts =
    facts.filter(
      (
        item
      ) =>
        item.kind.startsWith(
          "namesList:"
        )
    );


  const hasIdentity =
    Boolean(
      unicodeName
      &&
      block
      &&
      script
    );


  let accepted =
    false;


  let researchType =
    "general";


  if (
    hasIdentity
    &&
    isHan
  ) {

    researchType =
      "han";


    accepted =
      unihanFacts.length >
        0;

  } else if (
    hasIdentity
    &&
    category ===
      "kana"
  ) {

    researchType =
      "kana";


    accepted =
      Boolean(
        unicodeName
      );

  } else if (
    hasIdentity
    &&
    category ===
      "number"
  ) {

    researchType =
      "number";


    accepted =
      Boolean(
        unicodeName
      );

  } else if (
    hasIdentity
    &&
    category ===
      "music"
  ) {

    researchType =
      "music";


    accepted =
      Boolean(
        unicodeName
      );

  } else if (
    hasIdentity
    &&
    category ===
      "phonetics"
  ) {

    researchType =
      "phonetics";


    accepted =
      Boolean(
        unicodeName
      );

  } else if (
    hasIdentity
    &&
    isEgyptian
  ) {

    researchType =
      "egyptian";


    accepted =
      strongFacts.length >=
        2;

  } else if (
    hasIdentity
    &&
    isSymbolLike
  ) {

    researchType =
      "symbol";


    accepted =
      Boolean(
        unicodeName
      );

  } else if (
    hasIdentity
  ) {

    accepted =
      strongFacts.length >=
        2;
  }


  const sources = [
    {
      name:
        "Unicode DerivedName",

      url:
        SOURCES.derivedName
    },

    {
      name:
        "Unicode UnicodeData",

      url:
        SOURCES.unicodeData
    },

    {
      name:
        "Unicode NameAliases",

      url:
        SOURCES.nameAliases
    },

    {
      name:
        "Unicode ScriptExtensions",

      url:
        SOURCES.scriptExtensions
    },

    {
      name:
        "Unicode StandardizedVariants",

      url:
        SOURCES.standardizedVariants
    },

    {
      name:
        "Unicode NamesList",

      url:
        SOURCES.namesList
    }
  ];


  if (
    Object.keys(
      unikemet
    ).length >
      0
  ) {

    sources.push(
      {
        name:
          "Unicode Unikemet",

        url:
          SOURCES.unikemet
      }
    );
  }


  if (
    Object.keys(
      unihan
    ).length >
      0
  ) {

    sources.push(
      {
        name:
          "Unicode Unihan",

        url:
          UNIHAN_URL
      }
    );
  }


  if (
    musicProfile
  ) {

    sources.push(
      {
        name:
          "SMuFL glyphnames",

        url:
          SMUFL_GLYPHNAMES_URL
      },

      {
        name:
          "SMuFL classes",

        url:
          SMUFL_CLASSES_URL
      }
    );
  }


  if (
    emojiProfile
  ) {

    sources.push(
      {
        name:
          "Unicode Emoji data",

        url:
          EMOJI_DATA_URL
      },

      {
        name:
          "CLDR Japanese annotations",

        url:
          CLDR_JA_ANNOTATIONS_URL
      }
    );
  }


  if (
    historicalProfile
  ) {

    sources.push(
      {
        name:
          historicalProfile.sourceName,

        url:
          historicalProfile.sourceUrl
      }
    );
  }


  if (
    mathProfile
  ) {

    sources.push(
      {
        name:
          "Unicode DerivedCoreProperties",

        url:
          MATH_SOURCES.derivedCoreProperties
      },

      {
        name:
          "Unicode BidiBrackets",

        url:
          MATH_SOURCES.bidiBrackets
      },

      {
        name:
          "Unicode BidiMirroring",

        url:
          MATH_SOURCES.bidiMirroring
      },

      {
        name:
          "Unicode UTR #25",

        url:
          MATH_SOURCES.utr25
      }
    );
  }


  return {
    accepted,

    researchType,

    metadata: {
      category,
      unicodeName,
      block,
      script,
      age,
      generalCategory,

      aliases:
        profile.nameAliases,

      scriptExtensions:
        profile.scriptExtensions,

      standardizedVariants:
        profile.standardizedVariants,

      music:
        musicProfile,

      emoji:
        emojiProfile,

      historical:
        historicalProfile
          ? {
              source:
                historicalProfile.key,

              properties:
                historicalProfile.properties
            }
          : null,

      math:
        mathProfile,

      han:
        isHan
          ? {
              definition:
                hanProfile.definition,

              japaneseOn:
                hanProfile.japaneseOn,

              japaneseKun:
                hanProfile.japaneseKun,

              strokes:
                hanProfile.strokes,

              variants:
                hanProfile.variants,

              numeric:
                hanProfile.numeric,

              irgSources:
                hanProfile.irgSources,

              dictionary:
                hanProfile.dictionary,

              sourceFiles:
                hanProfile.sourceFiles
            }
          : null,

      unicodeData: {
        combiningClass:
          profile.combiningClass,

        bidiClass:
          profile.bidiClass,

        decomposition:
          profile.decomposition,

        decimalValue:
          profile.decimalValue,

        digitValue:
          profile.digitValue,

        numericValue:
          profile.numericValue,

        bidiMirrored:
          profile.bidiMirrored,

        unicode1Name:
          profile.unicode1Name,

        simpleUppercase:
          profile.simpleUppercase,

        simpleLowercase:
          profile.simpleLowercase,

        simpleTitlecase:
          profile.simpleTitlecase
      }
    },

    facts,

    sources,

    diagnostics: {
      strongFactCount:
        strongFacts.length,

      unihanFactCount:
        unihanFacts.length,

      namesListFactCount:
        namesListFacts.length
    }
  };
}

function sleep(
  milliseconds
) {

  return new Promise(
    (
      resolve
    ) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}


async function generateDescription(
  entry,
  research
) {

  const prompt = [
    "あなたはUnicode文字図鑑の編集者です。",
    "以下のUnicode公式資料から確認済みの事実だけを使って、日本語の短い解説を書いてください。",
    "資料にない事実を補わないでください。推測は禁止です。",
    "同じ事実を言い換えて水増ししないでください。",
    "summaryは1〜2文、usageは0〜1文、supplementalInfoは必要な場合だけ1文程度にしてください。",
    "summaryは対象文字・U+XXXX・Unicode名・「この文字は」などを主語にせず、見た目や意味の説明から直接始めてください。たとえば「横向きの角を持つ雄羊の頭をした蛇を表します。」のように書いてください。",
    "usageには根拠のある用途・機能が確認できる場合だけ書き、資料に用途がなければ空文字列にしてください。",
    "UnihanのkDefinitionは漢字の意味、kJapaneseOnは日本語の音読み、kJapaneseKunは日本語の訓読みです。漢字ではこれらをsummaryに自然にまとめてください。",
    "漢字ではkTotalStrokesは総画数、kRSUnicodeはUnicodeの部首・残画情報です。これらは補足として使えます。",
    "Unihanの各Variantプロパティは異体関係を表します。資料に明示された関係だけを書き、字形差の理由や歴史を推測しないでください。",
    "kPrimaryNumeric・kAccountingNumeric・kOtherNumericがある場合は、その文字にUnicodeが与えた数値情報として扱ってください。",
    "kIRG_*SourceはIRG出典識別子です。一般向け説明に必要な場合だけ補足し、意味や読みをそこから推測しないでください。",
    "記号ではUnicodeの正式名称を、その記号の形や種類を説明する根拠として使えます。ただし正式名称から実際の用途を推測しないでください。",
    "かなではUnicode名と表示文字から、ひらがな・カタカナのどの文字かを簡潔に説明してください。資料にない語源や歴史は足さないでください。",
    "数字ではUnicode名から確認できる数字・数値表現だけを説明し、用途を推測しないでください。",
    "音楽記号ではUnicode名に加えてSMuFLのglyph descriptionとclassがある場合、それらを専門資料として優先してください。ただし資料にない楽典上の追加情報は補わないでください。",
    "EmojiではUnicode Emoji propertyとCLDR日本語annotationsがある場合、日本語short nameとkeywordsを根拠として使ってください。keywordsから新しい意味や用途を推測しないでください。",
    "歴史文字では各Unicode source fileに明記された読み・出典・数値・分類情報だけを使い、資料にない語源や歴史的背景を補わないでください。",
    "数学・一般記号ではUnicode Math property、NamesList、BidiBrackets、BidiMirroringを根拠にできます。括弧の対応関係やミラー関係は説明できますが、用途を名前だけから推測しないでください。",
    "発音・転写文字ではUnicode名とNamesList注釈にある情報だけを使い、具体的な発音値を資料なしで推測しないでください。",
    "エジプト文字の転写はfactsのfunctionValueから別欄に表示するため、usageには混ぜないでください。",
    "supplementalInfoは本文を理解する助けになる追加情報だけにしてください。",
    "カタログ番号・分類番号・Unicode名・コードポイント・ブロック名・Unicode追加バージョンだけしか材料がない場合、supplementalInfoは必ず空文字列にしてください。",
    "",
    "対象文字:",
    entry.character +
      " U+" +
      entry.codePoint,
    "",
    "抽選カテゴリ:",
    entry.category,
    "",
    "調査タイプ:",
    research.researchType,
    "",
    "基本情報:",
    JSON.stringify(
      research.metadata,
      null,
      2
    ),
    "",
    "確認済みの文字固有情報:",
    JSON.stringify(
      research.facts,
      null,
      2
    )
  ].join(
    "\n"
  );


  const body = {
    model:
      "gemini-3.1-flash-lite",

    input:
      prompt,

    response_format: {
      type:
        "text",

      mime_type:
        "application/json",

      schema: {
        type:
          "object",

        properties: {
          summary: {
            type:
              "string"
          },

          usage: {
            type:
              "string"
          },

          supplementalInfo: {
            type:
              "string"
          }
        },

        required: [
          "summary",
          "usage",
          "supplementalInfo"
        ]
      }
    }
  };


  for (
    let attempt = 1;
    attempt <= 4;
    attempt++
  ) {

    const response =
      await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-goog-api-key":
              API_KEY
          },

          body:
            JSON.stringify(
              body
            ),

          signal:
            AbortSignal.timeout(
              60000
            )
        }
      );


    const raw =
      await response.text();


    if (
      response.ok
    ) {

      const data =
        JSON.parse(
          raw
        );


      const text =
        (
          data.steps
          ||
          []
        )
          .filter(
            (
              step
            ) =>
              step.type ===
                "model_output"
          )
          .flatMap(
            (
              step
            ) =>
              step.content
              ||
              []
          )
          .filter(
            (
              part
            ) =>
              part.type ===
                "text"
          )
          .map(
            (
              part
            ) =>
              part.text
              ||
              ""
          )
          .join(
            ""
          )
          .trim();


      if (
        !text
      ) {

        throw new Error(
          "Gemini returned no text."
        );
      }


      return JSON.parse(
        text
      );
    }


    if (
      ![
        429,
        503
      ].includes(
        response.status
      )
      ||
      attempt ===
        4
    ) {

      throw new Error(
        "Gemini API error: " +
        response.status +
        " " +
        raw
      );
    }


    console.warn(
      "Gemini temporary error " +
      response.status +
      ". Retrying..."
    );


    await sleep(
      2000 *
      Math.pow(
        2,
        attempt -
          1
      )
    );
  }


  throw new Error(
    "Gemini description failed."
  );
}


async function generateAcceptedEntry(
  fonts,
  sourceTexts,
  date,
  avoidCodePoint =
    null
) {

  const MAX_RESEARCH_ATTEMPTS =
    60;


  const category =
    pickDailyCategory();


  console.log(
    "Selected daily category: " +
    category
  );


  for (
    let attempt = 1;
    attempt <=
      MAX_RESEARCH_ATTEMPTS;
    attempt++
  ) {

    const entry =
      generateEntry(
        fonts,
        date,
        avoidCodePoint,
        category
      );


    const research =
      researchCharacter(
        sourceTexts,
        entry
      );


    console.log(
      "Research attempt " +
      attempt +
      ": " +
      entry.character +
      " U+" +
      entry.codePoint +
      " -> " +
      (
        research.accepted
          ? "accepted"
          : "rejected"
      )
      +
      " [" +
      research.researchType +
      "; strong=" +
      research.diagnostics.strongFactCount +
      "; unihan=" +
      research.diagnostics.unihanFactCount +
      "; namesList=" +
      research.diagnostics.namesListFactCount +
      "]"
    );


    if (
      !research.accepted
    ) {
      continue;
    }


    const description =
      await generateDescription(
        entry,
        research
      );


    const supplementalKinds =
      new Set(
        [
          "namesList:alias",
          "namesList:formalAlias",
          "namesList:notice",
          "namesList:crossReference",
          "namesList:decomposition",
          "namesList:variation"
        ]
      );


    const hasSupplementalFacts =
      research.facts.some(
        (
          fact
        ) =>
          supplementalKinds.has(
            fact.kind
          )
      );


    return {
      ...entry,

      info: {
        ...research.metadata,

        summary:
          description.summary,

        usage:
          description.usage,

        supplementalInfo:
          hasSupplementalFacts
            ? description.supplementalInfo
            : "",

        facts:
          research.facts,

        sources:
          research.sources
      }
    };
  }


  throw new Error(
    "Could not find a sufficiently documented character within " +
    MAX_RESEARCH_ATTEMPTS +
    " attempts."
  );
}


async function main() {

  console.log(
    "Loading fonts..."
  );


  const fonts =
    loadFonts();


  console.log(
    "Loading Unicode official research data..."
  );


  const sourceTexts =
    await loadResearchSources();


  const currentDate =
    getJSTDateString(
      0
    );


  const nextDate =
    getJSTDateString(
      1
    );


  const existing =
    loadExistingDailyData();


  const hasDescription = (
    entry
  ) => {

    return Boolean(
      entry
      &&
      entry.info
      &&
      typeof entry.info.summary ===
        "string"
      &&
      entry.info.summary.trim()
    );
  };


  let current;


  if (
    existing.current
    &&
    existing.current.date ===
      currentDate
    &&
    hasDescription(
      existing.current
    )
  ) {

    current =
      existing.current;


    console.log(
      "Keeping described current character."
    );

  } else if (
    existing.next
    &&
    existing.next.date ===
      currentDate
    &&
    hasDescription(
      existing.next
    )
  ) {

    current =
      existing.next;


    console.log(
      "Promoting described next character to current."
    );

  } else {

    console.log(
      "Generating described current character..."
    );


    current =
      await generateAcceptedEntry(
        fonts,
        sourceTexts,
        currentDate
      );
  }


  let next;


  if (
    existing.next
    &&
    existing.next.date ===
      nextDate
    &&
    hasDescription(
      existing.next
    )
    &&
    existing.next.codePoint !==
      current.codePoint
  ) {

    next =
      existing.next;


    console.log(
      "Keeping described next character."
    );

  } else {

    console.log(
      "Generating described next character..."
    );


    next =
      await generateAcceptedEntry(
        fonts,
        sourceTexts,
        nextDate,
        parseInt(
          current.codePoint,
          16
        )
      );
  }


  const data = {
    current,
    next
  };


  fs.writeFileSync(
    DAILY_JSON_PATH,
    JSON.stringify(
      data,
      null,
      2
    )
    +
    "\n",
    "utf8"
  );


  console.log(
    "Current: " +
    current.character +
    " U+" +
    current.codePoint +
    " [" +
    current.category +
    "]"
  );


  console.log(
    "Next: " +
    next.character +
    " U+" +
    next.codePoint +
    " [" +
    next.category +
    "]"
  );


  console.log(
    "daily.json updated with descriptions."
  );
}

main().catch(
  (
    error
  ) => {

    console.error(
      error
    );


    process.exit(
      1
    );
  }
);
