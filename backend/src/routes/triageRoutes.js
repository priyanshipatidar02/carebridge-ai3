const router = require("express").Router();
const { getFollowups, analyzeTriage } = require("../controllers/triageController");
router.post("/followups", getFollowups);
router.post("/analyze", analyzeTriage);
module.exports = router;
