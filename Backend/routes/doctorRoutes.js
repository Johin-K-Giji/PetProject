const express = require("express");
const {
  createProfile,
  viewBookings,
  acceptBooking,
  getAnalytics,
  upload
} = require("../controllers/doctorController");


const router = express.Router();

router.post("/create-profile", upload.single("certificate"), createProfile);
router.get("/view-bookings/:userId", viewBookings);
router.patch("/accept-booking/:id", acceptBooking);
router.get("/analytics/:userId", getAnalytics);

module.exports = router;
