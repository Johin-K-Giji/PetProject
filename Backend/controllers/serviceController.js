const multer = require("multer");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Login = require("../models/Login");
const Register = require("../models/ServiceProvider");

const mongoose = require("mongoose");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/service-images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Add Service
const addService = async (req, res) => {
  try {
    const { serviceName, description, price, userId } = req.body;

    // ✅ Validation
    if (!serviceName || !description || !price || !req.file || !userId) {
      return res.status(400).json({ message: "All fields are required, including image and user ID" });
    }

    // ✅ Convert userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // ✅ Save new service
    const newService = new Service({
      serviceName,
      description,
      price,
      image: req.file.path,
      serviceProvider: objectId, // ✅ Save as ObjectId
    });

    await newService.save();

    res.status(201).json({ message: "Service added successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};


  // Delete Service
  const deleteService = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body; // ✅ Get userId from body
  
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
  
      // ✅ Ensure the service provider is the owner of the post
      if (service.serviceProvider.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      await service.deleteOne();
  
      res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  

  // View Bookings for a Service Provider
const viewBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ serviceProvider: req.user.id })
        .populate("userId", "name email phoneNumber")
        .populate("serviceId", "serviceName price");
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Accept Booking
const acceptBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.status = "accepted";
      await booking.save();
  
      res.status(200).json({ message: "Booking accepted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// View Services for a Service Provider
const viewServices = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Fetch services based on provider ID
    const services = await Service.find({ serviceProvider: userId });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  module.exports = {addService,viewBookings,acceptBooking ,deleteService ,upload ,viewServices};