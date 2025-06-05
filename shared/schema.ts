import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age"),
  gender: text("gender"),
  chronicIllnesses: text("chronic_illnesses"),
  currentMedications: text("current_medications"),
  allergies: text("allergies"),
  language: text("language").default("fr"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symptoms: text("symptoms").notNull(),
  duration: text("duration"),
  medicalHistory: text("medical_history"),
  chatMessages: jsonb("chat_messages").default([]),
  preDiagnosis: text("pre_diagnosis"),
  urgencyLevel: text("urgency_level"),
  recommendations: text("recommendations"),
  niveauAnxiete: text("niveau_anxiete"), // "léger", "modéré", "élevé"
  messageSoutien: text("message_soutien"),
  pdfGenerated: boolean("pdf_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  specialty: text("specialty").notNull(),
  city: text("city").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  rating: real("rating").default(0), // 0-5 scale with decimals
  reviewCount: integer("review_count").default(0),
  tags: jsonb("tags").default([]), // Array of tags like ["Urgence", "Disponible", "Top Avis"]
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctorReviews = pgTable("doctor_reviews", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull(),
  userId: integer("user_id"), // nullable for anonymous reviews
  rating: integer("rating").notNull(), // 1-5 scale
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctorSearchStats = pgTable("doctor_search_stats", {
  id: serial("id").primaryKey(),
  specialty: text("specialty"),
  city: text("city"),
  searchCount: integer("search_count").default(1),
  lastSearched: timestamp("last_searched").defaultNow(),
});

// Medical Records & Health Passport Tables
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recordType: text("record_type").notNull(), // "vaccination", "allergy", "medication", "condition", "lab_result"
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  doctor: text("doctor"),
  facility: text("facility"),
  notes: text("notes"),
  attachments: jsonb("attachments").default([]), // File URLs/paths
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(), // "daily", "twice_daily", "weekly", etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  prescribedBy: text("prescribed_by"),
  instructions: text("instructions"),
  reminderEnabled: boolean("reminder_enabled").default(true),
  reminderTimes: jsonb("reminder_times").default([]), // Array of time strings ["08:00", "20:00"]
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const symptomTracking = pgTable("symptom_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symptom: text("symptom").notNull(),
  severity: integer("severity").notNull(), // 1-10 scale
  date: timestamp("date").notNull(),
  triggers: text("triggers"),
  notes: text("notes"),
  mood: text("mood"), // "good", "neutral", "bad"
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthPassport = pgTable("health_passport", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  qrCode: text("qr_code").notNull().unique(),
  emergencyContacts: jsonb("emergency_contacts").default([]),
  bloodType: text("blood_type"),
  insuranceNumber: text("insurance_number"),
  insuranceProvider: text("insurance_provider"), // "CNSS", "CNOPS", etc.
  criticalAllergies: jsonb("critical_allergies").default([]),
  chronicConditions: jsonb("chronic_conditions").default([]),
  currentMedications: jsonb("current_medications").default([]),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  pdfGenerated: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const consultationStartSchema = z.object({
  symptoms: z.string().min(10),
  duration: z.string(),
  medicalHistory: z.string().optional(),
});

export const chatMessageSchema = z.object({
  consultationId: z.number(),
  message: z.string(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
  rating: true,
  reviewCount: true,
});

export const insertDoctorReviewSchema = createInsertSchema(doctorReviews).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

export const doctorSearchSchema = z.object({
  specialty: z.string().optional(),
  city: z.string().optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
});

export const doctorReviewSubmissionSchema = z.object({
  doctorId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
});

// Medical Records & Health Passport Schemas
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
});

export const insertSymptomTrackingSchema = createInsertSchema(symptomTracking).omit({
  id: true,
  createdAt: true,
});

export const insertHealthPassportSchema = createInsertSchema(healthPassport).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const medicationReminderSchema = z.object({
  medicationId: z.number(),
  time: z.string(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type DoctorReview = typeof doctorReviews.$inferSelect;
export type InsertDoctorReview = z.infer<typeof insertDoctorReviewSchema>;
export type DoctorSearch = z.infer<typeof doctorSearchSchema>;
export type DoctorReviewSubmission = z.infer<typeof doctorReviewSubmissionSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type ConsultationStart = z.infer<typeof consultationStartSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;

// Medical Records & Health Passport Types
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type SymptomTracking = typeof symptomTracking.$inferSelect;
export type InsertSymptomTracking = z.infer<typeof insertSymptomTrackingSchema>;
export type HealthPassport = typeof healthPassport.$inferSelect;
export type InsertHealthPassport = z.infer<typeof insertHealthPassportSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type MedicationReminder = z.infer<typeof medicationReminderSchema>;
