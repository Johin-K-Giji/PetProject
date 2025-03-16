const multer = require("multer");
const Product = require("../models/Product");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/product-images/"); // Store in product-images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage }); 

// Add Product
const addProduct = async (req, res) => {
    try {
      const { productName, productPrice, productCompany, description } = req.body;
  
      if (!productName || !productPrice || !productCompany || !description || !req.file) {
        return res.status(400).json({ message: "All fields are required, including image" });
      }
  
      const newProduct = new Product({
        productName,
        productPrice,
        productCompany,
        image: req.file.path, // Store file path
        description
      });
  
      await newProduct.save();
  
      res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  // ➡️ Get Products (for listing)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    re.status(500).json({ message: error.message });
  }
};



  // Edit Product
const editProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { productName, productPrice, productCompany, description } = req.body;
  
      // Find product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Update fields
      product.productName = productName || product.productName;
      product.productPrice = productPrice || product.productPrice;
      product.productCompany = productCompany || product.productCompany;
      product.description = description || product.description;
  
      // If image is uploaded, update image
      if (req.file) {
        product.image = req.file.path;
      }
  
      await product.save();
  
      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete Product
const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      await product.deleteOne();
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    upload,
    addProduct,
    editProduct,
    deleteProduct,
    getProducts
  };
  