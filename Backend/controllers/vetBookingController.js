const VetBooking = require("../models/VetBooking");

// Book a Vet
const bookVet = async (req, res) => {
  try {
    const { vetId, petType, ownerName, phoneNumber, location, petDisease, vaccinated, timeOfBooking } = req.body;

    const newVetBooking = new VetBooking({
      vetId,
      petType,
      ownerName,
      phoneNumber,
      location,
      petDisease,
      vaccinated,
      timeOfBooking
    });

    await newVetBooking.save();
    res.status(201).json({ message: "Vet booked successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookVet };
