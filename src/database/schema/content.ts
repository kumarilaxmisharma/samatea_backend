import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core';

// ----------------------------------------------------------------------
// 3. FITNESS & DIET CONTENT
// ----------------------------------------------------------------------

// Polymorphic table for ALL videos (Workouts + Recipes)
export const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  videoUrl: text('video_url').notNull(), // S3 or YouTube URL
  thumbnailUrl: text('thumbnail_url'),

  // 'workout' or 'recipe'
  category: text('category').notNull(),

  // Filtering
  difficulty: text('difficulty'), // 'beginner', 'intermediate', 'advanced'
  durationSeconds: integer('duration_seconds').notNull(),
});

// Specific details for Recipes (Linked to a Video)
export const recipes = pgTable('recipes', {
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
});

// Ingredients for Recipes
export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  recipeId: integer('recipe_id')
    .references(() => recipes.id)
    .notNull(),
  itemName: text('item_name').notNull(), // e.g., "Chicken Breast"
  quantity: doublePrecision('quantity').notNull(), // e.g., 200
  unit: text('unit').notNull(), // e.g., "g", "ml", "cup"
});
