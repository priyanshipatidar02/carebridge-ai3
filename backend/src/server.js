const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const patientRoutes = require("./routes/patientRoutes");
const allergyRoutes = require("./routes/allergyRoutes");
const triageRoutes = require("./routes/triageRoutes");
const historyRoutes = require("./routes/historyRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "CareBridge AI backend is running" });
});

app.use("/api/patient", patientRoutes);
app.use("/api/allergy", allergyRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    hint: "Use POST /api/reports/analyze and POST /api/triage/analyze, not GET."
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

app.listen(PORT, () => console.log(`CareBridge backend running on port ${PORT}`));
