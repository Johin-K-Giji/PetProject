const express = require("express");
const Adoption = require("../models/Adoption");

// View Adoptions with status = 0
const getAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find({ status: 0 });
    res.status(200).json(adoptions);
  } catch (error) {
    console.error("Error fetching adoptions:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdoptions,
};
