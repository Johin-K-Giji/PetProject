const ServiceBooking = require("../models/ServiceBooking");

// Book a Service
const bookService = async (req, res) => {
  try {
    const { serviceId, petType, ownerName, phoneNumber, location, modeOfService, timeNeeded } = req.body;

    const newBooking = new ServiceBooking({
      serviceId,
      petType,
      ownerName,
      phoneNumber,
      location,
      modeOfService,
      timeNeeded
    });

    await newBooking.save();
    res.status(201).json({ message: "Service booked successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookService };
