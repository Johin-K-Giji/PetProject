const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  userType: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Login", loginSchema);
