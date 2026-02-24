// ================================
// SHORTCUT: CTRL + S
// ================================
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    document.querySelector("#saveDialog").showModal();
  }
});

// ================================
// SPELLCHECK TOGGLE
// ================================
document.querySelector("#spellCheck").addEventListener("change", function () {
  document.getElementById("editor").spellcheck = this.checked;
});

// ================================
// CHARACTER COUNT (no spaces)
// ================================
document.getElementById("editor").addEventListener("input", function () {
  document.getElementById("chars").innerText = this.value.replace(
    /\s/g,
    "",
  ).length;
});

// ================================
// MARKDOWN PREVIEW TOGGLE
// ================================
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const toggleBtn = document.querySelector("#previewBtn");

let previewMode = false;

toggleBtn.addEventListener("click", () => {
  previewMode = !previewMode;

  if (previewMode) {
    preview.innerHTML = marked.parse(editor.value);
    editor.hidden = true;
    preview.hidden = false;
    toggleBtn.textContent = "Edit Mode";
  } else {
    editor.hidden = false;
    preview.hidden = true;
    toggleBtn.textContent = "Preview Markdown";
  }
});

// ================================
// FILE OPEN LOGIC
// ================================
const fileOpener = document.getElementById("fileOpener");
const openBtn = document.getElementById("openBtn");

const saveDialog = document.getElementById("saveDialog");
const fileNameInput = document.getElementById("fileNameInput");
const confirmSave = document.getElementById("confirmSave");

let currentFileName = "untitled.txt";

openBtn.addEventListener("click", () => {
  fileOpener.click();
});

fileOpener.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  currentFileName = file.name;
  fileNameInput.value = currentFileName;

  const reader = new FileReader();

  reader.onload = function (event) {
    editor.value = event.target.result;
    document.getElementById("chars").innerText = editor.value.replace(
      /\s/g,
      "",
    ).length;
  };

  reader.readAsText(file);

  fileOpener.value = ""; // allow reopening same file
});

// ================================
// SAVE LOGIC (DIALOG CONFIRM)
// ================================
confirmSave.addEventListener("click", (e) => {
  e.preventDefault();

  let fileName = fileNameInput.value.trim();

  if (!fileName) {
    fileName = currentFileName;
  }

  const content = editor.value;

  const blob = new Blob([content], {
    type: "application/octet-stream",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);

  currentFileName = fileName; // update if renamed
  saveDialog.close();
});

// ================================
// SAVE BUTTON CLICK
// ================================
document
  .querySelector("#infoBar > :last-child")
  .addEventListener("click", () => {
    saveDialog.showModal();
  });

function isMobilePhone() {
  return /iPhone|Android.+Mobile|Windows Phone/i.test(navigator.userAgent);
}

if (isMobilePhone()) {
  console.log("Phone user detected.");
  const randNum = Math.floor(Math.random() * 2) + 1;
  if (randNum === 1) {
    alert("Landscape Mode is recommended for mobile devices");
  }
}
