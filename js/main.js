/* =========================================
   Compact / bulk input modes
========================================= */

const MAX_RANDOM_COUNT =
  500;


let unicodeSingleValue =
  "";


let unicodeBulkValue =
  "";


function resizeExpandedTextarea(
  textarea
) {

  if (
    !textarea
    ||
    !textarea.classList.contains(
      "input-expanded"
    )
  ) {
    return;
  }


  textarea.style.height =
    "auto";


  textarea.style.height =
    textarea.scrollHeight +
    "px";
}


function setCharBulkMode(
  expanded
) {

  charInput.classList.toggle(
    "input-expanded",
    expanded
  );


  toggleCharView.textContent =
    expanded
      ? "1件入力"
      : "一括入力";


  toggleCharView.setAttribute(
    "aria-expanded",
    String(expanded)
  );


  if (
    expanded
  ) {

    requestAnimationFrame(
      () => {
        resizeExpandedTextarea(
          charInput
        );
      }
    );

  } else {

    charInput.style.height =
      "";


    charInput.scrollTop =
      0;


    charInput.scrollLeft =
      0;
  }
}


function sanitizeSingleUnicodeValue(
  value
) {

  const raw =
    String(
      value
      ||
      ""
    )
      .trim()
      .replace(
        /^U\+/i,
        ""
      )
      .replace(
        /^0x/i,
        ""
      )
      .toUpperCase();


  return raw
    .replace(
      /[^0-9A-F]/g,
      ""
    )
    .slice(
      0,
      6
    );
}


function getFirstUnicodeToken(
  value
) {

  const token =
    String(
      value
      ||
      ""
    )
      .trim()
      .split(
        /[\s,]+/
      )
      .filter(
        Boolean
      )[
        0
      ];


  return sanitizeSingleUnicodeValue(
    token
    ||
    ""
  );
}


function isUnicodeBulkMode() {

  return unicodeInputShell
    .classList
    .contains(
      "bulk-mode"
    );
}


function setUnicodeBulkMode(
  expanded,
  {
    preserveValues = true
  } = {}
) {

  const wasBulk =
    isUnicodeBulkMode();


  if (
    preserveValues
  ) {

    if (
      wasBulk
    ) {

      unicodeBulkValue =
        unicodeInput.value;

    } else {

      unicodeSingleValue =
        sanitizeSingleUnicodeValue(
          unicodeInput.value
        );
    }
  }


  unicodeInputShell
    .classList
    .toggle(
      "bulk-mode",
      expanded
    );


  unicodeInput
    .classList
    .toggle(
      "input-expanded",
      expanded
    );


  toggleUnicodeView.textContent =
    expanded
      ? "1件入力"
      : "一括入力";


  toggleUnicodeView.setAttribute(
    "aria-expanded",
    String(expanded)
  );


  if (
    expanded
  ) {

    unicodeInput.removeAttribute(
      "maxlength"
    );


    unicodeInput.placeholder =
      "例: U+1F600 U+3042";


    unicodeInputHint.textContent =
      "複数入力は空白・改行・カンマで区切れます。";


    if (
      preserveValues
    ) {

      unicodeInput.value =
        unicodeBulkValue
        ||
        (
          unicodeSingleValue
            ? "U+" +
              unicodeSingleValue
            : ""
        );
    }


    requestAnimationFrame(
      () => {
        resizeExpandedTextarea(
          unicodeInput
        );
      }
    );

  } else {

    unicodeInput.removeAttribute(
      "maxlength"
    );


    unicodeInput.placeholder =
      "1F600";


    unicodeInputHint.textContent =
      "0–9 / A–F、最大6桁";


    if (
      preserveValues
    ) {

      if (
        !unicodeSingleValue
        &&
        unicodeBulkValue
      ) {

        unicodeSingleValue =
          getFirstUnicodeToken(
            unicodeBulkValue
          );
      }


      unicodeInput.value =
        unicodeSingleValue;
    }


    unicodeInput.style.height =
      "";


    unicodeInput.scrollTop =
      0;


    unicodeInput.scrollLeft =
      0;
  }
}


function valueLooksBulkUnicode(
  value
) {

  const trimmed =
    String(
      value
      ||
      ""
    )
      .trim();


  if (
    !trimmed
  ) {
    return false;
  }


  return (
    /[\s,]/.test(
      trimmed
    )
    ||
    (
      trimmed.match(
        /U\+/gi
      )
      ||
      []
    ).length >
      1
  );
}


function scheduleUnicodeConversion() {

  unicodeRun++;


  clearTimeout(
    unicodeInputTimer
  );


  hideUnicodeScope();


  unicodeInputTimer =
    setTimeout(
      convertUnicode,
      220
    );
}


/* =========================================
   Mode buttons
========================================= */

toggleCharView.setAttribute(
  "aria-controls",
  "charInput"
);


toggleUnicodeView.setAttribute(
  "aria-controls",
  "unicodeInput"
);


