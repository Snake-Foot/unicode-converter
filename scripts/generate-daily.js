const fs = require("fs");
const crypto = require("crypto");

function isUsableCharacter(codePoint) {
  // サロゲート
  if (
    codePoint >= 0xD800 &&
    codePoint <= 0xDFFF
  ) {
    return false;
  }

  const character =
    String.fromCodePoint(codePoint);

  // 未割り当て
  if (!/\p{Assigned}/u.test(character)) {
    return false;
  }

  // 制御文字
  if (/\p{Cc}/u.test(character)) {
    return false;
  }

  // 書式制御
  if (/\p{Cf}/u.test(character)) {
    return false;
  }

  // 私用領域
  if (/\p{Co}/u.test(character)) {
    return false;
  }

  // 結合文字
  if (/\p{M}/u.test(character)) {
    return false;
  }

  // 空白系
  if (/\p{Z}/u.test(character)) {
    return false;
  }

  return true;
}


function randomCodePoint() {
  while (true) {
    const randomNumber =
      crypto.randomInt(0, 0x110000);

    if (
      isUsableCharacter(randomNumber)
    ) {
      return randomNumber;
    }
  }
}


function getTomorrowInJST() {
  const now = new Date();

  const jstNow =
    new Date(
      now.toLocaleString(
        "en-US",
        {
          timeZone: "Asia/Tokyo"
        }
      )
    );

  jstNow.setDate(
    jstNow.getDate() + 1
  );

  const year =
    jstNow.getFullYear();

  const month =
    String(
      jstNow.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      jstNow.getDate()
    ).padStart(2, "0");

  return (
    year +
    "-" +
    month +
    "-" +
    day
  );
}


const codePoint =
  randomCodePoint();

const character =
  String.fromCodePoint(
    codePoint
  );

const hex =
  codePoint
    .toString(16)
    .toUpperCase();

const data = {
  date: getTomorrowInJST(),
  codePoint: hex,
  character: character
};

fs.writeFileSync(
  "daily.json",
  JSON.stringify(
    data,
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(
  "Generated daily character:",
  data
);
