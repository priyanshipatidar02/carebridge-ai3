const mongoose = require("mongoose");
const Allergy = require("../models/Allergy");
const TriageSession = require("../models/TriageSession");
const { generateFollowups } = require("../services/followupService");
const { analyzeSymptoms } = require("../services/geminiService");
const { getNearbyHospitals } = require("../services/hospitalService");

function applyAllergySafety(result, allergyList = [], unsure = false) {
  const allergies = allergyList.map(a => String(a).toLowerCase());
  const suggested = String(result?.medicine?.suggested || "").toLowerCase();
  const conflict = allergies.find(a => a && suggested.includes(a));

  result.medicine = result.medicine || {};
  result.medicine.original = result.medicine.original || result.medicine.suggested || "";

  if (conflict) {
    result.medicine.suggested = "Avoid this medicine due to allergy. Please consult a doctor/pharmacist for a safe alternative.";
    result.medicine.allergyWarning = `Possible allergy conflict found with ${conflict}.`;
  } else if (unsure) {
    result.medicine.allergyWarning = "You selected not sure about allergies. Please consult a doctor or pharmacist before taking any medicine.";
  }
  return result;
}

exports.getFollowups = async (req, res) => {
  try {
    const { symptoms, language = "English" } = req.body;
    if (!symptoms || !String(symptoms).trim()) {
      return res.status(400).json({ success: false, message: "Symptoms are required" });
    }
    const questions = await generateFollowups(symptoms, language);
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.analyzeTriage = async (req, res) => {
  try {
    const { patientId, symptoms, allergies = [], followUpAnswers = {}, lat, lng, language = "English", allergyStatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    if (!symptoms || !String(symptoms).trim()) {
      return res.status(400).json({ success: false, message: "Symptoms are required" });
    }

    const savedAllergy = await Allergy.findOne({ patientId });
    const combinedAllergies = Array.from(new Set([...(savedAllergy?.allergies || []), ...(Array.isArray(allergies) ? allergies : [])].map(a => String(a).toLowerCase())));

    let result = await analyzeSymptoms({ symptoms, allergies: combinedAllergies, followUpAnswers, language });
    result = applyAllergySafety(result, combinedAllergies, allergyStatus === "notSure");

    const shouldFetchHospitals = result.triage.needsDoctor || result.triage.emergencyWarning || result.triage.severity === "high";
    const facilities = shouldFetchHospitals ? await getNearbyHospitals(lat, lng) : [];

    const session = await TriageSession.create({
      patientId,
      symptoms,
      followUpAnswers,
      possibleCondition: result.triage.possibleCondition,
      severity: result.triage.severity,
      severityScore: result.triage.severityScore,
      medicine: result.medicine,
      advice: result.advice,
      emergencyWarning: result.triage.emergencyWarning,
      needsDoctor: result.triage.needsDoctor,
      facilities
    });

    res.json({ success: true, ...result, facilities, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
