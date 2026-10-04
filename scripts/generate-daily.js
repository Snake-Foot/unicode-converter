const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dailyPath =
  path.join(process.cwd(), "daily.json");


function getJSTDateString(offsetDays = 0) {

  const date =
    new Date(
      Date.now() +
      offsetDays * 24 * 60 * 60 * 1000
    );

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(date);

  const part =
    (type) =>
      parts.find(
        (p) => p.type === type
      )?.value;

  return (
    part("year") +
    "-" +
    part("month") +
    "-" +
    part("day")
  );
}


function isUsableCharacter(codePoint) {

  if (
    codePoint >= 0xD800 &&
    codePoint <= 0xDFFF
  ) {
    return false;
  }

  const character =
    String.fromCodePoint(codePoint);

  if (!/\p{Assigned}/u.test(character)) {
    return false;
  }

  if (/\p{Cc}/u.test(character)) {
    return false;
  }

  if (/\p{Cf}/u.test(character)) {
    return false;
  }

  if (/\p{Co}/u.test(character)) {
    return false;
  }

  if (/\p{M}/u.test(character)) {
    return false;
  }

  if (/\p{Z}/u.test(character)) {
    return false;
  }

  return true;
}


function randomCodePoint() {

  while (true) {

    const codePoint =
      crypto.randomInt(
        0,
        0x110000
      );

    if (
      isUsableCharacter(codePoint)
    ) {
      return codePoint;
    }

  }
}


function makeEntry(date) {

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


function findByDate(data, date) {

  return (
    [
      data.current,
      data.next
    ].find(
      (entry) => {

        if (
          !entry ||
          entry.date !== date
        ) {
          return false;
        }

        if (
          typeof entry.codePoint !== "string" ||
          !/^[0-9A-F]+$/i.test(entry.codePoint)
        ) {
          return false;
        }

        const codePoint =
          parseInt(
            entry.codePoint,
            16
          );

        if (
          codePoint < 0 ||
          codePoint > 0x10FFFF ||
          (
            codePoint >= 0xD800 &&
            codePoint <= 0xDFFF
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


const oldData =
  readExisting();

const today =
  getJSTDateString(0);

const tomorrow =
  getJSTDateString(1);


const current =
  findByDate(
    oldData,
    today
  )
  ||
  makeEntry(today);


const next =
  findByDate(
    oldData,
    tomorrow
  )
  ||
  makeEntry(tomorrow);


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
  ) + "\n",
  "utf8"
);


console.log(
  "Updated daily.json:",
  newData
);
