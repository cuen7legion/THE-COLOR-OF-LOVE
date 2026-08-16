import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "@shared/schema";
import path from "path";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "data.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema });

// Crear tablas si no existen
sqlite.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pin TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  level INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  avatar_color TEXT NOT NULL DEFAULT '#C4B5FD',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  city TEXT, country TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Mexico_City',
  latitude TEXT, longitude TEXT, birth_date TEXT,
  sun_sign TEXT, life_path INTEGER
);
CREATE TABLE IF NOT EXISTS emotional_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, type TEXT NOT NULL,
  primary_value TEXT NOT NULL, secondary_values TEXT,
  intensity INTEGER, notes TEXT,
  date TEXT NOT NULL, time TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, title TEXT,
  content TEXT NOT NULL, mood TEXT, tags TEXT,
  date TEXT NOT NULL, time TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  agent TEXT NOT NULL DEFAULT 'jaime',
  role TEXT NOT NULL, content TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL, description TEXT, category TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  target_date TEXT, created_at TEXT NOT NULL, completed_at TEXT
);
CREATE TABLE IF NOT EXISTS soul_footprint (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  life_narrative TEXT, core_self TEXT, origins_family TEXT,
  narrative_esteem TEXT, goals_work TEXT, relationships TEXT,
  body_health TEXT, erotic_energy TEXT, now_practices TEXT,
  communication TEXT, expansion_vision TEXT,
  diagnosis TEXT, strengths TEXT, wounds TEXT, patterns TEXT,
  growth_areas TEXT, recommended_modules TEXT,
  completion_percent INTEGER NOT NULL DEFAULT 0,
  last_updated TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS coveia_certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name TEXT NOT NULL, tool_url TEXT,
  developer TEXT NOT NULL, category TEXT NOT NULL,
  level TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0,
  validated_by TEXT NOT NULL, notes TEXT,
  certified_at TEXT NOT NULL, expires_at TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS coveia_complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name TEXT NOT NULL,
  reporter_name TEXT, reporter_email TEXT,
  principle_violated TEXT NOT NULL, chamber TEXT,
  severity TEXT NOT NULL, description TEXT NOT NULL,
  evidence TEXT, status TEXT NOT NULL DEFAULT 'recibida',
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS coveia_cert_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name TEXT NOT NULL, tool_url TEXT,
  developer TEXT NOT NULL, email TEXT NOT NULL,
  category TEXT NOT NULL, level_requested TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  feedback TEXT, created_at TEXT NOT NULL
);
`);

// ===== SEED DATA =====
const now = new Date().toISOString().split("T")[0];
const existingDirector = sqlite.prepare("SELECT id FROM users WHERE pin = ?").get("460046");
if (!existingDirector) {
  // Director Gabriel
  sqlite.prepare(`INSERT INTO users (pin, name, role, level, points, avatar_color, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run("460046", "Gabriel Hernandez Hernandez", "director", 5, 0, "#E4AD75", now);
  const gabrielId = (sqlite.prepare("SELECT id FROM users WHERE pin = ?").get("460046") as any).id;
  sqlite.prepare(`INSERT INTO profiles (user_id, city, country, timezone, latitude, longitude, sun_sign, life_path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(gabrielId, "Guadalajara", "Mexico", "America/Mexico_City", "20.66", "-103.35", "Tauro", 9);

  // 10 PINs de prueba nivel 5
  const testPins = ["126072","119894","127600","121599","115564","130805","102377","123919","110769","106832"];
  testPins.forEach((pin, i) => {
    sqlite.prepare(`INSERT INTO users (pin, name, role, level, points, avatar_color, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(pin, `Invitado ${i+1}`, "user", 5, 0, "#C4B5FD", now);
  });

  // Certificacion inicial de The Color of Love
  const expires = new Date(); expires.setFullYear(expires.getFullYear() + 1);
  sqlite.prepare(`INSERT INTO coveia_certifications (tool_name, tool_url, developer, category, level, score, validated_by, notes, certified_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    "The Color of Love", "", "Gabriel Hernandez Hernandez - Congruence Lab 53",
    "bienestar", "bronze", 88, "COVEIA - Comite Fundador",
    "Primera app certificada - caso piloto publico de COVEIA",
    now, expires.toISOString().split("T")[0]
  );
}

// ===== STORAGE INTERFACE =====
class DatabaseStorage {
  // Users
  getUserByPin(pin: string) { return db.select().from(schema.users).where(eq(schema.users.pin, pin)).get(); }
  getUserById(id: number) { return db.select().from(schema.users).where(eq(schema.users.id, id)).get(); }
  updateUserPoints(id: number, points: number) {
    return db.update(schema.users).set({ points }).where(eq(schema.users.id, id)).run();
  }

  // Profiles
  getProfile(userId: number) { return db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId)).get(); }

  // Emotional entries
  createEmotionalEntry(data: any) { return db.insert(schema.emotionalEntries).values(data).returning().get(); }
  getEmotionalEntries(userId: number) {
    return db.select().from(schema.emotionalEntries).where(eq(schema.emotionalEntries.userId, userId)).orderBy(desc(schema.emotionalEntries.id)).all();
  }

  // Diary
  createDiaryEntry(data: any) { return db.insert(schema.diaryEntries).values(data).returning().get(); }
  getDiaryEntries(userId: number) {
    return db.select().from(schema.diaryEntries).where(eq(schema.diaryEntries.userId, userId)).orderBy(desc(schema.diaryEntries.id)).all();
  }

  // Chat
  createChatMessage(data: any) { return db.insert(schema.chatMessages).values(data).returning().get(); }
  getChatMessages(userId: number, agent: string) {
    return db.select().from(schema.chatMessages)
      .where(and(eq(schema.chatMessages.userId, userId), eq(schema.chatMessages.agent, agent)))
      .orderBy(schema.chatMessages.id).all();
  }

  // Goals
  createGoal(data: any) { return db.insert(schema.goals).values(data).returning().get(); }
  getGoals(userId: number) {
    return db.select().from(schema.goals).where(eq(schema.goals.userId, userId)).orderBy(desc(schema.goals.id)).all();
  }
  updateGoal(id: number, data: any) {
    db.update(schema.goals).set(data).where(eq(schema.goals.id, id)).run();
    return db.select().from(schema.goals).where(eq(schema.goals.id, id)).get();
  }

  // Soul footprint
  getSoulFootprint(userId: number) {
    return db.select().from(schema.soulFootprint).where(eq(schema.soulFootprint.userId, userId)).get();
  }
  createSoulFootprint(data: any) { return db.insert(schema.soulFootprint).values(data).returning().get(); }
  updateSoulFootprint(userId: number, data: any) {
    const today = new Date().toISOString().split("T")[0];
    db.update(schema.soulFootprint).set({ ...data, lastUpdated: today }).where(eq(schema.soulFootprint.userId, userId)).run();
    return db.select().from(schema.soulFootprint).where(eq(schema.soulFootprint.userId, userId)).get();
  }

  // COVEIA
  getCoveiaCertifications() { return db.select().from(schema.coveiaCertifications).where(eq(schema.coveiaCertifications.isActive, 1)).all(); }
  createCoveiaCertification(data: any) { return db.insert(schema.coveiaCertifications).values(data).returning().get(); }
  getPublicCoveiaComplaints() { return db.select().from(schema.coveiaComplaints).where(eq(schema.coveiaComplaints.isPublic, 1)).orderBy(desc(schema.coveiaComplaints.id)).all(); }
  getAllCoveiaComplaints() { return db.select().from(schema.coveiaComplaints).orderBy(desc(schema.coveiaComplaints.id)).all(); }
  createCoveiaComplaint(data: any) { return db.insert(schema.coveiaComplaints).values(data).returning().get(); }
  updateCoveiaComplaint(id: number, data: any) {
    db.update(schema.coveiaComplaints).set(data).where(eq(schema.coveiaComplaints.id, id)).run();
    return db.select().from(schema.coveiaComplaints).where(eq(schema.coveiaComplaints.id, id)).get();
  }
  getCoveiaCertRequests() { return db.select().from(schema.coveiaCertRequests).orderBy(desc(schema.coveiaCertRequests.id)).all(); }
  createCoveiaCertRequest(data: any) { return db.insert(schema.coveiaCertRequests).values(data).returning().get(); }
  updateCoveiaCertRequest(id: number, data: any) {
    db.update(schema.coveiaCertRequests).set(data).where(eq(schema.coveiaCertRequests.id, id)).run();
    return db.select().from(schema.coveiaCertRequests).where(eq(schema.coveiaCertRequests.id, id)).get();
  }
  getCoveiaStats() {
    const certs = this.getCoveiaCertifications();
    const complaints = this.getAllCoveiaComplaints();
    const resolved = complaints.filter((c: any) => c.status === "resuelta").length;
    return {
      totalCertified: certs.length,
      bronze: certs.filter((c: any) => c.level === "bronze").length,
      silver: certs.filter((c: any) => c.level === "silver").length,
      gold: certs.filter((c: any) => c.level === "gold").length,
      totalComplaints: complaints.length,
      resolvedComplaints: resolved,
      resolutionRate: complaints.length ? Math.round((resolved / complaints.length) * 100) : 100,
    };
  }
}

export const storage = new DatabaseStorage();
