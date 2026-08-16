document.addEventListener("keydown", async function (e) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    await saveAs();
    return;
  }

  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    await save();
  }
});

const editor = document.getElementById("editor");
const toggleBtn = document.getElementById("previewBtn");
const spellCheck = document.getElementById("spellCheck");
const chars = document.getElementById("chars");

const fileOpener = document.getElementById("fileOpener");
const openBtn = document.getElementById("openBtn");

const saveBtn = document.getElementById("saveBtn");
const fileNameInput = document.getElementById("fileNameInput");

let currentFileName = "untitled.txt";
let fileHandle = null;
let previewMode = false;
let savedContent = null;
let hasEdited = false;

function updateSaveState() {
  if (!hasEdited) {
    fileNameInput.style.borderColor = "";
    return;
  }

  const isSaved = savedContent !== null && editor.value === savedContent;

  fileNameInput.style.borderColor = isSaved ? "green" : "gray";
}

window.addEventListener("beforeunload", function (e) {
  if (hasEdited && editor.value !== savedContent) {
    e.preventDefault();
    e.returnValue = "";
  }
});

const preview = document.createElement("div");
preview.id = "preview";
preview.hidden = true;
preview.style.flexGrow = 1;

editor.parentElement.appendChild(preview);

spellCheck.addEventListener("change", function () {
  editor.spellcheck = this.checked;
});

function updateInfo() {
  const text = editor.value;
  const cursor = editor.selectionStart;

  chars.innerText = text.replace(/\s/g, "").length;

  const totalLines = text.split("\n").length;
  const currentLine = text.slice(0, cursor).split("\n").length;

  const lastNewline = text.lastIndexOf("\n", cursor - 1);
  const currentColumn = cursor - lastNewline;

  document.getElementById("lines").innerText = totalLines;
  document.getElementById("line").innerText = currentLine;
  document.getElementById("column").innerText = currentColumn;

  if (previewMode) {
    preview.innerHTML = marked.parse(text);
  }

  updateSaveState();
}

editor.addEventListener("input", () => {
  hasEdited = true;
  updateInfo();
});

editor.addEventListener("keyup", updateInfo);
editor.addEventListener("click", updateInfo);
editor.addEventListener("select", updateInfo);

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

openBtn.addEventListener("click", async () => {
  if ("showOpenFilePicker" in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: "Text Files",
            accept: {
              "text/plain": [".txt", ".md", ".markdown"],
            },
          },
        ],
      });

      fileHandle = handle;

      const file = await fileHandle.getFile();

      currentFileName = file.name;
      fileNameInput.value = currentFileName;
      editor.value = await file.text();

      savedContent = editor.value;
      hasEdited = true;

      updateInfo();

      if (previewMode) {
        preview.innerHTML = marked.parse(editor.value);
      }

      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error(error);
    }
  }

  fileOpener.click();
});

fileOpener.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  fileHandle = null;
  currentFileName = file.name;
  fileNameInput.value = currentFileName;
  editor.value = await file.text();

  savedContent = editor.value;
  hasEdited = true;

  updateInfo();

  if (previewMode) {
    preview.innerHTML = marked.parse(editor.value);
  }

  fileOpener.value = "";
});

async function save() {
  if (!fileHandle) {
    await saveAs();
    return;
  }

  try {
    const writable = await fileHandle.createWritable();

    await writable.write(editor.value);
    await writable.close();

    savedContent = editor.value;
    hasEdited = true;

    updateSaveState();
  } catch (error) {
    if (error.name === "NotAllowedError") {
      fileHandle = null;
      await saveAs();
      return;
    }

    console.error(error);
  }
}

async function saveAs() {
  if (!("showSaveFilePicker" in window)) {
    downloadFile();

    savedContent = editor.value;
    hasEdited = true;

    updateSaveState();

    return;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: fileNameInput.value.trim() || "untitled.txt",

      types: [
        {
          description: "Text Files",
          accept: {
            "text/plain": [".txt", ".md", ".markdown"],
          },
        },
      ],
    });

    fileHandle = handle;

    currentFileName = handle.name;
    fileNameInput.value = currentFileName;

    const writable = await fileHandle.createWritable();

    await writable.write(editor.value);
    await writable.close();

    savedContent = editor.value;
    hasEdited = true;

    updateSaveState();
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error(error);
  }
}

function downloadFile() {
  let fileName = fileNameInput.value.trim();

  if (!fileName) {
    fileName = "untitled.txt";
  }

  const blob = new Blob([editor.value], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  currentFileName = fileName;
}

saveBtn.addEventListener("click", save);

updateInfo();
