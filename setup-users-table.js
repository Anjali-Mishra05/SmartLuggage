const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "anjali@123",
    database: "smart_luggage",
    port: 3307
});

connection.connect((err) => {
    if (err) {
        console.error("Connection Error:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL");

    const sql = `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            phone VARCHAR(15) UNIQUE,
            email VARCHAR(100),
            password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
        } else {
            console.log("✅ Users table created successfully!");
        }
        connection.end();
    });
});
