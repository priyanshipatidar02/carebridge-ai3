const axios = require("axios");
const cleanJsonResponse = require("../utils/cleanJsonResponse");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function fallbackFollowups(symptoms = "") {
  const s = symptoms.toLowerCase();
  if (s.includes("chest pain")) return [
    { id: "breathingDifficulty", question: "Are you having breathing difficulty?", type: "yesno" },
    { id: "sweating", question: "Are you sweating unusually or feeling faint?", type: "yesno" },
    { id: "painSpread", question: "Is pain spreading to your arm, jaw, back, or shoulder?", type: "yesno" },
    { id: "duration", question: "How long has the chest pain been present?", type: "select", options: ["Less than 10 minutes", "10-30 minutes", "More than 30 minutes"] }
  ];
  if (s.includes("fever")) return [
    { id: "duration", question: "How long have you had fever?", type: "select", options: ["Less than 1 day", "1-3 days", "More than 3 days"] },
    { id: "temperature", question: "What is your temperature, if measured?", type: "text" },
    { id: "cough", question: "Do you also have cough?", type: "yesno" },
    { id: "weakness", question: "Rate your weakness from 1 to 10", type: "slider", min: 1, max: 10 }
  ];
  if (s.includes("headache")) return [
    { id: "painLevel", question: "Rate your headache from 1 to 10", type: "slider", min: 1, max: 10 },
    { id: "visionChanges", question: "Do you have blurred vision or vision changes?", type: "yesno" },
    { id: "vomiting", question: "Are you vomiting?", type: "yesno" },
    { id: "neckStiffness", question: "Do you have neck stiffness?", type: "yesno" }
  ];
  if (s.includes("stomach")) return [
    { id: "painLocation", question: "Where exactly is the stomach pain?", type: "text" },
    { id: "vomiting", question: "Are you vomiting?", type: "yesno" },
    { id: "diarrhea", question: "Do you have diarrhea?", type: "yesno" },
    { id: "duration", question: "How long has this been happening?", type: "select", options: ["Less than 1 day", "1-3 days", "More than 3 days"] }
  ];
  return [
    { id: "duration", question: "How long have you had these symptoms?", type: "select", options: ["Less than 1 day", "1-3 days", "More than 3 days"] },
    { id: "severity", question: "Rate your discomfort from 1 to 10", type: "slider", min: 1, max: 10 },
    { id: "fever", question: "Do you have fever?", type: "yesno" },
    { id: "breathingDifficulty", question: "Are you experiencing breathing difficulty?", type: "yesno" }
  ];
}

function validateQuestions(questions) {
  const allowed = ["text", "yesno", "select", "slider"];
  if (!Array.isArray(questions)) return null;
  const clean = questions.filter(q => q && q.id && q.question && allowed.includes(q.type)).slice(0, 5);
  return clean.length >= 3 ? clean : null;
}

async function generateFollowups(symptoms, language = "English") {
  if (!process.env.GEMINI_API_KEY) return fallbackFollowups(symptoms);
  const prompt = `You are a healthcare triage assistant. Based on the user symptoms, generate 3 to 5 important follow-up questions. Return only valid JSON. Do not include markdown. Do not diagnose. Questions should help estimate urgency, severity, duration, and red flags. Use simple patient-friendly language. Support the selected language, but keep ids in English camelCase.

Selected language: ${language}
Symptoms: ${symptoms}

Return JSON only in this shape:
{"questions":[{"id":"duration","question":"How long have you had these symptoms?","type":"select","options":["Less than 1 day","1-3 days","More than 3 days"]}]}

Question type must be one of text, yesno, select, slider. If select include options. If slider include min and max.`;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const { data } = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
    }, { timeout: 20000 });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = cleanJsonResponse(text);
    return validateQuestions(parsed?.questions) || fallbackFollowups(symptoms);
  } catch (error) {
    console.error("Gemini followup error:", error.response?.data || error.message);
    return fallbackFollowups(symptoms);
  }
}

module.exports = { generateFollowups, fallbackFollowups };
