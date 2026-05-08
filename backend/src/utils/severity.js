const emergencyKeywords = [
  "severe chest pain", "chest pain", "unconscious", "unconsciousness",
  "breathing difficulty", "difficulty breathing", "shortness of breath",
  "swelling", "allergic swelling", "stroke", "heavy bleeding", "bleeding heavily",
  "seizure", "blue lips", "fainting"
];

function detectEmergency(symptoms = "", followUpAnswers = {}) {
  const text = `${symptoms} ${JSON.stringify(followUpAnswers)}`.toLowerCase();
  return emergencyKeywords.some((word) => text.includes(word));
}

function normalizeSeverity(value = "medium") {
  const s = String(value).toLowerCase();
  if (["low", "medium", "high"].includes(s)) return s;
  return "medium";
}

function scoreFromSeverity(severity) {
  if (severity === "high") return 85;
  if (severity === "low") return 25;
  return 55;
}

module.exports = { detectEmergency, normalizeSeverity, scoreFromSeverity };
