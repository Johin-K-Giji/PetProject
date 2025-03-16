const express = require("express");
const { upload, addProduct, editProduct, deleteProduct ,getProducts } = require("../controllers/productController");

const router = express.Router();

// Add Product
router.post("/add-product", upload.single("image"), addProduct);

// Edit Product
router.put("/edit-product/:id", upload.single("image"), editProduct);

// Delete Product
router.delete("/delete-product/:id", deleteProduct);

router.get("/get-products",getProducts );

module.exports = router;
