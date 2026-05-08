const router = require("express").Router();
const { upload, analyzeReport, getReportHistory } = require("../controllers/reportController");
router.post("/analyze", upload.single("file"), analyzeReport);
router.get("/history/:patientId", getReportHistory);
module.exports = router;
