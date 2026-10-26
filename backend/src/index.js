import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import harvestRoutes from "./routes/harvests.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set. Copy .env.example to .env and set a real secret.");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Harvest photos are served read-only; uploads themselves require auth.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/harvests", harvestRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// 404 handler
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Centralized error handler (e.g. Multer file-type/size errors)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 400).json({ error: err.message || "Unexpected error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AgriTrace API listening on http://localhost:${PORT}`);
});
