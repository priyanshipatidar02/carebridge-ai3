const router = require("express").Router();
const { addAllergies } = require("../controllers/allergyController");
router.post("/add", addAllergies);
module.exports = router;
