const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  
  // Decode base64 token to get phone
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [phone] = decoded.split(':');
    req.phone = phone;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Create booking
router.post("/create", verifyToken, (req, res) => {
  const {
    username,
    isInternational, 
    isDomestic, 
    airlineName, 
    flightNumber, 
    terminal,
    departureCity,
    departureAirport, 
    arrivalCity,
    arrivalAirport,
    departureDate, 
    departureTime,
    bagCount, 
    bagWeight, 
    isFragile, 
    isCheckin,
    pincode, 
    pickupAddress, 
    pickupLatitude, 
    pickupLongitude, 
    pickupTime,
    photos, 
    additionalInfo
  } = req.body;

  try {
    const query = `
      INSERT INTO bookings (
        phone, username, is_international, is_domestic, airline_name, flight_number, terminal,
        departure_city, departure_airport, arrival_city, arrival_airport, departure_date, departure_time,
        bag_count, bag_weight, is_fragile,
        is_checkin, pincode, pickup_address, pickup_latitude, pickup_longitude, pickup_time,
        photos, additional_info, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        req.phone,
        username,
        isInternational ? 1 : 0, 
        isDomestic !== false ? 1 : 0, 
        airlineName, 
        flightNumber, 
        terminal,
        departureCity,
        departureAirport,
        arrivalCity,
        arrivalAirport,
        departureDate, 
        departureTime,
        bagCount || 1, 
        bagWeight, 
        isFragile ? 1 : 0,
        isCheckin ? 1 : 0, 
        pincode, 
        pickupAddress, 
        pickupLatitude, 
        pickupLongitude, 
        pickupTime,
        photos ? JSON.stringify(photos) : null, 
        additionalInfo, 
        'pending'
      ],
      (err, result) => {
        if (err) {
          console.error("Booking Error:", err);
          return res.json({ success: false, message: "Failed to create booking", error: err.message });
        }

        res.json({
          success: true,
          message: "Booking created successfully",
          bookingId: result.insertId
        });
      }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message
    });
  }
});

// Get booking
router.get("/:bookingId", verifyToken, (req, res) => {
  const { bookingId } = req.params;
  const phone = req.phone;

  const query = "SELECT * FROM bookings WHERE id = ? AND phone = ?";
  db.query(query, [bookingId, phone], (err, results) => {
    if (err) {
      return res.json({ success: false, message: "DB Error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking: results[0] });
  });
});

// Get user bookings
router.get("/", verifyToken, (req, res) => {
  const phone = req.phone;

  const query = "SELECT * FROM bookings WHERE phone = ? ORDER BY created_at DESC LIMIT 50";
  db.query(query, [phone], (err, results) => {
    if (err) {
      return res.json({ success: false, message: "DB Error", error: err });
    }

    res.json({ success: true, bookings: results });
  });
});

module.exports = router;