const express = require("express");
const {
  upload,
  addService,
  deleteService,
  viewBookings,
  acceptBooking,
  viewServices
} = require("../controllers/serviceController");



const router = express.Router();
router.use(express.json());

router.post("/add-service", upload.single("image"), addService);
router.delete("/delete-service/:id", deleteService);
router.get("/view-bookings", viewBookings);
router.put("/accept-booking/:id", acceptBooking);
router.get("/view-services/:userId", viewServices);


module.exports = router;
