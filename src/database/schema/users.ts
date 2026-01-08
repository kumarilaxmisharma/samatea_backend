import {
  pgTable,
  uuid,
  integer,
  doublePrecision,
  timestamp,
  varchar,
  pgEnum,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define the Enum
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

// ----------------------------------------------------------------------
// 1. USERS & PROFILE
// ----------------------------------------------------------------------
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Using varchar with limit 255 for standard string fields
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),

    // Profile Stats
    name: varchar('name', { length: 255 }).notNull(),
    gender: genderEnum('gender').notNull(), // Using Postgres Enum

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
  },
  (table) => {
    return {
      ageCheck: check('age_check', sql`${table.age} >= 0`),
    };
  },
);
