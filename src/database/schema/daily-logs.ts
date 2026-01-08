import {
  pgTable,
  serial,
  integer,
  date,
  doublePrecision,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';

// ----------------------------------------------------------------------
// 2. HOME SCREEN (TRACKING)
// ----------------------------------------------------------------------
export const dailyLogs = pgTable(
  'daily_logs',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    date: date('date').notNull(), // Stores '2025-01-01'

    // Tracking Data
    waterIntakeMl: integer('water_intake_ml').default(0),
    caloriesBurned: integer('calories_burned').default(0),
    distanceKm: doublePrecision('distance_km').default(0.0),

    // Metadata
    streakCount: integer('streak_count').default(0), // Snapshot of streak at this date
  },
  (table) => {
    return {
      // Constraint: A user can only have ONE log entry per date
      uniqueLog: uniqueIndex('unique_user_date_idx').on(
        table.userId,
        table.date,
      ),
    };
  },
);
