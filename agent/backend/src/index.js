import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import multer from "multer";

import { getPool, testConnection } from "./db.js";
import { requireAuth, signToken } from "./auth.js";
import { signupSchema, loginSchema, kycSchema } from "./validate.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 4000);
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const uploadDirAbs = path.join(__dirname, "..", UPLOAD_DIR);
fs.mkdirSync(uploadDirAbs, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirAbs),
  filename: (req, file, cb) => {
    const userId = req.user?.id ? String(req.user.id) : "anon";
    const safeOriginal = (file.originalname || "file").replace(/[^\w.\-]+/g, "_");
    const name = `${Date.now()}_${userId}_${file.fieldname}_${safeOriginal}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per file
});

function pick(obj, keys) {
  const out = {};
  for (const k of keys) if (obj[k] !== undefined) out[k] = obj[k];
  return out;
}

const app = express();
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.json({ message: "SmartLuggage Backend is Running" }));

// Serve uploaded files (for demo/dev)
app.use("/uploads", express.static(uploadDirAbs));

app.post("/api/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const { fullName, mobile, password } = parsed.data;
  const pool = getPool();

  const [existing] = await pool.query("SELECT id FROM users WHERE mobile = ? LIMIT 1", [mobile]);
  if (existing.length) return res.status(409).json({ error: "Mobile already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (full_name, mobile, password_hash) VALUES (?, ?, ?)",
    [fullName, mobile, passwordHash]
  );

  const user = { id: result.insertId, mobile, fullName };
  const token = signToken({ id: user.id, mobile: user.mobile });
  return res.json({ token, user: { id: user.id, mobile: user.mobile, fullName: user.fullName } });
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const { mobile, password } = parsed.data;
  const pool = getPool();
  const [rows] = await pool.query("SELECT id, full_name, mobile, password_hash FROM users WHERE mobile = ? LIMIT 1", [mobile]);
  if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken({ id: user.id, mobile: user.mobile });
  return res.json({ token, user: { id: user.id, mobile: user.mobile, fullName: user.full_name } });
});

app.get("/api/me", requireAuth, async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.query("SELECT id, full_name, mobile, created_at FROM users WHERE id = ? LIMIT 1", [req.user.id]);
  if (!rows.length) return res.status(404).json({ error: "User not found" });
  return res.json({ user: rows[0] });
});

app.get("/api/kyc", requireAuth, async (req, res) => {
  const pool = getPool();
  const [kycRows] = await pool.query("SELECT * FROM kyc WHERE user_id = ? LIMIT 1", [req.user.id]);
  const kyc = kycRows[0] || null;

  const [fileRows] = await pool.query(
    "SELECT field_name, original_name, mime_type, file_path, created_at FROM kyc_files WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id]
  );

  return res.json({
    kyc,
    files: fileRows.map((f) => ({
      fieldName: f.field_name,
      originalName: f.original_name,
      mimeType: f.mime_type,
      url: `/uploads/${path.basename(f.file_path)}`,
      createdAt: f.created_at,
    })),
  });
});

app.post(
  "/api/kyc",
  requireAuth,
  upload.fields([
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
    { name: "vehicleDocument", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
  ]),
  async (req, res) => {
    // For multipart/form-data, text fields arrive in req.body as strings
    const parsed = kycSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

    const data = parsed.data;
    const pool = getPool();

    // Upsert KYC row (1 per user)
    const kycCols = {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.dateOfBirth,
      nationality: data.nationality,
      id_type: data.idType,
      id_number: data.idNumber,
      street_address: data.streetAddress,
      city: data.city,
      state: data.state,
      postal_code: data.postalCode,
      country: data.country,
      account_name: data.accountName,
      bank_name: data.bankName,
      account_number: data.accountNumber,
      ifsc_code: data.ifscCode,
      branch_name: data.branchName,
      vehicle_type: data.vehicleType,
      vehicle_model: data.vehicleModel,
      vehicle_color: data.vehicleColor,
      license_plate: data.licensePlate,
      registration_number: data.registrationNumber,
      emergency_name: data.emergencyName,
      emergency_relation: data.emergencyRelation,
      emergency_phone: data.emergencyPhone,
      emergency_alt_phone: data.emergencyAltPhone,
      emergency_email: data.emergencyEmail,
      emergency_address: data.emergencyAddress,
      confirm_accuracy: data.confirmAccuracy ? 1 : 0,
      agree_terms: data.agreeTerms ? 1 : 0,
      agree_privacy: data.agreePrivacy ? 1 : 0,
      agree_communications: data.agreeCommunications ? 1 : 0,
      submitted_at: new Date(),
    };

    const cols = Object.keys(kycCols).filter((k) => kycCols[k] !== undefined);
    const vals = cols.map((k) => kycCols[k]);

    // Create if missing
    const [existingRows] = await pool.query("SELECT id FROM kyc WHERE user_id = ? LIMIT 1", [req.user.id]);
    let kycId;
    if (!existingRows.length) {
      const [ins] = await pool.query(
        `INSERT INTO kyc (user_id, ${cols.join(", ")}) VALUES (?, ${cols.map(() => "?").join(", ")})`,
        [req.user.id, ...vals]
      );
      kycId = ins.insertId;
    } else {
      kycId = existingRows[0].id;
      if (cols.length) {
        await pool.query(
          `UPDATE kyc SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE user_id = ?`,
          [...vals, req.user.id]
        );
      }
    }

    const files = req.files || {};
    const accepted = ["idFront", "idBack", "addressProof", "selfie", "vehicleDocument", "drivingLicense"];
    for (const fieldName of accepted) {
      const file = Array.isArray(files[fieldName]) ? files[fieldName][0] : null;
      if (!file) continue;

      await pool.query(
        "INSERT INTO kyc_files (user_id, kyc_id, field_name, original_name, mime_type, file_path) VALUES (?, ?, ?, ?, ?, ?)",
        [req.user.id, kycId, fieldName, file.originalname, file.mimetype, file.path]
      );
    }

    return res.json({ ok: true, kycId });
  }
);

// Bookings API routes
app.use("/api/bookings", bookingRoutes);

// 404 Handler - MUST be before error handler
app.use((req, res) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.url}` });
});

app.use((err, _req, res, _next) => {
  // Multer errors, etc.
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: "Server error" });
});

app.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
  await testConnection();
});

