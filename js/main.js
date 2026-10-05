/* =========================================
   Events
========================================= */

charInput.addEventListener(
  "input",
  convertCharacters
);


unicodeInput.addEventListener(
  "input",
  () => {

    unicodeRun++;


    clearTimeout(
      unicodeInputTimer
    );


    hideUnicodeScope();


    unicodeInputTimer =
      setTimeout(
        convertUnicode,
        300
      );

  }
);


document
  .querySelectorAll(
    "[data-random-count]"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          generateRandomUnicode(
            Number(
              button.dataset.randomCount
            )
          );

        }
      );

    }
  );


backUnicode.addEventListener(
  "click",
  goBackUnicode
);


clearChar.addEventListener(
  "click",
  () => {

    charInput.value =
      "";


    unicodeOutput.textContent =
      "";


    hideUnicodeScope();


    charInput.focus();
  }
);


clearUnicode.addEventListener(
  "click",
  () => {

    unicodeRun++;


    clearTimeout(
      unicodeInputTimer
    );


    unicodeInput.value =
      "";


    charOutput.textContent =
      "";


    hideUnicodeScope();


    unicodeInput.focus();
  }
);

/* =========================================
   Startup
========================================= */

updateBackButton();


loadDailyCharacter();


let lastJSTDate =
  getJSTDateString();


setInterval(
  () => {

    const now =
      getJSTDateString();


    if (
      now !==
      lastJSTDate
    ) {

      lastJSTDate =
        now;


      hideUnicodeScope();


      loadDailyCharacter();
    }

  },
  60000
);
