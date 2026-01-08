import {
  pgTable,
  uuid,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  varchar,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const rewardCategoryEnum = pgEnum('reward_category', [
  'digital',
  'gear',
  'nutrition',
  'other',
]);

// ----------------------------------------------------------------------
// 6. HEALTH CURRENCY (MARKETPLACE)
// ----------------------------------------------------------------------

// The Store Catalog (Left Screen in your image)
export const rewards = pgTable(
  'rewards',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(), // e.g., "15% Off Nike Store"
    description: text('description').notNull(),
    // Visuals
    brandLogoUrl: text('brand_logo_url'), // The circular logo
    bannerUrl: text('banner_url'), // Background image for the card
    // Cost
    costCoins: integer('cost_coins').notNull(), // e.g., 500
    // Logic
    category: rewardCategoryEnum('category').notNull(), // 'digital', 'gear', 'nutrition'
    isActive: boolean('is_active').default(true), // To hide out-of-stock items

    // For external coupons
    promoCode: varchar('promo_code', { length: 255 }), // e.g., "FITTRACK2025" (hidden until bought)

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    costCheck: check('cost_check', sql`${table.costCoins} >= 0`),
  }),
);

// The User's Inventory (Right Screen in your image)
export const userRewards = pgTable('user_rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  rewardId: integer('reward_id')
    .references(() => rewards.id)
    .notNull(),

  purchasedAt: timestamp('purchased_at').defaultNow(),
  isRedeemed: boolean('is_redeemed').default(false), // If they used the QR code

  // For unique codes generated per user (optional)
  uniqueCouponCode: text('unique_coupon_code'),
});
