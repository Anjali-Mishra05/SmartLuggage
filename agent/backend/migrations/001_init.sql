-- Smart Luggage Agent backend schema (MySQL 8+)

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(160) NOT NULL,
  mobile VARCHAR(32) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_mobile (mobile)
);

CREATE TABLE IF NOT EXISTS kyc (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,

  -- Step 1
  full_name VARCHAR(160) NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(32) NULL,
  date_of_birth VARCHAR(32) NULL,
  nationality VARCHAR(80) NULL,

  -- Step 2
  id_type VARCHAR(80) NULL,
  id_number VARCHAR(80) NULL,

  -- Step 3
  street_address TEXT NULL,
  city VARCHAR(120) NULL,
  state VARCHAR(120) NULL,
  postal_code VARCHAR(32) NULL,
  country VARCHAR(120) NULL,

  -- Step 5
  account_name VARCHAR(160) NULL,
  bank_name VARCHAR(160) NULL,
  account_number VARCHAR(64) NULL,
  ifsc_code VARCHAR(64) NULL,
  branch_name VARCHAR(160) NULL,

  -- Step 6 (optional)
  vehicle_type VARCHAR(80) NULL,
  vehicle_model VARCHAR(160) NULL,
  vehicle_color VARCHAR(80) NULL,
  license_plate VARCHAR(64) NULL,
  registration_number VARCHAR(64) NULL,

  -- Step 7
  emergency_name VARCHAR(160) NULL,
  emergency_relation VARCHAR(80) NULL,
  emergency_phone VARCHAR(32) NULL,
  emergency_alt_phone VARCHAR(32) NULL,
  emergency_email VARCHAR(190) NULL,
  emergency_address TEXT NULL,

  -- Step 8
  confirm_accuracy TINYINT(1) NOT NULL DEFAULT 0,
  agree_terms TINYINT(1) NOT NULL DEFAULT 0,
  agree_privacy TINYINT(1) NOT NULL DEFAULT 0,
  agree_communications TINYINT(1) NOT NULL DEFAULT 0,

  submitted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_kyc_user (user_id),
  CONSTRAINT fk_kyc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS kyc_files (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  kyc_id BIGINT UNSIGNED NOT NULL,
  field_name VARCHAR(64) NOT NULL,
  original_name VARCHAR(255) NULL,
  mime_type VARCHAR(120) NULL,
  file_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_kyc_files_user (user_id),
  KEY idx_kyc_files_kyc (kyc_id),
  CONSTRAINT fk_kyc_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_kyc_files_kyc FOREIGN KEY (kyc_id) REFERENCES kyc(id) ON DELETE CASCADE
);

