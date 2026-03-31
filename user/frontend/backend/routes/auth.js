const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
let otpStore = {}; 

// ---------------- REGISTER ----------------
router.post("/register", (req, res) => {
    const { name, phone, password, email } = req.body;

    // Debugging: Check what the backend is actually receiving from the app
    console.log("Registration Request Body:", req.body);

    if (!name || !phone || !password) {
        return res.json({ success: false, message: "Name, Phone, and Password are required" });
    }

    const checkQuery = "SELECT * FROM users WHERE phone = ?";
    db.query(checkQuery, [phone], (err, results) => {
        if (err) return res.json({ success: false, message: "DB Error", error: err });
        if (results.length > 0) return res.json({ success: false, message: "User already registered" });

        // Ensure email is never undefined. If it's missing, store as empty string.
        const finalEmail = (email && email.trim() !== "") ? email.trim().toLowerCase() : "";

        const query = "INSERT INTO users (name, phone, password, email) VALUES (?,?,?,?)";
        db.query(query, [name.trim(), phone, password, finalEmail], (err, result) => {
            if (err) {
                console.error("SQL Error during registration:", err);
                return res.json({ success: false, message: "Failed to save user in DB", error: err });
            }
            
            console.log(`[Registration Success] User: ${name}, Email: ${finalEmail || 'None'}`);
            return res.json({ 
                success: true, 
                message: "User registered successfully!",
                user: { name, phone, email: finalEmail } 
            });
        });
    });
});

// ---------------- SEND OTP ----------------
router.post("/send-otp", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.json({ success: false, message: "Phone is required" });

    // Flexible matching to find user regardless of +91 prefix
    const userQuery = "SELECT * FROM users WHERE phone LIKE ?";
    const searchPhone = `%${phone.replace("+91", "")}`; 

    db.query(userQuery, [searchPhone], async (err, results) => {
        if (err) return res.json({ success: false, message: "Database error" });
        
        if (results.length === 0) {
            return res.json({ success: false, message: "User not found. Please register first." });
        }

        const otp = generateOtp();
        otpStore[phone] = otp;

        try {
            await client.messages.create({
                body: `Your Smart Luggage OTP is ${otp}`,
                from: process.env.TWILIO_PHONE,
                to: phone
            });
            console.log(`[OTP Sent] Phone: ${phone} | Code: ${otp}`);
            res.json({ success: true, message: "OTP sent successfully!" });
        } catch (err) {
            console.error("Twilio Error:", err.message);
            res.json({ success: false, message: "Failed to send SMS via Twilio" });
        }
    });
});

// ---------------- VERIFY OTP ----------------
router.post("/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.json({ success: false, message: "Phone or OTP missing" });

    if (otpStore[phone] === otp) {
        delete otpStore[phone];

        const query = "SELECT name, phone, email FROM users WHERE phone LIKE ?";
        const searchPhone = `%${phone.replace("+91", "")}`;

        db.query(query, [searchPhone], (err, results) => {
            if (results && results.length > 0) {
                console.log(`[Login Success] Verified User: ${results[0].name}`);
                return res.json({ 
                    success: true, 
                    message: "OTP verified successfully!", 
                    user: results[0] 
                });
            } else {
                return res.json({ success: false, message: "User details not found" });
            }
        });
    } else {
        return res.json({ success: false, message: "Invalid OTP" });
    }
});

// ---------------- LOGIN (Password) ----------------
router.post("/login", (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) return res.json({ success: false, message: "Phone & Password required" });

    const query = "SELECT id, name, phone, email FROM users WHERE phone LIKE ? AND password = ?";
    const searchPhone = `%${phone.replace("+91", "")}`;

    db.query(query, [searchPhone, password], (err, results) => {
        if (err) return res.json({ success: false, message: "DB Error", error: err });

        if (results.length > 0) {
            console.log(`[Login Success] Password Login: ${results[0].name}`);
            return res.json({ 
                success: true, 
                message: "Login successful", 
                user: results[0] 
            });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

// ---------------- GET USER PROFILE ----------------
// Access this at: http://YOUR_IP:5000/api/auth/user-profile?phone=XXXXXXXXXX
router.get("/user-profile", (req, res) => {
    const phone = req.query.phone;

    if (!phone) {
        return res.json({ success: false, message: "Phone required" });
    }

    const query = "SELECT name, phone, email FROM users WHERE phone = ? LIMIT 1";

    db.query(query, [phone], (err, results) => {
        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        if (results.length > 0) {
            return res.json({
                success: true,
                name: results[0].name,
                phone: results[0].phone,
                email: results[0].email
            });
        } else {
            return res.json({ success: false, message: "User not found" });
        }
    });
});
module.exports = router;