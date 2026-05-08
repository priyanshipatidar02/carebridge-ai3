function cleanJsonResponse(text) {
  if (!text || typeof text !== "string") return null;
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      try {
        return JSON.parse(cleaned.slice(first, last + 1));
      } catch (_inner) {
        return null;
      }
    }
    return null;
  }
}

module.exports = cleanJsonResponse;
