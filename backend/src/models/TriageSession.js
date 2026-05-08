const mongoose = require("mongoose");

const triageSessionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  symptoms: { type: String, required: true },
  followUpAnswers: { type: Object, default: {} },
  possibleCondition: String,
  severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  severityScore: { type: Number, default: 50 },
  medicine: { type: Object, default: {} },
  advice: { type: Object, default: {} },
  emergencyWarning: { type: Boolean, default: false },
  needsDoctor: { type: Boolean, default: false },
  facilities: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TriageSession", triageSessionSchema);