toggleCharView.addEventListener(
  "click",
  () => {

    setCharBulkMode(
      !charInput
        .classList
        .contains(
          "input-expanded"
        )
    );
  }
);


toggleUnicodeView.addEventListener(
  "click",
  () => {

    setUnicodeBulkMode(
      !isUnicodeBulkMode()
    );


    convertUnicode();
  }
);


/* =========================================
   Character input
========================================= */

charInput.addEventListener(
  "input",
  () => {

    convertCharacters();


    resizeExpandedTextarea(
      charInput
    );
  }
);


/* =========================================
   Unicode input
========================================= */

unicodeInput.addEventListener(
  "input",
  () => {

    if (
      !isUnicodeBulkMode()
    ) {

      const raw =
        unicodeInput.value;


      if (
        valueLooksBulkUnicode(
          raw
        )
      ) {

        unicodeBulkValue =
          raw;


        setUnicodeBulkMode(
          true,
          {
            preserveValues:
              false
          }
        );


        unicodeInput.value =
          unicodeBulkValue;


        resizeExpandedTextarea(
          unicodeInput
        );

      } else {

        const sanitized =
          sanitizeSingleUnicodeValue(
            raw
          );


        if (
          unicodeInput.value !==
          sanitized
        ) {

          unicodeInput.value =
            sanitized;
        }


        unicodeSingleValue =
          sanitized;
      }

    } else {

      unicodeBulkValue =
        unicodeInput.value;


      resizeExpandedTextarea(
        unicodeInput
      );
    }


    scheduleUnicodeConversion();
  }
);


/* =========================================
   Random controls
========================================= */

function syncRandomCustomVisibility() {

  randomCustomWrap.hidden =
    randomCountSelect.value !==
    "custom";
}


function getSelectedRandomCount() {

  if (
    randomCountSelect.value !==
    "custom"
  ) {

    return Math.min(
      MAX_RANDOM_COUNT,
      Math.max(
        1,
        Number(
          randomCountSelect.value
        )
      )
    );
  }


  const parsed =
    Number.parseInt(
      randomCustomCount.value,
      10
    );


  const count =
    Number.isFinite(
      parsed
    )
      ? Math.min(
          MAX_RANDOM_COUNT,
          Math.max(
            1,
            parsed
          )
        )
      : 1;


  randomCustomCount.value =
    String(
      count
    );


  return count;
}


randomCountSelect.addEventListener(
  "change",
  () => {

    syncRandomCustomVisibility();


    if (
      !randomCustomWrap.hidden
    ) {

      randomCustomCount.focus();
    }
  }
);


randomCustomCount.addEventListener(
  "blur",
  () => {

    getSelectedRandomCount();
  }
);


generateRandomButton.addEventListener(
  "click",
  () => {

    const count =
      getSelectedRandomCount();


    if (
      count ===
      1
    ) {

      setUnicodeBulkMode(
        false,
        {
          preserveValues:
            false
        }
      );


      generateRandomUnicode(
        count,
        true
      );


      unicodeSingleValue =
        unicodeInput.value;

    } else {

      setUnicodeBulkMode(
        true,
        {
          preserveValues:
            false
        }
      );


      generateRandomUnicode(
        count,
        false
      );


      unicodeBulkValue =
        unicodeInput.value;


      requestAnimationFrame(
        () => {
          resizeExpandedTextarea(
            unicodeInput
          );
        }
      );
    }
  }
);


/* =========================================
   History / clear
========================================= */

backUnicode.addEventListener(
  "click",
  () => {

    goBackUnicode();


    if (
      valueLooksBulkUnicode(
        unicodeInput.value
      )
    ) {

      unicodeBulkValue =
        unicodeInput.value;


      setUnicodeBulkMode(
        true,
        {
          preserveValues:
            false
        }
      );

    } else {

      unicodeSingleValue =
        sanitizeSingleUnicodeValue(
          unicodeInput.value
        );


      setUnicodeBulkMode(
        false,
        {
          preserveValues:
            false
        }
      );


      unicodeInput.value =
        unicodeSingleValue;
    }


    convertUnicode();
  }
);


clearChar.addEventListener(
  "click",
  () => {

    charInput.value =
      "";


    unicodeOutput.textContent =
      "";


    setCharBulkMode(
      false
    );


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


    unicodeSingleValue =
      "";


    unicodeBulkValue =
      "";


    unicodeInput.value =
      "";


    charOutput.textContent =
      "";


    setUnicodeBulkMode(
      false,
      {
        preserveValues:
          false
      }
    );


    hideUnicodeScope();


    unicodeInput.focus();
  }
);


/* =========================================
   Resize
========================================= */

window.addEventListener(
  "resize",
  () => {

    resizeExpandedTextarea(
      charInput
    );


    resizeExpandedTextarea(
      unicodeInput
    );
  },
  {
    passive:
      true
  }
);


/* =========================================
   Startup
========================================= */

setCharBulkMode(
  false
);


setUnicodeBulkMode(
  false,
  {
    preserveValues:
      false
  }
);


syncRandomCustomVisibility();


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
