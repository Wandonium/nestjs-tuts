import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { posts } from 'src/posts/schema';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  password: text('password'),
});

export const userRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
  profile: one(profile),
}));

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  age: integer('age'),
  biography: text('biography'),
  userId: integer('user_id').references(() => users.id),
});

export const profileRelations = relations(profile, ({ one }) => ({
  users: one(users, { fields: [profile.userId], references: [users.id] }),
}));
