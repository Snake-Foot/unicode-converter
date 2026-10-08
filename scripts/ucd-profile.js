const UCD_BASE =
  "https://www.unicode.org/Public/UCD/latest/ucd";


const COMMON_UCD_SOURCES = {
  unicodeData:
    UCD_BASE +
    "/UnicodeData.txt",

  nameAliases:
    UCD_BASE +
    "/NameAliases.txt",

  scriptExtensions:
    UCD_BASE +
    "/ScriptExtensions.txt",

  standardizedVariants:
    UCD_BASE +
    "/StandardizedVariants.txt",

  derivedName:
    UCD_BASE +
    "/extracted/DerivedName.txt",

  blocks:
    UCD_BASE +
    "/Blocks.txt",

  scripts:
    UCD_BASE +
    "/Scripts.txt",

  age:
    UCD_BASE +
    "/DerivedAge.txt",

  generalCategory:
    UCD_BASE +
    "/extracted/DerivedGeneralCategory.txt",

  namesList:
    UCD_BASE +
    "/NamesList.txt"
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


async function fetchText(
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


  return response.text();
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


function parseRangeTable(
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
      valueText
    ] =
      data.split(
        ";",
        2
      );


    const [
      start,
      end
    ] =
      parseRange(
        rangeText
      );


    const value =
      valueText.trim();


    if (
      !Number.isInteger(
        start
      )
      ||
      !Number.isInteger(
        end
      )
      ||
      !value
    ) {
      continue;
    }


    ranges.push(
      {
        start,
        end,
        value
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


function findRangeValue(
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

      return range.value;
    }
  }


  return null;
}


function parseUnicodeData(
  text
) {

  const exact =
    new Map();

  const ranges =
    [];

  let pendingRange =
    null;


  for (
    const line
    of text.split(
      /\r?\n/
    )
  ) {

    if (
      !line
    ) {
      continue;
    }


    const fields =
      line.split(
        ";"
      );


    if (
      fields.length <
        15
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


    if (
      !Number.isInteger(
        codePoint
      )
    ) {
      continue;
    }


    const record = {
      name:
        fields[
          1
        ]
        ||
        null,

      generalCategory:
        fields[
          2
        ]
        ||
        null,

      combiningClass:
        fields[
          3
        ]
        ||
        null,

      bidiClass:
        fields[
          4
        ]
        ||
        null,

      decomposition:
        fields[
          5
        ]
        ||
        null,

      decimalValue:
        fields[
          6
        ]
        ||
        null,

      digitValue:
        fields[
          7
        ]
        ||
        null,

      numericValue:
        fields[
          8
        ]
        ||
        null,

      bidiMirrored:
        fields[
          9
        ] ===
        "Y",

      unicode1Name:
        fields[
          10
        ]
        ||
        null,

      isoComment:
        fields[
          11
        ]
        ||
        null,

      simpleUppercase:
        fields[
          12
        ]
        ||
        null,

      simpleLowercase:
        fields[
          13
        ]
        ||
        null,

      simpleTitlecase:
        fields[
          14
        ]
        ||
        null
    };


    if (
      /, First>$/.test(
        record.name
        ||
        ""
      )
    ) {

      pendingRange = {
        start:
          codePoint,

        record
      };


      continue;
    }


    if (
      /, Last>$/.test(
        record.name
        ||
        ""
      )
      &&
      pendingRange
    ) {

      ranges.push(
        {
          start:
            pendingRange.start,

          end:
            codePoint,

          record: {
            ...pendingRange.record,
            name:
              null
          }
        }
      );


      pendingRange =
        null;


      continue;
    }


    exact.set(
      codePoint,
      record
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


  return {
    exact,
    ranges
  };
}


function findUnicodeData(
  data,
  codePoint
) {

  const exact =
    data.exact.get(
      codePoint
    );


  if (
    exact
  ) {
    return exact;
  }


  let low =
    0;

  let high =
    data.ranges.length -
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
      data.ranges[
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

      return range.record;
    }
  }


  return null;
}


function parseNameAliases(
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
      data.split(
        ";"
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
        ].trim(),
        16
      );


    const alias =
      fields[
        1
      ].trim();

    const type =
      fields[
        2
      ].trim();


    if (
      !Number.isInteger(
        codePoint
      )
      ||
      !alias
    ) {
      continue;
    }


    const aliases =
      lookup.get(
        codePoint
      )
      ||
      [];


    aliases.push(
      {
        alias,
        type
      }
    );


    lookup.set(
      codePoint,
      aliases
    );
  }


  return lookup;
}


function parseNamesList(
  text
) {

  const lookup =
    new Map();

  let currentCodePoint =
    null;


  for (
    const line
    of text.split(
      /\r?\n/
    )
  ) {

    const match =
      line.match(
        /^([0-9A-F]{4,6})\t(.*)$/
      );


    if (
      match
    ) {

      currentCodePoint =
        parseInt(
          match[
            1
          ],
          16
        );


      lookup.set(
        currentCodePoint,
        [
          {
            type:
              "name",

            text:
              match[
                2
              ].trim()
          }
        ]
      );


      continue;
    }


    if (
      currentCodePoint ===
        null
      ||
      !line.startsWith(
        "\t"
      )
    ) {
      continue;
    }


    const item =
      line.trim();


    if (
      !item
    ) {
      continue;
    }


    const marker =
      item[
        0
      ];


    const body =
      item
        .slice(
          1
        )
        .trim();


    const typeMap = {
      "*":
        "comment",

      "=":
        "alias",

      "%":
        "formalAlias",

      "#":
        "notice",

      "x":
        "crossReference",

      ":":
        "decomposition",

      "~":
        "variation"
    };


    const entries =
      lookup.get(
        currentCodePoint
      )
      ||
      [];


    entries.push(
      {
        type:
          typeMap[
            marker
          ]
          ||
          "other",

        text:
          body
          ||
          item
      }
    );


    lookup.set(
      currentCodePoint,
      entries
    );
  }


  return lookup;
}


function parseStandardizedVariants(
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
      data.split(
        ";"
      );


    if (
      fields.length <
        2
    ) {
      continue;
    }


    const sequence =
      fields[
        0
      ]
        .trim()
        .split(
          /\s+/
        )
        .map(
          (
            value
          ) =>
            parseInt(
              value,
              16
            )
        );


    if (
      sequence.length <
        2
      ||
      sequence.some(
        (
          value
        ) =>
          !Number.isInteger(
            value
          )
      )
    ) {
      continue;
    }


    const description =
      fields[
        1
      ].trim();


    const condition =
      fields
        .slice(
          2
        )
        .join(
          ";"
        )
        .trim();


    const baseCodePoint =
      sequence[
        0
      ];


    const variants =
      lookup.get(
        baseCodePoint
      )
      ||
      [];


    variants.push(
      {
        sequence:
          sequence.map(
            hex
          ),

        variationSelector:
          hex(
            sequence[
              1
            ]
          ),

        description,
        condition
      }
    );


    lookup.set(
      baseCodePoint,
      variants
    );
  }


  return lookup;
}


async function loadCommonUcdData() {

  const entries =
    Object.entries(
      COMMON_UCD_SOURCES
    );


  const texts =
    await Promise.all(
      entries.map(
        (
          [
            ,
            url
          ]
        ) =>
          fetchText(
            url
          )
      )
    );


  const raw =
    Object.fromEntries(
      entries.map(
        (
          [
            key
          ],
          index
        ) => [
          key,
          texts[
            index
          ]
        ]
      )
    );


  return {
    unicodeData:
      parseUnicodeData(
        raw.unicodeData
      ),

    nameAliases:
      parseNameAliases(
        raw.nameAliases
      ),

    scriptExtensions:
      parseRangeTable(
        raw.scriptExtensions
      ),

    standardizedVariants:
      parseStandardizedVariants(
        raw.standardizedVariants
      ),

    derivedName:
      parseRangeTable(
        raw.derivedName
      ),

    blocks:
      parseRangeTable(
        raw.blocks
      ),

    scripts:
      parseRangeTable(
        raw.scripts
      ),

    age:
      parseRangeTable(
        raw.age
      ),

    generalCategory:
      parseRangeTable(
        raw.generalCategory
      ),

    namesList:
      parseNamesList(
        raw.namesList
      )
  };
}


function buildCommonProfile(
  data,
  codePoint
) {

  const unicodeData =
    findUnicodeData(
      data.unicodeData,
      codePoint
    )
    ||
    {};


  const derivedName =
    findRangeValue(
      data.derivedName,
      codePoint
    );


  const unicodeDataName =
    unicodeData.name
    &&
    !/^<.*>$/.test(
      unicodeData.name
    )
      ? unicodeData.name
      : null;


  const unicodeName =
    derivedName
      ? derivedName.replace(
          /\*/g,
          hex(
            codePoint
          )
        )
      : unicodeDataName;


  const scriptExtensionsRaw =
    findRangeValue(
      data.scriptExtensions,
      codePoint
    );


  return {
    unicodeName,

    unicodeDataName,

    block:
      findRangeValue(
        data.blocks,
        codePoint
      ),

    script:
      findRangeValue(
        data.scripts,
        codePoint
      ),

    age:
      findRangeValue(
        data.age,
        codePoint
      ),

    generalCategory:
      findRangeValue(
        data.generalCategory,
        codePoint
      )
      ||
      unicodeData.generalCategory
      ||
      null,

    combiningClass:
      unicodeData.combiningClass
      ||
      null,

    bidiClass:
      unicodeData.bidiClass
      ||
      null,

    decomposition:
      unicodeData.decomposition
      ||
      null,

    decimalValue:
      unicodeData.decimalValue
      ||
      null,

    digitValue:
      unicodeData.digitValue
      ||
      null,

    numericValue:
      unicodeData.numericValue
      ||
      null,

    bidiMirrored:
      typeof unicodeData.bidiMirrored ===
        "boolean"
        ? unicodeData.bidiMirrored
        : null,

    unicode1Name:
      unicodeData.unicode1Name
      ||
      null,

    simpleUppercase:
      unicodeData.simpleUppercase
      ||
      null,

    simpleLowercase:
      unicodeData.simpleLowercase
      ||
      null,

    simpleTitlecase:
      unicodeData.simpleTitlecase
      ||
      null,

    nameAliases:
      data.nameAliases.get(
        codePoint
      )
      ||
      [],

    scriptExtensions:
      scriptExtensionsRaw
        ? scriptExtensionsRaw.split(
            /\s+/
          )
        : [],

    standardizedVariants:
      data.standardizedVariants.get(
        codePoint
      )
      ||
      [],

    namesList:
      data.namesList.get(
        codePoint
      )
      ||
      []
  };
}


module.exports = {
  UCD_BASE,
  COMMON_UCD_SOURCES,
  fetchText,
  loadCommonUcdData,
  buildCommonProfile
};
