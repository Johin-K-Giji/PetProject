const multer = require("multer");
const Adoption = require("../models/Adoption");
const ServiceProvider = require("../models/ServiceProvider");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/adoption-images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create Adoption Post
const createAdoptionPost = async (req, res) => {
  try {
    const { petType, petAge, specifications, lastDate } = req.body;

    if (!petType || !petAge || !specifications || !lastDate || !req.file) {
      return res.status(400).json({ message: "All fields are required, including an image" });
    }

    const specificationsArray = specifications.split(",").map(spec => spec.trim()); // Convert to array

    const newAdoption = new Adoption({
      petType,
      petAge,
      specifications: specificationsArray,
      image: req.file.path, // Store file path
      lastDate,
      status: 0 // Initially 0
    });

    await newAdoption.save();

    res.status(201).json({ message: "Adoption post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Pending Service Providers (status = false)
const getPendingServiceProviders = async (req, res) => {
    try {
      const pendingProviders = await ServiceProvider.find({ status: false });
      res.status(200).json(pendingProviders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Accept Service Provider (Update status to true)
const acceptServiceProvider = async (req, res) => {
    try {
      const { id } = req.params; // Get service provider ID from URL
  
      // Find the service provider by ID
      const serviceProvider = await ServiceProvider.findById(id);
      if (!serviceProvider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
  
      // Update status to true
      serviceProvider.status = true;
      await serviceProvider.save();
  
      res.status(200).json({ message: "Service provider accepted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { createAdoptionPost, upload , getPendingServiceProviders , acceptServiceProvider};
