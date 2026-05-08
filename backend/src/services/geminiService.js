const axios = require("axios");
const cleanJsonResponse = require("../utils/cleanJsonResponse");
const { detectEmergency, normalizeSeverity, scoreFromSeverity } = require("../utils/severity");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const { data } = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
  }, { timeout: 25000 });
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function fallbackTriage(symptoms, followUpAnswers, language = "English") {
  const emergency = detectEmergency(symptoms, followUpAnswers);
  return {
    triage: {
      possibleCondition: emergency ? "emergency warning signs" : "general illness-like symptoms",
      severity: emergency ? "high" : "medium",
      severityScore: emergency ? 90 : 55,
      needsDoctor: emergency,
      emergencyWarning: emergency
    },
    medicine: {
      suggested: emergency ? "Please seek urgent medical help instead of self-medicating." : "Rest, fluids, and consult a pharmacist/doctor before taking medicine.",
      original: "",
      allergyWarning: ""
    },
    advice: {
      message: language === "Hindi" ? "यह चिकित्सा निदान नहीं है। कृपया डॉक्टर से सलाह लें।" : "This is not a medical diagnosis. Please consult a qualified doctor.",
      details: emergency
        ? ["Call emergency support immediately.", "Do not delay care.", "Keep the patient seated or lying safely."]
        : ["Monitor symptoms.", "Drink enough water.", "See a doctor if symptoms worsen or continue."]
    }
  };
}

function enforceClinicalSafety(result, symptoms, followUpAnswers) {
  const safe = result || fallbackTriage(symptoms, followUpAnswers);
  const emergency = detectEmergency(symptoms, followUpAnswers);
  safe.triage = safe.triage || {};
  safe.medicine = safe.medicine || {};
  safe.advice = safe.advice || {};
  safe.triage.severity = emergency ? "high" : normalizeSeverity(safe.triage.severity);
  safe.triage.severityScore = emergency ? 90 : Number(safe.triage.severityScore || scoreFromSeverity(safe.triage.severity));
  safe.triage.emergencyWarning = Boolean(emergency || safe.triage.emergencyWarning);
  safe.triage.needsDoctor = Boolean(safe.triage.needsDoctor || safe.triage.emergencyWarning || safe.triage.severity === "high");
  safe.triage.possibleCondition = safe.triage.possibleCondition || "general illness-like symptoms";
  safe.advice.details = Array.isArray(safe.advice.details) ? safe.advice.details : [String(safe.advice.details || "Consult a qualified doctor if symptoms persist.")];
  return safe;
}

async function analyzeSymptoms({ symptoms, allergies = [], followUpAnswers = {}, language = "English" }) {
  const prompt = `You are a cautious healthcare triage assistant. You are not a doctor. Return only valid JSON and no markdown.
Language for patient-facing text: ${language}. Severity must always be English: low, medium, high.
Never give a final diagnosis. Use possibleCondition with cautious wording like viral infection-like symptoms, migraine-like symptoms, possible dehydration.
Do not recommend prescription-only medicines. For high severity, recommend urgent doctor care.

Symptoms: ${symptoms}
Known allergies: ${allergies.join(", ") || "none"}
Follow-up answers: ${JSON.stringify(followUpAnswers)}

Return this exact shape:
{
  "triage": { "possibleCondition": "", "severity": "low|medium|high", "severityScore": 0, "needsDoctor": false, "emergencyWarning": false },
  "medicine": { "suggested": "", "original": "", "allergyWarning": "" },
  "advice": { "message": "", "details": ["", "", ""] }
}`;

  try {
    const text = await callGemini(prompt);
    const parsed = cleanJsonResponse(text);
    return enforceClinicalSafety(parsed || fallbackTriage(symptoms, followUpAnswers, language), symptoms, followUpAnswers);
  } catch (error) {
    console.error("Gemini triage error:", error.response?.data || error.message);
    return enforceClinicalSafety(fallbackTriage(symptoms, followUpAnswers, language), symptoms, followUpAnswers);
  }
}

module.exports = { analyzeSymptoms };
