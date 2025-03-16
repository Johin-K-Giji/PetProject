const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");

// ✅ Save Purchase Route
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    if (!userId || !products || !totalPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPurchase = new Purchase({
      userId,
      products,
      totalPrice,
    });

    await newPurchase.save();

    res.status(201).json({ message: "Purchase recorded successfully" });
  } catch (error) {
    console.error("Error saving purchase:", error);
    res.status(500).json({ message: "Failed to save purchase" });
  }
});

// ✅ Get Purchase History
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const purchases = await Purchase.find({ userId }).populate("products.productId");
    res.status(200).json(purchases);
  } catch (error) {
    console.error("Failed to get purchase history:", error);
    res.status(500).json({ message: "Failed to get purchase history" });
  }
});

module.exports = router;
