import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const animes = pgTable("animes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  modelCount: integer("model_count").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const characters = pgTable("characters", {
  id: text("id").primaryKey(),
  animeId: text("anime_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  videoUrl: text("video_url").notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  characterId: text("character_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  characterId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Anime = typeof animes.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
