const AdmZip =
  require("adm-zip");

const {
  UCD_BASE
} = require("./ucd-profile.js");


const UNIHAN_URL =
  UCD_BASE +
  "/Unihan.zip";


const UNIHAN_FILES = {
  readings:
    "Unihan_Readings.txt",

  dictionaryLike:
    "Unihan_DictionaryLikeData.txt",

  variants:
    "Unihan_Variants.txt",

  irgSources:
    "Unihan_IRGSources.txt",

  radicalStrokeCounts:
    "Unihan_RadicalStrokeCounts.txt",

  numericValues:
    "Unihan_NumericValues.txt"
};


async function fetchBuffer(
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


  return Buffer.from(
    await response.arrayBuffer()
  );
}


function readZipText(
  zip,
  fileName
) {

  const entry =
    zip
      .getEntries()
      .find(
        (
          item
        ) =>
          item.entryName ===
            fileName
          ||
          item.entryName.endsWith(
            "/" +
            fileName
          )
      );


  if (
    !entry
  ) {

    throw new Error(
      "Unihan file not found in zip: " +
      fileName
    );
  }


  return entry
    .getData()
    .toString(
      "utf8"
    );
}


function mergeUnihanProperties(
  lookup,
  text,
  fileName
) {

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
      !/^U\+[0-9A-F]+$/i.test(
        fields[
          0
        ]
      )
    ) {
      continue;
    }


    const codePoint =
      parseInt(
        fields[
          0
        ].slice(
          2
        ),
        16
      );


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
      !Number.isInteger(
        codePoint
      )
      ||
      !property
      ||
      !value
    ) {
      continue;
    }


    let record =
      lookup.get(
        codePoint
      );


    if (
      !record
    ) {

      record = {
        properties:
          {},

        sourceFiles:
          {}
      };


      lookup.set(
        codePoint,
        record
      );
    }


    const previous =
      record.properties[
        property
      ];


    if (
      previous
      &&
      previous !==
        value
    ) {

      record.properties[
        property
      ] =
        previous +
        " " +
        value;

    } else {

      record.properties[
        property
      ] =
        value;
    }


    record.sourceFiles[
      property
    ] =
      fileName;
  }
}


async function loadUnihanData() {

  const buffer =
    await fetchBuffer(
      UNIHAN_URL
    );


  const zip =
    new AdmZip(
      buffer
    );


  const lookup =
    new Map();


  for (
    const fileName
    of Object.values(
      UNIHAN_FILES
    )
  ) {

    mergeUnihanProperties(
      lookup,
      readZipText(
        zip,
        fileName
      ),
      fileName
    );
  }


  return lookup;
}


function pickProperties(
  properties,
  names
) {

  const result =
    {};


  for (
    const name
    of names
  ) {

    if (
      properties[
        name
      ]
    ) {

      result[
        name
      ] =
        properties[
          name
        ];
    }
  }


  return result;
}


function buildHanProfile(
  data,
  codePoint
) {

  const record =
    data.get(
      codePoint
    )
    ||
    {
      properties:
        {},

      sourceFiles:
        {}
    };


  const properties =
    record.properties;


  const irgSources =
    Object.fromEntries(
      Object.entries(
        properties
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
    );


  const sourceFiles =
    [
      ...new Set(
        Object.values(
          record.sourceFiles
        )
      )
    ];


  return {
    definition:
      properties.kDefinition
      ||
      null,

    japaneseOn:
      properties.kJapaneseOn
      ||
      null,

    japaneseKun:
      properties.kJapaneseKun
      ||
      null,

    strokes: {
      total:
        properties.kTotalStrokes
        ||
        null,

      alternateTotal:
        properties.kAlternateTotalStrokes
        ||
        null,

      radicalStroke:
        properties.kRSUnicode
        ||
        null,

      adobeJapan1:
        properties.kRSAdobe_Japan1_6
        ||
        null
    },

    variants:
      pickProperties(
        properties,
        [
          "kCompatibilityVariant",
          "kJapaneseNewVariant",
          "kJapaneseOldVariant",
          "kSemanticVariant",
          "kSimplifiedVariant",
          "kSpecializedSemanticVariant",
          "kSpoofingVariant",
          "kTraditionalVariant",
          "kZVariant"
        ]
      ),

    numeric:
      pickProperties(
        properties,
        [
          "kAccountingNumeric",
          "kOtherNumeric",
          "kPrimaryNumeric",
          "kTayNumeric",
          "kVietnameseNumeric",
          "kZhuangNumeric"
        ]
      ),

    irgSources,

    dictionary:
      pickProperties(
        properties,
        [
          "kFourCornerCode",
          "kFrequency",
          "kGradeLevel",
          "kJinmeiyoKanji",
          "kJoyoKanji",
          "kKangXi",
          "kMorohashi",
          "kNelson",
          "kPhonetic",
          "kUnihanCore2020"
        ]
      ),

    properties,

    sourceFiles
  };
}


module.exports = {
  UNIHAN_URL,
  UNIHAN_FILES,
  loadUnihanData,
  buildHanProfile
};
