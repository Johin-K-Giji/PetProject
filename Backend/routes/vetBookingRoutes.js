const express = require("express");
const { bookVet } = require("../controllers/vetBookingController");

const router = express.Router();

router.post("/book-vet", bookVet);

module.exports = router;
