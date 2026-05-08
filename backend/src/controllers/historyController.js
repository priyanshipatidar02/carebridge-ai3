const mongoose = require("mongoose");
const TriageSession = require("../models/TriageSession");

exports.getHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    const history = await TriageSession.find({ patientId }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChart = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    const sessions = await TriageSession.find({ patientId }).sort({ createdAt: 1 }).select("severityScore createdAt severity possibleCondition");
    const chart = sessions.map(s => ({
      date: s.createdAt.toISOString().slice(0, 10),
      score: s.severityScore,
      severity: s.severity,
      possibleCondition: s.possibleCondition
    }));
    res.json({ success: true, chart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
