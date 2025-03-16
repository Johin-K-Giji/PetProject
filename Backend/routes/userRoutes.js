const express = require("express");
const { registerUser , loginUser , registerServiceProvider , registerVetDoctor ,upload ,getUser ,getApprovedServiceProviders } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser); // Login API
router.post("/register-sp", registerServiceProvider); // Service Provider Registration
router.post("/register-vet", upload.single("certificate"), registerVetDoctor); // Vet Doctor Registration
router.get("/service-providers", getApprovedServiceProviders);
router.get("/:userId", getUser);


module.exports = router;
