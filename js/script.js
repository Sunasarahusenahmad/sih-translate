const fromText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchageIcon = document.querySelector(".exchange"),
  selectTag = document.querySelectorAll("select"),
  icons = document.querySelectorAll(".row i");
(translateBtn = document.querySelector("button")),
  selectTag.forEach((tag, id) => {
    for (let country_code in indianLanguages) {
      let selected =
        id == 0
          ? country_code == "en-GB"
            ? "selected"
            : ""
          : country_code == "hi-IN"
          ? "selected"
          : "";
      let option = `<option ${selected} value="${country_code}">${indianLanguages[country_code]}</option>`;
      tag.insertAdjacentHTML("beforeend", option);
    }
  });

exchageIcon.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
  if (!text) return;
  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    });
});

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value || !toText.value) return;
    if (target.classList.contains("fa-copy")) {
      if (target.id == "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (target.id == "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});

const speechToTextButton = document.getElementById("speechToText");
const speechTextArea = document.querySelector(".speech-text");
const enterTextTextArea = document.querySelector(".from-text");

// Check if the browser supports the SpeechRecognition API
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  // Configure the recognition settings
  recognition.continuous = true; // Keep listening continuously
  recognition.interimResults = true; // Show interim results

  // Add an event listener for the speech input button
  speechToTextButton.addEventListener("click", () => {
    recognition.start(); // Start listening
    speechTextArea.value = ""; // Clear previous text
    speechTextArea.setAttribute("placeholder", "Listening...");
  });

  // Event listener for speech recognition result
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    speechTextArea.value = transcript; // Display speech in the speech textarea
    speechTextArea.setAttribute("placeholder", "Speech to Text");

    // Update the "Enter text" textarea with the recognized speech
    enterTextTextArea.value = transcript;
  };

  // Event listener for errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speechTextArea.value = "Speech recognition error. Please try again.";
    speechTextArea.setAttribute("placeholder", "Speech to Text");
  };
} else {
  // If SpeechRecognition is not supported, inform the user
  speechToTextButton.style.display = "none";
  speechTextArea.value = "Speech recognition is not supported in your browser.";
}

// Additional code for toggling the speech input button
speechTextArea.addEventListener("keyup", () => {
  if (!speechTextArea.value) {
    speechToTextButton.textContent = "Start Speech Input";
  } else {
    speechToTextButton.textContent = "Clear Text";
  }
});

speechToTextButton.addEventListener("click", () => {
  if (speechTextArea.value) {
    speechTextArea.value = "";
    speechTextArea.setAttribute("placeholder", "Speech to Text");
    enterTextTextArea.value = ""; // Clear the "Enter text" textarea when clearing speech
  }
});
