const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    // Force 127.0.0.1 to avoid the 'ECONNREFUSED ::1' error
    host: process.env.DB_HOST || "localhost", 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smart_luggage",
    port: 3306
});

db.connect((err) => {
    if(err) {
        console.log("DB Connection Error:", err.message);
    } else {
        console.log("DB Connected Successfully");
    }
});

module.exports = db;