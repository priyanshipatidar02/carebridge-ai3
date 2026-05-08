const Patient = require("../models/Patient");

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, language = "English" } = req.body;
    if (!name || !age || !gender) {
      return res.status(400).json({ success: false, message: "Name, age, and gender are required" });
    }
    const patient = await Patient.create({ name, age, gender, language });
    res.status(201).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
