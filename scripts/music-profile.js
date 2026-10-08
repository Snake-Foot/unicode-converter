const SMUFL_GLYPHNAMES_URL =
  "https://raw.githubusercontent.com/w3c-cg/smufl/gh-pages/metadata/glyphnames.json";


const SMUFL_CLASSES_URL =
  "https://raw.githubusercontent.com/w3c-cg/smufl/gh-pages/metadata/classes.json";


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


async function loadMusicData() {

  const [
    glyphNames,
    classes
  ] =
    await Promise.all(
      [
        fetchJson(
          SMUFL_GLYPHNAMES_URL
        ),

        fetchJson(
          SMUFL_CLASSES_URL
        )
      ]
    );


  const glyphClasses =
    new Map();


  for (
    const [
      className,
      glyphs
    ]
    of Object.entries(
      classes
    )
  ) {

    if (
      !Array.isArray(
        glyphs
      )
    ) {
      continue;
    }


    for (
      const glyphName
      of glyphs
    ) {

      const list =
        glyphClasses.get(
          glyphName
        )
        ||
        [];


      list.push(
        className
      );


      glyphClasses.set(
        glyphName,
        list
      );
    }
  }


  const byUnicode =
    new Map();


  for (
    const [
      glyphName,
      data
    ]
    of Object.entries(
      glyphNames
    )
  ) {

    const alternate =
      data.alternateCodepoint;


    if (
      !/^U\+[0-9A-F]+$/i.test(
        alternate
        ||
        ""
      )
    ) {
      continue;
    }


    const codePoint =
      parseInt(
        alternate.slice(
          2
        ),
        16
      );


    const matches =
      byUnicode.get(
        codePoint
      )
      ||
      [];


    matches.push(
      {
        glyphName,

        smuflCodepoint:
          data.codepoint
          ||
          null,

        unicodeCodepoint:
          alternate,

        description:
          data.description
          ||
          null,

        classes:
          glyphClasses.get(
            glyphName
          )
          ||
          []
      }
    );


    byUnicode.set(
      codePoint,
      matches
    );
  }


  return {
    byUnicode
  };
}


function buildMusicProfile(
  data,
  codePoint
) {

  const matches =
    data.byUnicode.get(
      codePoint
    )
    ||
    [];


  if (
    matches.length ===
      0
  ) {
    return null;
  }


  return {
    matches
  };
}


module.exports = {
  SMUFL_GLYPHNAMES_URL,
  SMUFL_CLASSES_URL,
  loadMusicData,
  buildMusicProfile
};
