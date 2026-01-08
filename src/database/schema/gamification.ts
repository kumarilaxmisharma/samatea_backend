import {
  pgTable,
  uuid,
  serial,
  text,
  integer,
  timestamp,
  primaryKey,
  varchar,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

// ----------------------------------------------------------------------
// 4. GAMIFICATION (BADGES)
// ----------------------------------------------------------------------
export const badges = pgTable(
  'badges',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(), // e.g., "Marathoner"
    description: text('description').notNull(),
    iconUrl: text('icon_url').notNull(),

    // Logic for unlocking (backend checks this)
    criteriaType: varchar('criteria_type', { length: 50 }).notNull(), // 'total_dist', 'streak_days'
    criteriaValue: integer('criteria_value').notNull(), // 100

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    criteriaValueCheck: check(
      'criteria_value_check',
      sql`${table.criteriaValue} >= 0`,
    ),
  }),
);

// Many-to-Many: Users <-> Badges
export const usersToBadges = pgTable(
  'users_to_badges',
  {
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    badgeId: integer('badge_id')
      .references(() => badges.id)
      .notNull(),
    earnedAt: timestamp('earned_at').defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.badgeId] }), // Composite PK
  }),
);
