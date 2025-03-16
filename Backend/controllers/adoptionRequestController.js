const AdoptionRequest = require("../models/AdoptionRequest");

// ✅ Create Adoption Request
const createAdoptionRequest = async (req, res) => {
  try {
    const {
      adoptionPostId,
      userId,
      userName,
      userAge,
      phoneNumber,
      hasOtherPets,
      adoptionReason,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "ID proof is required" });
    }

    const newRequest = new AdoptionRequest({
      adoptionPostId,
      userId,
      userName,
      userAge,
      phoneNumber,
      hasOtherPets,
      adoptionReason,
      idProof: req.file.path, // ✅ Save file path
    });

    await newRequest.save();

    res.status(201).json({ message: "Adoption request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find().populate("adoptionPostId");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Adoption Request Status
const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Adoption Request
const deleteAdoptionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const deletedRequest = await AdoptionRequest.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Adoption request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAdoptionRequest,
  getAllAdoptionRequests,
  updateAdoptionRequestStatus,
  deleteAdoptionRequest,
};
