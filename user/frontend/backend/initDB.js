const db = require("./db");

const initializeDatabase = () => {
  // Create bookings table if it doesn't exist
  const bookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone VARCHAR(20) NOT NULL,
      username VARCHAR(100),
      is_international BOOLEAN DEFAULT FALSE,
      is_domestic BOOLEAN DEFAULT TRUE,
      airline_name VARCHAR(100),
      flight_number VARCHAR(50),
      terminal VARCHAR(50),
      departure_airport VARCHAR(50),
      arrival_airport VARCHAR(50),
      departure_date DATE,
      departure_time TIME,
      arrival_date DATE,
      arrival_time TIME,
      bag_count INT,
      bag_weight FLOAT,
      is_fragile BOOLEAN DEFAULT FALSE,
      is_checkin BOOLEAN DEFAULT FALSE,
      pincode INT,
      pickup_address TEXT,
      pickup_latitude DECIMAL(10, 8),
      pickup_longitude DECIMAL(11, 8),
      pickup_time TIME,
      drop_address TEXT,
      drop_latitude DECIMAL(10, 8),
      drop_longitude DECIMAL(11, 8),
      photos JSON,
      additional_info TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (phone) REFERENCES users(phone),
      INDEX idx_phone (phone),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    )
  `;

  db.query(bookingsTable, (err) => {
    if (err) {
      console.error("Error creating bookings table:", err);
    } else {
      console.log("Bookings table ready ✅");
    }
  });
};

module.exports = initializeDatabase;
