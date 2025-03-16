const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
  petType: { type: String, required: true },
  petAge: { type: String, required: true },
  specifications: { type: [String], required: true }, // Bullet points
  image: { type: String, required: true }, // Image file path
  lastDate: { type: Date, required: true },
  status: { type: Number, default: 0 } // Initially 0
});

module.exports = mongoose.model("Adoption", adoptionSchema);
