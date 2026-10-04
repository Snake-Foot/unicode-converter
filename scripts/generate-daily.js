const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dailyPath =
  path.join(process.cwd(), "daily.json");


/* ================================= */
/* 見えないUnicode */
/* ================================= */

const knownInvisibleCodePoints =
  new Set([
    0x115F,
    0x1160,
    0x2800,
    0x3164,
    0xFFA0
  ]);


/* ================================= */
/* JST日付 */
/* ================================= */

function getJSTDateString(
  offsetDays = 0
) {

  const date =
    new Date(
      Date.now() +
      offsetDays *
      24 *
      60 *
      60 *
      1000
    );


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
      date
    );


  const part =
    (type) =>
      parts.find(
        (p) =>
          p.type === type
      )?.value;


  return (
    part("year") +
    "-" +
    part("month") +
    "-" +
    part("day")
  );
}


/* ================================= */
/* 不可視文字判定 */
/* ================================= */

function isInvisibleCharacter(
  codePoint,
  character
) {

  /*
    見た目が空白になることで
    知られている文字
  */

  if (
    knownInvisibleCodePoints.has(
      codePoint
    )
  ) {
    return true;
  }


  /*
    Unicodeが
    通常表示しないと定義している文字
  */

  if (
    /\p{Default_Ignorable_Code_Point}/u
      .test(
        character
      )
  ) {
    return true;
  }


  return false;
}


/* ================================= */
/* ランダム対象として使えるか */
/* ================================= */

function isUsableCharacter(
  codePoint
) {

  /*
    サロゲート領域
  */

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


  /*
    空白・不可視文字
  */

  if (
    isInvisibleCharacter(
      codePoint,
      character
    )
  ) {
    return false;
  }


  /*
    未割り当て文字
  */

  if (
    !/\p{Assigned}/u
      .test(
        character
      )
  ) {
    return false;
  }


  /*
    制御文字
  */

  if (
    /\p{Cc}/u
      .test(
        character
      )
  ) {
    return false;
  }


  /*
    Format文字
  */

  if (
    /\p{Cf}/u
      .test(
        character
      )
  ) {
    return false;
  }


  /*
    私用領域
  */

  if (
    /\p{Co}/u
      .test(
        character
      )
  ) {
    return false;
  }


  /*
    結合文字
  */

  if (
    /\p{M}/u
      .test(
        character
      )
  ) {
    return false;
  }


  /*
    空白・区切り文字
  */

  if (
    /\p{Z}/u
      .test(
        character
      )
  ) {
    return false;
  }


  return true;
}


/* ================================= */
/* ランダムUnicode */
/* ================================= */

function randomCodePoint() {

  while (
    true
  ) {

    const codePoint =
      crypto.randomInt(
        0,
        0x110000
      );


    if (
      isUsableCharacter(
        codePoint
      )
    ) {

      return codePoint;

    }
  }
}


/* ================================= */
/* daily.json用エントリー生成 */
/* ================================= */

function makeEntry(
  date
) {

  const codePoint =
    randomCodePoint();


  return {
    date: date,

    codePoint:
      codePoint
        .toString(16)
        .toUpperCase(),

    character:
      String.fromCodePoint(
        codePoint
      )
  };
}


/* ================================= */
/* 既存daily.json読み込み */
/* ================================= */

function readExisting() {

  try {

    return JSON.parse(
      fs.readFileSync(
        dailyPath,
        "utf8"
      )
    );

  } catch {

    return {
      current: null,
      next: null
    };

  }
}


/* ================================= */
/* 指定日の既存エントリー検索 */
/* ================================= */

function findByDate(
  data,
  date
) {

  return (
    [
      data.current,
      data.next
    ]
    .find(
      (entry) => {

        if (
          !entry ||
          entry.date !== date
        ) {
          return false;
        }


        if (
          typeof
            entry.codePoint !==
            "string"
          ||
          !/^[0-9A-F]+$/i
            .test(
              entry.codePoint
            )
        ) {
          return false;
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
        ) {
          return false;
        }


        if (
          codePoint < 0 ||
          codePoint > 0x10FFFF
        ) {
          return false;
        }


        if (
          codePoint >= 0xD800 &&
          codePoint <= 0xDFFF
        ) {
          return false;
        }


        /*
          既存の日付データでも、
          現在の抽選条件に合わない文字なら
          使い回さず再抽選する。
        */

        if (
          !isUsableCharacter(
            codePoint
          )
        ) {
          return false;
        }


        return true;
      }
    )
    ||
    null
  );
}


/* ================================= */
/* 今日・明日 */
/* ================================= */

const oldData =
  readExisting();


const today =
  getJSTDateString(
    0
  );


const tomorrow =
  getJSTDateString(
    1
  );


/* ================================= */
/* 今日 */
/* ================================= */

const current =
  findByDate(
    oldData,
    today
  )
  ||
  makeEntry(
    today
  );


/* ================================= */
/* 明日 */
/* ================================= */

const next =
  findByDate(
    oldData,
    tomorrow
  )
  ||
  makeEntry(
    tomorrow
  );


/* ================================= */
/* 保存 */
/* ================================= */

const newData = {
  current,
  next
};


fs.writeFileSync(
  dailyPath,
  JSON.stringify(
    newData,
    null,
    2
  )
  +
  "\n",
  "utf8"
);


console.log(
  "Updated daily.json:",
  newData
);
