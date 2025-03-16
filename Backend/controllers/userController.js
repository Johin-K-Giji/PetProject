const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const Login = require("../models/Login");
const ServiceProvider = require("../models/ServiceProvider");
const VetDoctor = require("../models/VetDoctor");

// ✅ Generate Username Function
const generateUsername = (name, phoneNumber, userType) => {
  return `${name.toLowerCase()}_${phoneNumber.slice(-4)}_${userType}`;
};

// ✅ Configure Multer for File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/certificates/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, location, password } = req.body;
    const userType = "user";

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let username = generateUsername(name, phoneNumber, userType);
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${generateUsername(name, phoneNumber, userType)}_${counter++}`;
    }

    // ✅ Generate manual ObjectId
    const userId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      _id: userId,
      name,
      email,
      phoneNumber,
      location,
      userType,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    // ✅ Save login with the same ID
    const newLogin = new Login({
      _id: userId,
      username,
      userType,
      password: hashedPassword,
    });

    await newLogin.save();

    res.status(201).json({ message: "User registered successfully", username, userId });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Register Service Provider
const registerServiceProvider = async (req, res) => {
  try {
    const { orgName, orgLocation, orgRegId, email, phoneNumber, password } = req.body;

    if (!orgName || !orgLocation || !orgRegId || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let username = `${orgName.toLowerCase()}_${phoneNumber.slice(-4)}_sp`;
    let counter = 1;
    while (await ServiceProvider.findOne({ username })) {
      username = `${orgName.toLowerCase()}_${phoneNumber.slice(-4)}_sp_${counter++}`;
    }

    // ✅ Generate manual ObjectId
    const spId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSP = new ServiceProvider({
      _id: spId,
      orgName,
      orgLocation,
      orgRegId,
      email,
      phoneNumber,
      status: false,
      userType: "SP",
      password: hashedPassword,
      username,
    });

    await newSP.save();

    // ✅ Save login with the same ID
    const newLogin = new Login({
      _id: spId,
      username,
      userType: "SP",
      password: hashedPassword,
    });

    await newLogin.save();

    res.status(201).json({ message: "Service Provider registered successfully", username, spId });
  } catch (error) {
    console.error("❌ Error registering service provider:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Register Veterinary Doctor
const registerVetDoctor = async (req, res) => {
  try {
    const { name, email, password, qualification, experience, phoneNumber } = req.body;

    if (!name || !email || !password || !qualification || !experience || !phoneNumber || !req.file) {
      return res.status(400).json({ message: "All fields are required, including certificate upload" });
    }

    let username = `${name.toLowerCase()}_${phoneNumber.slice(-4)}_vet`;
    let counter = 1;
    while (await VetDoctor.findOne({ username })) {
      username = `${name.toLowerCase()}_${phoneNumber.slice(-4)}_vet_${counter++}`;
    }

    // ✅ Generate manual ObjectId
    const vetId = new mongoose.Types.ObjectId();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newVet = new VetDoctor({
      _id: vetId,
      name,
      email,
      password: hashedPassword,
      qualification,
      experience,
      certificate: req.file.path,
      phoneNumber,
      userType: "vet",
      status: false,
      username,
    });

    await newVet.save();

    // ✅ Save login with the same ID
    const newLogin = new Login({
      _id: vetId,
      username,
      userType: "vet",
      password: hashedPassword,
    });

    await newLogin.save();

    res.status(201).json({ message: "Veterinary Doctor registered successfully", username, vetId });
  } catch (error) {
    console.error("❌ Error registering veterinary doctor:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ User Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { username: user.username, userType: user.userType, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      userType: user.userType,
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Error logging in user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get User Details
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ✅ Get Approved Service Providers
const getApprovedServiceProviders = async (req, res) => {
  try {
    const approvedProviders = await ServiceProvider.find({ status: true });
    res.status(200).json(approvedProviders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Export Controllers
module.exports = {
  registerUser,
  registerServiceProvider,
  registerVetDoctor,
  loginUser,
  getUser,
  getApprovedServiceProviders,
  upload,
};
