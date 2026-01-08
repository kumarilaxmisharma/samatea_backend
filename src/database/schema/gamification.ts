import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { users } from './users';

// ----------------------------------------------------------------------
// 4. GAMIFICATION (BADGES)
// ----------------------------------------------------------------------
export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // e.g., "Marathoner"
  description: text('description').notNull(),
  iconUrl: text('icon_url').notNull(),

  // Logic for unlocking (backend checks this)
  criteriaType: text('criteria_type').notNull(), // 'total_dist', 'streak_days'
  criteriaValue: integer('criteria_value').notNull(), // 100
});

// Many-to-Many: Users <-> Badges
export const usersToBadges = pgTable(
  'users_to_badges',
  {
    userId: integer('user_id')
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
