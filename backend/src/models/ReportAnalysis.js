const mongoose = require("mongoose");

const reportAnalysisSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  fileName: String,
  extractedText: String,
  summary: String,
  keyFindings: { type: Array, default: [] },
  riskLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  possibleConcerns: { type: Array, default: [] },
  doctorRecommendation: { type: Object, default: {} },
  lifestyleGuidance: { type: Array, default: [] },
  redFlags: { type: Array, default: [] },
  facilities: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ReportAnalysis", reportAnalysisSchema);
