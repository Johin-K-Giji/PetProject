const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin",require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookingsSP", require("./routes/serviceBookingRoutes"));
app.use("/api/bookings", require("./routes/vetBookingRoutes"));
app.use("/api/adoptions", require("./routes/adoptionRequestRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/purchase", require("./routes/purchaseRoutes"));
app.use("/api/adoptions", require("./routes/adoptionRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
