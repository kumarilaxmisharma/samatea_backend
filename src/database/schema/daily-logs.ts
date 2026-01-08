import {
  pgTable,
  uuid,
  integer,
  date,
  doublePrecision,
  uniqueIndex,
  check,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

// ----------------------------------------------------------------------
// 2. HOME SCREEN (TRACKING)
// ----------------------------------------------------------------------
export const dailyLogs = pgTable(
  'daily_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    date: date('date').notNull(), // Stores '2025-01-01'

    // Tracking Data
    waterIntakeMl: integer('water_intake_ml').default(0),
    caloriesBurned: integer('calories_burned').default(0),
    distanceKm: doublePrecision('distance_km').default(0.0),

    // Metadata
    streakCount: integer('streak_count').default(0), // Snapshot of streak at this date

    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => {
    return {
      // Constraint: A user can only have ONE log entry per date
      uniqueLog: uniqueIndex('unique_user_date_idx').on(
        table.userId,
        table.date,
      ),
      waterCheck: check('water_check', sql`${table.waterIntakeMl} >= 0`),
      caloriesCheck: check('calories_check', sql`${table.caloriesBurned} >= 0`),
      distanceCheck: check('distance_check', sql`${table.distanceKm} >= 0`),
      streakCheck: check('streak_check', sql`${table.streakCount} >= 0`),
    };
  },
);
