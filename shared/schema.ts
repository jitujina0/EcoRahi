import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull().default(0), // Out of 5 stars (stored as int * 10 for precision)
  pricePerPerson: integer("price_per_person").notNull(),
  recommendedDays: integer("recommended_days").notNull(),
  category: text("category").notNull(), // hill-station, waterfall, heritage, etc.
  features: text("features").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationId: varchar("destination_id").references(() => destinations.id),
  title: text("title").notNull(),
  duration: integer("duration").notNull(), // in days
  budget: integer("budget").notNull(),
  travelStyle: text("travel_style").array().notNull(),
  activities: jsonb("activities").notNull(), // JSON array of daily activities
  budgetBreakdown: jsonb("budget_breakdown").notNull(), // JSON object with cost breakdown
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationId: varchar("destination_id").references(() => destinations.id),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  location: text("location").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // homestay, guide, handicraft, food, photography
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  price: integer("price").notNull(),
  priceUnit: text("price_unit").notNull(), // per night, per day, per person, etc.
  rating: integer("rating").notNull().default(0),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  message: text("message").notNull(),
  isBot: boolean("is_bot").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const upsertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true, createdAt: true });
export const insertItinerarySchema = createInsertSchema(itineraries).omit({ id: true, createdAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true });

// Search and filter schemas
export const searchDestinationsSchema = z.object({
  query: z.string().optional(),
  duration: z.string().optional(),
  budget: z.string().optional(),
  travelStyle: z.string().optional(),
  category: z.string().optional(),
});

export const generateItinerarySchema = z.object({
  destination: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.number().min(1000),
  travelStyle: z.array(z.string()).min(1),
  duration: z.number().min(1),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
