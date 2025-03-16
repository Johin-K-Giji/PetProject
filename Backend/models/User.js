const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  userType: { type: String, required: true, enum: ["admin", "user" , "doc" , "SP"] }, // Modify based on roles
  password: { type: String, required: true },
  username: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("User", userSchema);
