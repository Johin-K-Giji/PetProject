const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  petType: { type: String, required: true },
  ownerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  modeOfService: { type: String, required: true }, // eg. Online, Home Visit, etc.
  timeNeeded: { type: String, required: true },
  status: { type: String, default: "pending" } // pending, accepted
});

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);
