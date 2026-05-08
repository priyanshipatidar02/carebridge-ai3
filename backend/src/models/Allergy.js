const mongoose = require("mongoose");

const allergySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  allergies: [{ type: String, trim: true, lowercase: true }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Allergy", allergySchema);
