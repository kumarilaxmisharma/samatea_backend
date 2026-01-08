import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
} from 'drizzle-orm/pg-core';

// ----------------------------------------------------------------------
// 1. USERS & PROFILE
// ----------------------------------------------------------------------
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(), // Managed by your Auth (e.g., Better-Auth/Lucia)

  // Profile Stats
  name: text('name').notNull(),
  gender: text('gender').notNull(), // 'male', 'female', 'other'
  age: integer('age').notNull(),
  heightCm: doublePrecision('height_cm').notNull(),
  weightKg: doublePrecision('weight_kg').notNull(),

  // Goals
  targetWaterMl: integer('target_water_ml').default(2000), // Default 2L
  targetCalories: integer('target_calories').default(500),

  // Gamification (RPG Elements)
  totalXp: integer('total_xp').default(0),
  currentLevel: integer('current_level').default(1),
  walletBalance: integer('wallet_balance').default(0), // "FitCoins"

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
