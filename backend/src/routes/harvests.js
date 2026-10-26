import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";
import { db } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG or WEBP photos are allowed"));
    }
    cb(null, true);
  },
});

const router = Router();

// Farmer: submit a new harvest batch
router.post(
  "/",
  requireAuth,
  requireRole("farmer"),
  upload.single("photo"),
  (req, res) => {
    const { weightKg, location, harvestDate, notes } = req.body || {};

    if (!weightKg || !location || !harvestDate) {
      return res.status(400).json({ error: "weightKg, location and harvestDate are required" });
    }
    const weight = Number(weightKg);
    if (!Number.isFinite(weight) || weight <= 0) {
      return res.status(400).json({ error: "weightKg must be a positive number" });
    }

    const harvest = {
      id: uuid(),
      farmerId: req.user.id,
      weightKg: weight,
      location: String(location).slice(0, 200),
      harvestDate,
      notes: notes ? String(notes).slice(0, 1000) : "",
      photoFilename: req.file ? req.file.filename : null,
      status: "pending",
      millNote: null,
      createdAt: new Date().toISOString(),
    };
    db.insertHarvest(harvest);
    return res.status(201).json(harvest);
  }
);

// Farmer: list own harvests. Mill: list all harvests (optionally filtered by status).
router.get("/", requireAuth, (req, res) => {
  if (req.user.role === "farmer") {
    return res.json(db.getHarvestsByFarmer(req.user.id));
  }
  const { status } = req.query;
  const all = db.getHarvests();
  return res.json(status ? all.filter((h) => h.status === status) : all);
});

// Mill: approve or reject a harvest batch
router.patch("/:id/decision", requireAuth, requireRole("mill"), (req, res) => {
  const { decision, millNote } = req.body || {};
  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({ error: "decision must be 'approved' or 'rejected'" });
  }

  const harvest = db.findHarvestById(req.params.id);
  if (!harvest) {
    return res.status(404).json({ error: "Harvest not found" });
  }

  const updated = db.updateHarvest(harvest.id, {
    status: decision,
    millNote: millNote ? String(millNote).slice(0, 500) : null,
    decidedAt: new Date().toISOString(),
    decidedBy: req.user.id,
  });
  return res.json(updated);
});

export default router;
