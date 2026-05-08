const mongoose = require("mongoose");
const Allergy = require("../models/Allergy");

exports.addAllergies = async (req, res) => {
  try {
    const { patientId, allergies = [] } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    const clean = Array.isArray(allergies)
      ? allergies.map(a => String(a).trim().toLowerCase()).filter(Boolean)
      : String(allergies).split(",").map(a => a.trim().toLowerCase()).filter(Boolean);

    const record = await Allergy.findOneAndUpdate(
      { patientId },
      { $set: { allergies: clean }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true, returnDocument: "after" }
    );
    res.json({ success: true, allergy: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
