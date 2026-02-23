document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    console.log("Ctrl + S pressed!");
    document.querySelector("#saveDialog").showModal();
  }
});

document.querySelector("#spellCheck").addEventListener("change", function () {
  document.getElementById("editor").spellcheck = this.checked;
});

document.getElementById("editor").addEventListener("input", function () {
  document.getElementById("chars").innerText = this.value.replace(
    /\s/g,
    "",
  ).length;
});

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
    toggleBtn.textContent = "View as Markdown";
  }
});

document.querySelector("#confirmSave").addEventListener("click", (e) => {
  e.preventDefault();

  let fileName = fileNameInput.value.trim();

  if (!fileName) {
    fileName = "untitled.txt";
  }

  const content = editor.value;

  const blob = new Blob([content], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);

  saveDialog.close();
});

document
  .querySelector("#infoBar > :last-child")
  .addEventListener("click", () => {
    document.querySelector("#saveDialog").showModal();
  });
