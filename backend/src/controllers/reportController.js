const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const ReportAnalysis = require("../models/ReportAnalysis");
const { extractTextFromFile } = require("../services/ocrService");
const { analyzeReportText } = require("../services/reportAiService");
const { getNearbyHospitals } = require("../services/hospitalService");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, "../../uploads")),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

exports.upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.mimetype)) return cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
    cb(null, true);
  }
});

exports.analyzeReport = async (req, res) => {
  try {
    const { patientId, lat, lng, language = "English" } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    const extractedText = await extractTextFromFile(req.file);
    if (!extractedText || extractedText.length < 10) {
      return res.status(400).json({ success: false, message: "Could not read enough text from this report. Try a clearer image/PDF." });
    }
    const analysis = await analyzeReportText(extractedText, language);
    const shouldFetchHospitals = analysis?.doctorRecommendation?.needed || analysis?.riskLevel === "high";
    const facilities = shouldFetchHospitals ? await getNearbyHospitals(lat, lng) : [];

    const saved = await ReportAnalysis.create({
      patientId,
      fileName: req.file?.originalname || "report",
      extractedText,
      summary: analysis.summary,
      keyFindings: analysis.keyFindings || [],
      riskLevel: analysis.riskLevel || "medium",
      possibleConcerns: analysis.possibleConcerns || [],
      doctorRecommendation: analysis.doctorRecommendation || {},
      lifestyleGuidance: analysis.lifestyleGuidance || [],
      redFlags: analysis.redFlags || [],
      facilities
    });

    res.json({ success: true, report: { ...analysis, extractedText, facilities, id: saved._id, fileName: saved.fileName } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ success: false, message: "Valid patientId is required" });
    }
    const reports = await ReportAnalysis.find({ patientId }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
