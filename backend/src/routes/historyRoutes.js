const router = require("express").Router();
const { getHistory, getChart } = require("../controllers/historyController");
router.get("/:patientId", getHistory);
router.get("/chart/:patientId", getChart);
module.exports = router;
