const Doctor = require("../models/VetDoctor");
const Booking = require("../models/Booking");
const multer = require("multer");

// Create or Update Doctor Profile

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/certificates/"); // Store in product-images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage }); 


const createProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber, qualification, experience, userId } = req.body;

    if (!name || !email || !phoneNumber || !qualification || !experience || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if doctor profile already exists
    let doctor = await Doctor.findOne({ userId });

    if (doctor) {
      // Update existing profile
      doctor.name = name;
      doctor.email = email;
      doctor.phoneNumber = phoneNumber;
      doctor.qualification = qualification;
      doctor.experience = experience;
      doctor.certificate = req.file.path;

      await doctor.save();

      return res.status(200).json({ message: "Doctor profile updated successfully" });
    }

    // Create new profile
    doctor = new Doctor({
      name,
      email,
      phoneNumber,
      qualification,
      experience,
      certificate: req.file.path,
      userId,
    });

    await doctor.save();

    res.status(201).json({ message: "Doctor profile created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const viewBookings = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const bookings = await Booking.find({ vetDoctor: userId })
        .populate("userId", "name email phoneNumber")
        .populate("serviceId", "serviceName price");
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const acceptBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.status = "accepted";
      await booking.save();
  
      res.status(200).json({ message: "Booking accepted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getAnalytics = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Total number of bookings
      const totalBookings = await Booking.countDocuments({ vetDoctor: userId });
  
      // Total revenue
      const totalRevenue = await Booking.aggregate([
        { $match: { vetDoctor: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]);
  
      const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
  
      res.status(200).json({ totalBookings, revenue });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  module.exports = { getAnalytics,acceptBooking,viewBookings,createProfile , upload};