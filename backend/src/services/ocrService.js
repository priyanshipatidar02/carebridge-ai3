const fs = require("fs/promises");
const pdf = require("pdf-parse");
const { createWorker } = require("tesseract.js");

const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];

async function extractTextFromFile(file) {
  if (!file) throw new Error("No file uploaded");
  if (!allowedTypes.includes(file.mimetype)) throw new Error("Only PDF, JPG, JPEG, and PNG reports are allowed");

  try {
    if (file.mimetype === "application/pdf") {
      const buffer = await fs.readFile(file.path);
      const result = await pdf(buffer);
      return (result.text || "").trim();
    }
    const worker = await createWorker("eng");
    const result = await worker.recognize(file.path);
    await worker.terminate();
    return (result.data.text || "").trim();
  } finally {
    fs.unlink(file.path).catch(() => {});
  }
}

module.exports = { extractTextFromFile };
