const router = require("express").Router();
const { createPatient } = require("../controllers/patientController");
router.post("/create", createPatient);
module.exports = router;
