const {
  UCD_BASE,
  fetchText
} = require("./ucd-profile.js");


const EMOJI_DATA_URL =
  UCD_BASE +
  "/emoji/emoji-data.txt";


const CLDR_JA_ANNOTATIONS_URL =
  "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-annotations-full/annotations/ja/annotations.json";


async function fetchJson(
  url
) {

  const response =
    await fetch(
      url,
      {
        headers: {
          "User-Agent":
            "Unicode-Converter production research"
        },

        signal:
          AbortSignal.timeout(
            30000
          )
      }
    );


  if (
    !response.ok
  ) {

    throw new Error(
      response.status +
      " " +
      response.statusText +
      ": " +
      url
    );
  }


  return response.json();
}


function parseRange(
  raw
) {

  const value =
    raw.trim();


  if (
    value.includes(
      ".."
    )
  ) {

    const [
      start,
      end
    ] =
      value.split(
        ".."
      );


    return [
      parseInt(
        start,
        16
      ),

      parseInt(
        end,
        16
      )
    ];
  }


  const point =
    parseInt(
      value,
      16
    );


  return [
    point,
    point
  ];
}


function parseEmojiProperties(
  text
) {

  const properties =
    new Map();


  for (
    const line
    of text.split(
      /\r?\n/
    )
  ) {

    const data =
      line
        .split(
          "#"
        )[0]
        .trim();


    if (
      !data
      ||
      !data.includes(
        ";"
      )
    ) {
      continue;
    }


    const [
      rangeText,
      propertyText
    ] =
      data.split(
        ";",
        2
      );


    const property =
      propertyText.trim();


    const [
      start,
      end
    ] =
      parseRange(
        rangeText
      );


    if (
      !property
      ||
      !Number.isInteger(
        start
      )
      ||
      !Number.isInteger(
        end
      )
    ) {
      continue;
    }


    const ranges =
      properties.get(
        property
      )
      ||
      [];


    ranges.push(
      {
        start,
        end
      }
    );


    properties.set(
      property,
      ranges
    );
  }


  for (
    const ranges
    of properties.values()
  ) {

    ranges.sort(
      (
        a,
        b
      ) =>
        a.start -
        b.start
    );
  }


  return properties;
}


function isInRanges(
  ranges,
  codePoint
) {

  let low =
    0;

  let high =
    ranges.length -
    1;


  while (
    low <=
      high
  ) {

    const middle =
      Math.floor(
        (
          low +
          high
        ) /
        2
      );


    const range =
      ranges[
        middle
      ];


    if (
      codePoint <
        range.start
    ) {

      high =
        middle -
        1;

    } else if (
      codePoint >
        range.end
    ) {

      low =
        middle +
        1;

    } else {

      return true;
    }
  }


  return false;
}


async function loadEmojiData() {

  const [
    emojiText,
    annotationsJson
  ] =
    await Promise.all(
      [
        fetchText(
          EMOJI_DATA_URL
        ),

        fetchJson(
          CLDR_JA_ANNOTATIONS_URL
        )
      ]
    );


  return {
    properties:
      parseEmojiProperties(
        emojiText
      ),

    annotations:
      annotationsJson.annotations
      &&
      annotationsJson.annotations.annotations
        ? annotationsJson.annotations.annotations
        : {}
  };
}


function buildEmojiProfile(
  data,
  codePoint
) {

  const character =
    String.fromCodePoint(
      codePoint
    );


  const propertyNames =
    [];


  for (
    const [
      property,
      ranges
    ]
    of data.properties
  ) {

    if (
      isInRanges(
        ranges,
        codePoint
      )
    ) {

      propertyNames.push(
        property
      );
    }
  }


  const annotation =
    data.annotations[
      character
    ]
    ||
    null;


  if (
    propertyNames.length ===
      0
    &&
    !annotation
  ) {
    return null;
  }


  return {
    shortName:
      annotation
      &&
      Array.isArray(
        annotation.tts
      )
      ? annotation.tts[
          0
        ]
        ||
        null
      : null,

    keywords:
      annotation
      &&
      Array.isArray(
        annotation.default
      )
      ? annotation.default
      : [],

    properties:
      propertyNames
  };
}


module.exports = {
  EMOJI_DATA_URL,
  CLDR_JA_ANNOTATIONS_URL,
  loadEmojiData,
  buildEmojiProfile
};
