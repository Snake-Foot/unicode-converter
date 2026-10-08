const {
  UCD_BASE,
  fetchText
} = require("./ucd-profile.js");


const MATH_SOURCES = {
  derivedCoreProperties:
    UCD_BASE +
    "/DerivedCoreProperties.txt",

  bidiBrackets:
    UCD_BASE +
    "/BidiBrackets.txt",

  bidiMirroring:
    UCD_BASE +
    "/BidiMirroring.txt",

  utr25:
    "https://www.unicode.org/reports/tr25/"
};


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


function parseMathRanges(
  text
) {

  const ranges =
    [];


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


    if (
      propertyText.trim() !==
        "Math"
    ) {
      continue;
    }


    const [
      start,
      end
    ] =
      parseRange(
        rangeText
      );


    ranges.push(
      {
        start,
        end
      }
    );
  }


  ranges.sort(
    (
      a,
      b
    ) =>
      a.start -
      b.start
  );


  return ranges;
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


function parseBidiBrackets(
  text
) {

  const lookup =
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
    ) {
      continue;
    }


    const fields =
      data
        .split(
          ";"
        )
        .map(
          (
            value
          ) =>
            value.trim()
        );


    if (
      fields.length <
        3
    ) {
      continue;
    }


    const codePoint =
      parseInt(
        fields[
          0
        ],
        16
      );


    const pairedCodePoint =
      parseInt(
        fields[
          1
        ],
        16
      );


    if (
      !Number.isInteger(
        codePoint
      )
      ||
      !Number.isInteger(
        pairedCodePoint
      )
    ) {
      continue;
    }


    lookup.set(
      codePoint,
      {
        pairedCodePoint,
        type:
          fields[
            2
          ]
      }
    );
  }


  return lookup;
}


function parseBidiMirroring(
  text
) {

  const lookup =
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
    ) {
      continue;
    }


    const fields =
      data
        .split(
          ";"
        )
        .map(
          (
            value
          ) =>
            value.trim()
        );


    if (
      fields.length <
        2
    ) {
      continue;
    }


    const codePoint =
      parseInt(
        fields[
          0
        ],
        16
      );


    const mirroredCodePoint =
      parseInt(
        fields[
          1
        ],
        16
      );


    if (
      Number.isInteger(
        codePoint
      )
      &&
      Number.isInteger(
        mirroredCodePoint
      )
    ) {

      lookup.set(
        codePoint,
        mirroredCodePoint
      );
    }
  }


  return lookup;
}


async function loadMathData() {

  const [
    derivedCoreProperties,
    bidiBrackets,
    bidiMirroring
  ] =
    await Promise.all(
      [
        fetchText(
          MATH_SOURCES.derivedCoreProperties
        ),

        fetchText(
          MATH_SOURCES.bidiBrackets
        ),

        fetchText(
          MATH_SOURCES.bidiMirroring
        )
      ]
    );


  return {
    mathRanges:
      parseMathRanges(
        derivedCoreProperties
      ),

    bidiBrackets:
      parseBidiBrackets(
        bidiBrackets
      ),

    bidiMirroring:
      parseBidiMirroring(
        bidiMirroring
      )
  };
}


function hex(
  codePoint
) {

  return codePoint
    .toString(
      16
    )
    .toUpperCase()
    .padStart(
      4,
      "0"
    );
}


function buildMathProfile(
  data,
  codePoint
) {

  const bracket =
    data.bidiBrackets.get(
      codePoint
    )
    ||
    null;


  const mirror =
    data.bidiMirroring.get(
      codePoint
    );


  const isMath =
    isInRanges(
      data.mathRanges,
      codePoint
    );


  if (
    !isMath
    &&
    !bracket
    &&
    !Number.isInteger(
      mirror
    )
  ) {
    return null;
  }


  return {
    isMath,

    bracket:
      bracket
        ? {
            pairedCodePoint:
              hex(
                bracket.pairedCodePoint
              ),

            type:
              bracket.type
          }
        : null,

    mirroredCodePoint:
      Number.isInteger(
        mirror
      )
        ? hex(
            mirror
          )
        : null
  };
}


module.exports = {
  MATH_SOURCES,
  loadMathData,
  buildMathProfile
};
