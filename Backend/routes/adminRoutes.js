const express = require("express");
const { createAdoptionPost, upload ,getPendingServiceProviders, acceptServiceProvider } = require("../controllers/adminController");

const router = express.Router();

router.post("/create-adoption", upload.single("image"), createAdoptionPost);
router.get("/pending-service-providers", getPendingServiceProviders); // Get all pending providers
router.put("/accept-service-provider/:id", acceptServiceProvider); // Accept a service provider

module.exports = router;
