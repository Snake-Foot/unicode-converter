const {
  UCD_BASE,
  fetchText
} = require("./ucd-profile.js");


const HISTORICAL_SOURCES = {
  jurchen: {
    name:
      "Unicode JurchenSources",

    url:
      UCD_BASE +
      "/JurchenSources.txt"
  },

  nushu: {
    name:
      "Unicode NushuSources",

    url:
      UCD_BASE +
      "/NushuSources.txt"
  },

  seal: {
    name:
      "Unicode SealSources",

    url:
      UCD_BASE +
      "/SealSources.txt"
  },

  tangut: {
    name:
      "Unicode TangutSources",

    url:
      UCD_BASE +
      "/TangutSources.txt"
  }
};


function parseTaggedData(
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


    const properties =
      lookup.get(
        codePoint
      )
      ||
      {};


    properties[
      property
    ] =
      value;


    lookup.set(
      codePoint,
      properties
    );
  }


  return lookup;
}


async function loadHistoricalData() {

  const entries =
    Object.entries(
      HISTORICAL_SOURCES
    );


  const loaded =
    await Promise.all(
      entries.map(
        async (
          [
            key,
            source
          ]
        ) => {

          try {

            return [
              key,
              parseTaggedData(
                await fetchText(
                  source.url
                )
              )
            ];

          } catch (
            error
          ) {

            console.warn(
              "Optional historical source unavailable: " +
              source.url +
              " (" +
              error.message +
              ")"
            );


            return [
              key,
              new Map()
            ];
          }
        }
      )
    );


  return Object.fromEntries(
    loaded
  );
}


function buildHistoricalProfile(
  data,
  codePoint,
  script
) {

  const preferred = {
    Jurchen:
      "jurchen",

    Nushu:
      "nushu",

    Seal:
      "seal",

    Small_Seal:
      "seal",

    Tangut:
      "tangut"
  }[
    script
  ];


  const keys =
    preferred
      ? [
          preferred,
          ...Object.keys(
            HISTORICAL_SOURCES
          ).filter(
            (
              key
            ) =>
              key !==
              preferred
          )
        ]
      : Object.keys(
          HISTORICAL_SOURCES
        );


  for (
    const key
    of keys
  ) {

    const properties =
      data[
        key
      ].get(
        codePoint
      );


    if (
      properties
    ) {

      return {
        key,

        sourceName:
          HISTORICAL_SOURCES[
            key
          ].name,

        sourceUrl:
          HISTORICAL_SOURCES[
            key
          ].url,

        properties
      };
    }
  }


  return null;
}


module.exports = {
  HISTORICAL_SOURCES,
  loadHistoricalData,
  buildHistoricalProfile
};
