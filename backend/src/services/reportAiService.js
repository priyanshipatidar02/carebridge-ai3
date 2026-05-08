const axios = require("axios");
const cleanJsonResponse = require("../utils/cleanJsonResponse");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function fallbackReport(text = "") {
  return {
    summary: text ? "The report text was extracted, but AI analysis is temporarily unavailable. Please consult a qualified doctor for interpretation." : "No readable report text was found.",
    keyFindings: [],
    riskLevel: "medium",
    possibleConcerns: ["Manual doctor review recommended"],
    doctorRecommendation: { needed: true, specialist: "General Physician", urgency: "as soon as possible" },
    lifestyleGuidance: ["Do not self-medicate based only on this report.", "Carry the original report to your doctor."],
    redFlags: ["Chest pain", "Breathing difficulty", "Severe weakness"],
    disclaimer: "This is not a medical diagnosis. Please consult a qualified doctor."
  };
}

async function analyzeReportText(extractedText, language = "English") {
  if (!process.env.GEMINI_API_KEY) return fallbackReport(extractedText);
  const clipped = String(extractedText || "").slice(0, 16000);
  const prompt = `You are a medical report explanation assistant. You are not a doctor. Analyze the medical report text and explain it in simple patient-friendly language. Do not give a final diagnosis. Return only valid JSON. Do not include markdown. Identify important markers, abnormal values, risk level, possible concerns, doctor recommendation, lifestyle guidance, and red flags.
Language: ${language}. riskLevel must be English: low, medium, high.

Report text:
${clipped}

Return this exact JSON shape:
{
  "summary": "",
  "keyFindings": [{ "marker": "", "value": "", "status": "low|normal|high|unknown", "meaning": "" }],
  "riskLevel": "low|medium|high",
  "possibleConcerns": [],
  "doctorRecommendation": { "needed": true, "specialist": "General Physician", "urgency": "within 1 week" },
  "lifestyleGuidance": [],
  "redFlags": [],
  "disclaimer": "This is not a medical diagnosis. Please consult a qualified doctor."
}`;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const { data } = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    }, { timeout: 30000 });
    const parsed = cleanJsonResponse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "");
    return parsed || fallbackReport(extractedText);
  } catch (error) {
    console.error("Gemini report error:", error.response?.data || error.message);
    return fallbackReport(extractedText);
  }
}

module.exports = { analyzeReportText };
