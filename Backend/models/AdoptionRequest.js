const mongoose = require("mongoose");

const adoptionRequestSchema = new mongoose.Schema({
  adoptionPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Adoption", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Added userId
  userName: { type: String, required: true },
  userAge: { type: Number, required: true },
  idProof: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  hasOtherPets: { type: Boolean, required: true },
  adoptionReason: { type: String, required: true },
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("AdoptionRequest", adoptionRequestSchema);
