import { relations } from 'drizzle-orm';
import { users } from './users';
import { dailyLogs } from './daily-logs';
import { videos, recipes, ingredients } from './content';
import { badges, usersToBadges } from './gamification';
import { rewards, userRewards } from './rewards';

// ----------------------------------------------------------------------
// 5. RELATIONS (For Drizzle Queries)
// ----------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  logs: many(dailyLogs),
  badges: many(usersToBadges),
}));

export const dailyLogsRelations = relations(dailyLogs, ({ one }) => ({
  user: one(users, {
    fields: [dailyLogs.userId],
    references: [users.id],
  }),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  recipe: one(recipes), // A video might have one recipe details
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  video: one(videos, {
    fields: [recipes.videoId],
    references: [videos.id],
  }),
  ingredients: many(ingredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [ingredients.recipeId],
    references: [recipes.id],
  }),
}));

export const usersToBadgesRelations = relations(usersToBadges, ({ one }) => ({
  user: one(users, {
    fields: [usersToBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [usersToBadges.badgeId],
    references: [badges.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ many }) => ({
  owners: many(userRewards),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [userRewards.rewardId],
    references: [rewards.id],
  }),
}));
