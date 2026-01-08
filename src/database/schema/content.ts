import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  pgEnum,
  varchar,
  check,
  timestamp,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const contentCategoryEnum = pgEnum('content_category', [
  'workout',
  'recipe',
]);
export const difficultyEnum = pgEnum('difficulty', [
  'beginner',
  'intermediate',
  'advanced',
]);

// ----------------------------------------------------------------------
// 3. FITNESS & DIET CONTENT
// ----------------------------------------------------------------------

// Polymorphic table for ALL videos (Workouts + Recipes)
export const videos = pgTable(
  'videos',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    videoUrl: text('video_url').notNull(), // S3 or YouTube URL
    thumbnailUrl: text('thumbnail_url'),

    // 'workout' or 'recipe'
    category: contentCategoryEnum('category').notNull(),

    // Filtering
    difficulty: difficultyEnum('difficulty'), // 'beginner', 'intermediate', 'advanced'
    durationSeconds: integer('duration_seconds').notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    durationCheck: check('duration_check', sql`${table.durationSeconds} >= 0`),
  }),
);

// Specific details for Recipes (Linked to a Video)
export const recipes = pgTable(
  'recipes',
  {
    id: serial('id').primaryKey(),
    videoId: integer('video_id')
      .references(() => videos.id)
      .notNull(), // One-to-One with Video

    description: text('description'),

    // Macros per serving
    calories: integer('calories').notNull(),
    protein: doublePrecision('protein_g').notNull(),
    carbs: doublePrecision('carbs_g').notNull(),
    fats: doublePrecision('fats_g').notNull(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    caloriesCheck: check('calories_check', sql`${table.calories} >= 0`),
    proteinCheck: check('protein_check', sql`${table.protein} >= 0`),
    carbsCheck: check('carbs_check', sql`${table.carbs} >= 0`),
    fatsCheck: check('fats_check', sql`${table.fats} >= 0`),
  }),
);

// Ingredients for Recipes
export const ingredients = pgTable(
  'ingredients',
  {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id')
      .references(() => recipes.id)
      .notNull(),
    itemName: varchar('item_name', { length: 255 }).notNull(), // e.g., "Chicken Breast"
    quantity: doublePrecision('quantity').notNull(), // e.g., 200
    unit: varchar('unit', { length: 50 }).notNull(), // e.g., "g", "ml", "cup"
  },
  (table) => ({
    quantityCheck: check('quantity_check', sql`${table.quantity} >= 0`),
  }),
);
