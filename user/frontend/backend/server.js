require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const initializeDatabase = require("./initDB");

const app = express();
const port = process.env.PORT || 5000;
// We bind to '0.0.0.0' so it listens on all network interfaces
const host = '0.0.0.0'; 

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database tables
initializeDatabase();

// Debug Logger
app.use((req, res, next) => {
    console.log(`DEBUG: ${req.method} request to ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("CRITICAL SERVER ERROR:", err.stack);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// Start server listening on 0.0.0.0
app.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
    console.log("DB Connected");
});