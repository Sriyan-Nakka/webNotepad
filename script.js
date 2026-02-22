document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "s") {
    e.preventDefault();
    console.log("Ctrl + S pressed!");
    saveFile();
  }
});

async function saveFile() {
  try {
    const content = document.getElementById("editor").value;

    const handle = await window.showSaveFilePicker({
      suggestedName: "untitled.txt",
      types: [
        {
          description: "Text Files",
          accept: {
            "text/plain": [
              ".txt",
              ".log",
              ".text",
              ".md",
              ".markdown",
              ".html",
              ".htm",
              ".css",
              ".js",
              ".ts",
              ".json",
              ".xml",
              ".svg",
              ".yaml",
              ".yml",
              ".csv",
              ".tsv",
              ".ini",
              ".env",
              ".conf",
              ".cfg",
              ".py",
              ".java",
              ".c",
              ".cpp",
              ".cs",
              ".php",
              ".rb",
              ".go",
              ".rs",
              ".swift",
              ".sh",
              ".bat",
            ],
          },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();

    console.log("File saved successfully!");
  } catch (err) {
    console.log("User cancelled or error:", err);
  }
}

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

document
  .querySelector("#infoBar > :last-child")
  .addEventListener("click", () => {
    saveFile();
  });
