import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const EMPTY_DB = { users: [], harvests: [] };

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(EMPTY_DB, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return { ...EMPTY_DB };
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/**
 * Minimal JSON-file data layer for this demo app.
 * Not for production use: no transactions, no concurrent-write locking.
 * Swapping this module for a real database is the natural first exercise
 * for anyone extending this sample.
 */
export const db = {
  getUsers() {
    return readDb().users;
  },
  findUserByEmail(email) {
    return readDb().users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase()
    );
  },
  findUserById(id) {
    return readDb().users.find((u) => u.id === id);
  },
  insertUser(user) {
    const data = readDb();
    data.users.push(user);
    writeDb(data);
    return user;
  },
  getHarvests() {
    return readDb().harvests;
  },
  getHarvestsByFarmer(farmerId) {
    return readDb().harvests.filter((h) => h.farmerId === farmerId);
  },
  findHarvestById(id) {
    return readDb().harvests.find((h) => h.id === id);
  },
  insertHarvest(harvest) {
    const data = readDb();
    data.harvests.push(harvest);
    writeDb(data);
    return harvest;
  },
  updateHarvest(id, patch) {
    const data = readDb();
    const idx = data.harvests.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    data.harvests[idx] = { ...data.harvests[idx], ...patch };
    writeDb(data);
    return data.harvests[idx];
  },
};
