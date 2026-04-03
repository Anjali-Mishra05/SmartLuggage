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
    console.log('DEBUG: Token verification - extracted phone:', phone, 'from decoded:', decoded);
    req.phone = phone;
    next();
  } catch (err) {
    console.error('DEBUG: Token verification error:', err.message);
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
    arrivalDate,
    arrivalTime,
    bagCount, 
    bagWeight, 
    isFragile, 
    isCheckin,
    pincode, 
    pickupAddress, 
    pickupLatitude, 
    pickupLongitude, 
    pickupTime,
    dropAddress,
    dropLatitude,
    dropLongitude,
    photos, 
    additionalInfo
  } = req.body;

  console.log('DEBUG: Creating booking for phone:', req.phone);
  try {
    const query = `
      INSERT INTO bookings (
        phone, username, is_international, is_domestic, airline_name, flight_number, terminal,
        departure_city, departure_airport, arrival_city, arrival_airport, departure_date, departure_time, arrival_date, arrival_time,
        bag_count, bag_weight, is_fragile, is_checkin, pincode, 
        pickup_address, pickup_latitude, pickup_longitude, pickup_time,
        drop_address, drop_latitude, drop_longitude,
        photos, additional_info, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        arrivalDate,
        arrivalTime,
        bagCount || 1, 
        bagWeight, 
        isFragile ? 1 : 0,
        isCheckin ? 1 : 0, 
        pincode, 
        pickupAddress, 
        pickupLatitude, 
        pickupLongitude, 
        pickupTime,
        dropAddress,
        dropLatitude,
        dropLongitude,
        photos ? JSON.stringify(photos) : null, 
        additionalInfo, 
        'pending'
      ],
      (err, result) => {
        if (err) {
          console.error("Booking Error:", err);
          return res.json({ success: false, message: "Failed to create booking", error: err.message });
        }

        console.log('DEBUG: Booking created successfully - ID:', result.insertId, 'for phone:', req.phone);
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
  let phone = req.phone;
  console.log('DEBUG: Fetching bookings for phone:', phone);

  // Normalize phone number - try both formats (with and without +91)
  let phonesToTry = [phone];
  
  // If phone starts with +91, also try without the +91
  if (phone && phone.startsWith('+91')) {
    phonesToTry.push(phone.substring(3)); // Remove +91
  } 
  // If phone doesn't start with +91 but is 10 digits, also try with +91
  else if (phone && phone.length === 10 && !phone.startsWith('0')) {
    phonesToTry.push('+91' + phone);
  }
  
  console.log('DEBUG: Trying phone formats:', phonesToTry);

  // Query with OR condition to match either format
  const placeholders = phonesToTry.map(() => '?').join(' OR phone = ');
  const query = `SELECT * FROM bookings WHERE phone = ${placeholders} ORDER BY created_at DESC LIMIT 50`;
  
  console.log('DEBUG: Executing query with values:', phonesToTry);
  db.query(query, phonesToTry, (err, results) => {
    if (err) {
      console.error('DEBUG: Database query error:', err);
      return res.json({ success: false, message: "DB Error", error: err });
    }

    console.log('DEBUG: Query results - found', results.length, 'bookings');
    if (results.length > 0) {
      console.log('DEBUG: First booking phone:', results[0].phone);
    }
    res.json({ success: true, bookings: results });
  });
});

module.exports = router;