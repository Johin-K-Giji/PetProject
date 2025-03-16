const express = require("express");
const router = express.Router();
const { getAdoptions } = require("../controllers/adoptionController");

// Route to get adoptions with status = 0
router.get("/get-adoptions", getAdoptions);

module.exports = router;
