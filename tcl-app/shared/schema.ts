import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== USERS =====
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pin: text("pin").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // user | director
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  avatarColor: text("avatar_color").notNull().default("#C4B5FD"),
  createdAt: text("created_at").notNull(),
});
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ===== PROFILES =====
export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  city: text("city"),
  country: text("country"),
  timezone: text("timezone").notNull().default("America/Mexico_City"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  birthDate: text("birth_date"),
  sunSign: text("sun_sign"),
  lifePath: integer("life_path"),
});
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export type Profile = typeof profiles.$inferSelect;

// ===== EMOTIONAL ENTRIES (Hawkins, Plutchik, checkins) =====
export const emotionalEntries = sqliteTable("emotional_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // hawkins | plutchik | checkin
  primaryValue: text("primary_value").notNull(),
  secondaryValues: text("secondary_values"),
  intensity: integer("intensity"),
  notes: text("notes"),
  date: text("date").notNull(),
  time: text("time").notNull(),
});
export const insertEmotionalEntrySchema = createInsertSchema(emotionalEntries).omit({ id: true });
export type EmotionalEntry = typeof emotionalEntries.$inferSelect;

// ===== DIARY =====
export const diaryEntries = sqliteTable("diary_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  mood: text("mood"),
  tags: text("tags"), // JSON array
  date: text("date").notNull(),
  time: text("time").notNull(),
});
export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({ id: true });
export type DiaryEntry = typeof diaryEntries.$inferSelect;

// ===== CHAT MESSAGES (Jaime + Sombras) =====
export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  agent: text("agent").notNull().default("jaime"), // jaime | sombras
  role: text("role").notNull(), // user | assistant
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
});
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true });
export type ChatMessage = typeof chatMessages.$inferSelect;

// ===== GOALS =====
export const goals = sqliteTable("goals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  status: text("status").notNull().default("active"), // active | completed | archived
  targetDate: text("target_date"),
  createdAt: text("created_at").notNull(),
  completedAt: text("completed_at"),
});
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true });
export type Goal = typeof goals.$inferSelect;

// ===== HUELLA DEL ALMA — Motor de Conciencia =====
export const soulFootprint = sqliteTable("soul_footprint", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  lifeNarrative: text("life_narrative"),
  coreSelf: text("core_self"),
  originsFamily: text("origins_family"),
  narrativeEsteem: text("narrative_esteem"),
  goalsWork: text("goals_work"),
  relationships: text("relationships"),
  bodyHealth: text("body_health"),
  eroticEnergy: text("erotic_energy"),
  nowPractices: text("now_practices"),
  communication: text("communication"),
  expansionVision: text("expansion_vision"),
  diagnosis: text("diagnosis"),
  strengths: text("strengths"),
  wounds: text("wounds"),
  patterns: text("patterns"),
  growthAreas: text("growth_areas"),
  recommendedModules: text("recommended_modules"),
  completionPercent: integer("completion_percent").notNull().default(0),
  lastUpdated: text("last_updated").notNull(),
  createdAt: text("created_at").notNull(),
});
export const insertSoulFootprintSchema = createInsertSchema(soulFootprint).omit({ id: true });
export type SoulFootprint = typeof soulFootprint.$inferSelect;

// ===== COVEIA — Comite de Validacion Etica =====
export const coveiaCertifications = sqliteTable("coveia_certifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toolName: text("tool_name").notNull(),
  toolUrl: text("tool_url"),
  developer: text("developer").notNull(),
  category: text("category").notNull(),
  level: text("level").notNull(), // bronze | silver | gold
  score: integer("score").notNull().default(0),
  validatedBy: text("validated_by").notNull(),
  notes: text("notes"),
  certifiedAt: text("certified_at").notNull(),
  expiresAt: text("expires_at").notNull(),
  isActive: integer("is_active").notNull().default(1),
});
export const insertCoveiaCertificationSchema = createInsertSchema(coveiaCertifications).omit({ id: true });
export type CoveiaCertification = typeof coveiaCertifications.$inferSelect;

export const coveiaComplaints = sqliteTable("coveia_complaints", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toolName: text("tool_name").notNull(),
  reporterName: text("reporter_name"),
  reporterEmail: text("reporter_email"),
  principleViolated: text("principle_violated").notNull(),
  chamber: text("chamber"),
  severity: text("severity").notNull(), // leve | moderado | grave | critico
  description: text("description").notNull(),
  evidence: text("evidence"),
  status: text("status").notNull().default("recibida"), // recibida | en_revision | resuelta | rechazada
  isPublic: integer("is_public").notNull().default(0),
  createdAt: text("created_at").notNull(),
});
export const insertCoveiaComplaintSchema = createInsertSchema(coveiaComplaints).omit({ id: true });
export type CoveiaComplaint = typeof coveiaComplaints.$inferSelect;

export const coveiaCertRequests = sqliteTable("coveia_cert_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  toolName: text("tool_name").notNull(),
  toolUrl: text("tool_url"),
  developer: text("developer").notNull(),
  email: text("email").notNull(),
  category: text("category").notNull(),
  levelRequested: text("level_requested").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pendiente"), // pendiente | en_proceso | aprobada | rechazada
  feedback: text("feedback"),
  createdAt: text("created_at").notNull(),
});
export const insertCoveiaCertRequestSchema = createInsertSchema(coveiaCertRequests).omit({ id: true });
export type CoveiaCertRequest = typeof coveiaCertRequests.$inferSelect;
