const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productCompany: { type: String, required: true },
  image: { type: String, required: true }, // Image file path
  description: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
