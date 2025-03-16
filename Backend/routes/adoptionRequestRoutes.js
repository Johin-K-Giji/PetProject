const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createAdoptionRequest,
  getAllAdoptionRequests,
  updateAdoptionRequestStatus,
  deleteAdoptionRequest,
} = require("../controllers/adoptionRequestController");

// ✅ Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/id-proofs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Create Adoption Request
router.post("/adoption-requests", upload.single("idProof"), createAdoptionRequest);

// ✅ Get All Adoption Requests for a User
router.get("/adoption-requests/", getAllAdoptionRequests);

// ✅ Update Adoption Request Status
router.put("/adoption-requests/:requestId", updateAdoptionRequestStatus);

// ✅ Delete Adoption Request
router.delete("/adoption-requests/:requestId", deleteAdoptionRequest);

module.exports = router;
