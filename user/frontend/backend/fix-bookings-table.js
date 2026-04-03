const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'anjali@123',
    database: 'smart_luggage',
    port: 3307
});

conn.connect((err) => {
    if(err) { 
        console.error('Connection Error:', err); 
        process.exit(1); 
    }
    console.log('Connected to smart_luggage database');
    
    // Drop in reverse dependency order
    const dropQueries = [
        'DROP TABLE IF EXISTS booking_luggage_photos',
        'DROP TABLE IF EXISTS booking_locations',
        'DROP TABLE IF EXISTS bookings'
    ];
    
    let queryIndex = 0;
    
    const executeDrops = () => {
        if (queryIndex < dropQueries.length) {
            conn.query(dropQueries[queryIndex], (err) => {
                if(err) console.error('Drop error:', err);
                else console.log(`Dropped: ${dropQueries[queryIndex]}`);
                queryIndex++;
                executeDrops();
            });
        } else {
            createTables();
        }
    };
    
    const createTables = () => {
        const createSql = `CREATE TABLE bookings (
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
        )`;
        
        conn.query(createSql, (err) => {
            if(err) console.error('Create bookings error:', err);
            else console.log('✅ Bookings table created successfully!');
            conn.end();
        });
    };
    
    executeDrops();
});
